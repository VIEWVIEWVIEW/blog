import { Component, createSignal, JSX, onMount, Show } from 'solid-js'
import { debounce } from "@solid-primitives/scheduled";
import MiniSearch, { SearchResult, Suggestion } from 'minisearch'

/* Types for search.json */
interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface SearchDbEntry {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  pubDate: Date;
  headings: Heading[];
  updateDate?: Date;
}

// src: Heroicons.com
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 group-hover:fill-slate-300">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>


// Search button opens the dialog if clicked
const SearchButton: Component = () => {
  const [dialogOpen, setDialogOpen] = createSignal(false)

  // load search.json
  const searchDb = fetch('/search.json').then(response => response.json()) as Promise<SearchDbEntry[]>

  const updateDialogOpen = (value: boolean) => {
    setDialogOpen(value)
    if (value) {
      // disable scroll
      document.body.style.overflow = 'hidden'
    } else {
      // enable scroll
      document.body.style.overflow = 'auto'
    }
  }

  // install ctrl+k shortcut to open search dialog
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      updateDialogOpen(true)
    }
  })


  return <>
    {/* Search button */}
    <button
      class="h-9 mx-3 flex items-center justify-center dark:text-white text-slate-900 group"
      onClick={() => updateDialogOpen(true)}
    >
      {SearchIcon}
      <kbd class="font-mono font-light text-sm pl-2">ctrl+k</kbd>
    </button>

    {/* Dialog backdrop */}
    <Show
      when={dialogOpen()}>

      {/* Dialog backdrop */}
      <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20"
        onKeyDown={(e) => {
          // close dialog on escape key
          if (e.key === 'Escape') {
            updateDialogOpen(false)
          }
        }}
      >
        <div class="fixed inset-0 bg-black/40" onClick={() => updateDialogOpen(false)} />

        {/* Dialog */}
        <dialog open={dialogOpen()} class="mx-auto overflow-hidden rounded-xl bg-white dark:bg-gray-800 max-w-xs sm:max-w-sm md:max-w-full ">
          <SearchDialog searchDb={searchDb} />
        </dialog>
      </div>
    </Show>
  </>
}

