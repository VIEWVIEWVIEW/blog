import { Component, createSignal } from 'solid-js'

const [theme, setTheme] = createSignal(localStorage.getItem('theme') ?? 'system')

function changeGiscusTheme() {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'

  function sendMessage(message: { setConfig: { theme: string } }) {
    const iframe: HTMLIFrameElement | null = document.querySelector('iframe.giscus-frame');
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
  }

  sendMessage({
    setConfig: {
      theme: theme
    }
  });
}

const ThemeButton: Component<{}> = (props) => {

  /**
   * Cycle through the available themes
   * - system: OS theme preference
   * - light: force light theme
   * - dark: force dark theme
   * 
   * A theme stored in localStorage will override the system preference
   */
  const toggleTheme = () => {
    if (theme() === 'system') {
      setTheme('light')
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    } else if (theme() === 'light') {
      setTheme('dark')
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('system')
      localStorage.removeItem('theme')
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    changeGiscusTheme()
  }

  // Render the correct icon based on the current theme
  const ThemeIcon = () => {
    switch (theme()) {
      case "light":
        return sun;
      case "dark":
        return moon;
      default:
        return system;
    }
  };

  return <button onClick={toggleTheme} class="w-9 h-9 rounded-lg  flex items-center justify-center hover:dark:bg-yellow-200   dark:bg-yellow-300 bg-slate-800 hover:bg-slate-700 text-white dark:text-slate-900 ">
    {ThemeIcon()}
  </button>
};


export default ThemeButton


// Icons from https://heroicons.com/
const sun = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
</svg>

const moon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
</svg>

const system = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
</svg>