const SearchDialog = (props: { searchDb: Promise<SearchDbEntry[]> }) => {
  const [searchText, setSearchText] = createSignal('')
  const [searchResults, setSearchResults] = createSignal<SearchResult[]>([])
  const [searchSuggestions, setSearchSuggestions] = createSignal<Suggestion[]>([])
  const [selectedIndex, setSelectedIndex] = createSignal(-1)


  // create minisearch instance
  const miniSearch = new MiniSearch({
    fields: ['title', 'subtitle', 'description', 'tags', 'pubDate', 'updateDate', 'headings', 'slug'], // fields to index for full-text search
    storeFields: ['title', 'slug'],
    idField: 'slug',
    searchOptions: {
      boost: { title: 2, subtitle: 1.5, headings: 1.5, tags: 5, description: 1.5, slug: 4 },
      fuzzy: 0.5,
    }
  })

  onMount(async () => {
    // focus search input
    const searchInput = document.getElementById('combobox') as HTMLInputElement
    searchInput.focus()

    // wait for search db (json document) to be fully loaded
    const searchDb = await props.searchDb

    // add search db to minisearch
    miniSearch.addAll(searchDb as any)
  });


  // when input textbox calls this
  const onTextChange = (changedString: string) => {
    // update input value
    setSearchText(changedString)

    // if empty, clear results and suggestions, which is faster than debouncing and searching for empty string
    if (changedString.length === 0) {
      setSearchResults([])
      setSearchSuggestions([])
      return
    }

    // send new string to search handler
    searchHandler(changedString)
  }


  // debounced search handler 
  const searchHandler = debounce(async (searchString: string) => {
    const results = miniSearch.search(searchString)
    const suggestions = miniSearch.autoSuggest(searchString)
    setSearchSuggestions(suggestions)
    setSearchResults(results)
  }, 150)

  // called from arrow keys to focus suggestions
  // also called on focus of the input box with -1
  const updateSelectedIndex = (index: number) => {

    // focus suggestions if <= 0 
    const elementToFocus = document.getElementById(`option-${index}`) as HTMLElement
    if (elementToFocus) {
      elementToFocus.focus()
      setSelectedIndex(index)
    }


    // we go back to search box
    if (index === -1) {
      const searchInput = document.getElementById('combobox') as HTMLInputElement
      searchInput.focus()
      searchInput.selectionStart = searchText().length
      searchInput.selectionEnd = searchText().length
      setSelectedIndex(-1)
    }
  }


  return <>
    {/* Dialog content */}
    <div class=" rounded-md ring-1 ring-black">
      <div class="relative ring-1 ring-black dark:ring-gray-500  rounded-md"
        onKeyDown={(e) => {
          switch (e.key) {
            case 'ArrowDown':
              updateSelectedIndex(selectedIndex() + 1)
              break;
            case 'ArrowUp':
              updateSelectedIndex(selectedIndex() - 1)
              break;
          }
        }}
      >
        <div class="pointer-events-none absolute top-3 left-4 h-5 w-5 text-gray-400">
          {SearchIcon}
        </div>
        {/* Search input */}
        <input type="text"
          value={searchText()}
          id="combobox" // disables autocomplete thx to tailwind-form plugin
          onInput={(e) => onTextChange(e.currentTarget.value)}
          class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-0"
          placeholder='Search'
          onFocus={() => updateSelectedIndex(-1)}
        />


        {/* Suggestions and search results - only render if we have at least one match for either */}
        <Show when={searchSuggestions().length || searchResults().length}>
          {/* Only round at the bottom. The top is the übergang from search input to suggestions/results */}
          <ul
            id='options'
            class="z-10 mt-1 max-h-70 w-full overflow-auto rounded-b-md ring-1 ring-black dark:ring-gray-500  py-1 text-base focus:outline-none sm:text-sm" role="listbox">

            {/* Suggestions text */}
            <Show when={searchSuggestions().length > 0}>
              <li class="relative cursor-default select-none py-0.5 pl-1.5 text-slate-500 text-sm" tabIndex={-1}
              >
                Suggestions:
              </li>
            </Show>

            {/* Combobox option which represent our search suggestions */}
            {searchSuggestions().map((suggestion, index) =>
              <li class="relative cursor-default select-none py-1 pl-3 pr-9 text-gray-900 font-extralight dark:hover:bg-slate-700 focus:bg-gray-200 dark:text-gray-300 dark:focus:bg-slate-700  hover:bg-gray-100 focus:outline-none"
                id={`option-${index}`}
                role="option"
                tabindex={0}
                onClick={() => {
                  // we click on a suggestion
                  // => update text in search box + set focus on search box
                  onTextChange(suggestion.suggestion)
                  updateSelectedIndex(-1)
                }
                }
                onFocus={() => updateSelectedIndex(index)}
                onKeyDown={(e) => {
                  // if we press enter on a suggestion, we update the search box
                  if (e.key === 'Enter') {
                    onTextChange(suggestion.suggestion)
                    updateSelectedIndex(-1)
                  }
                }}
              >

                <span class="block truncate">{suggestion.suggestion}</span>

              </li>)}


            {/* Search results  text */}
            <Show when={searchResults().length > 0}>
              <li class="relative cursor-default select-none py-0.5 pl-1.5 text-slate-500 text-sm dark:outline-none" tabIndex={-1}>
                Results:
              </li>
            </Show>

            {/* Search results with clickable links, where it will sent us the result.slug */}
            {searchResults().map((result, index) =>

              <li class="relative cursor-pointer select-none py-2 pl-3 text-gray-900 dark:focus:bg-slate-700 dark:hover:bg-slate-700 focus:bg-gray-200 dark:text-gray-300 hover:bg-gray-100 focus:outline-none"
                id={`option-${index + searchSuggestions().length}`}
                role="option"
                onFocus={() => updateSelectedIndex(index + searchSuggestions().length)}
                tabindex={0}
                onClick={() => {
                  // push route to history
                  location.assign(`/articles/${result.id}`)
                }}
                onKeyDown={(e) => {
                  // push route to history
                  if (e.key === 'Enter') {
                    location.assign(`/articles/${result.id}`)
                  }
                }}
              >
                <span class="block truncate ">
                  <span class="font-bold">{result.title}</span>
                  <span class="text-slate-500 text-sm pl-1.5  ">{`/article/${result.id}`}</span>
                </span>
              </li>
            )}

          </ul>
        </Show>
      </div>
    </div>
  </>
}




export default SearchButton