# Astro Blog


## 🚀 Project Structure

The blog is structured like the following

```
/
├── public/
│   └── favicon.svg
|   └── hello/ // Static assets for articles (e.g. images)
|       └── world.png
|       └── put-images-here.png
├── src/
│   ├── components/
│   │   └── ArticleRow.astro // A row of articles for the /articles/index overview
│   │   └── Card.astro // Article card for the homepage (the colourful things!)
|   |   └── Footer.astro // Footer component
|   |   └── Navbar.astro // Navbar component
|   |   └── Search.tsx // The client-side search implemented in Solid.js
|   |   |              // It grabs the index from /pages/search.json.ts
|   |   └── ThemeButton.tsx // The button to toggle between system default, light and dark mode
|   └── content/ 
|   |   └── config.ts // Zod-Schema for the posts' frontmatter.
|   |   └── posts/ // All posts are stored here
|   |       └── Hello-World.md // Example post
│   ├── layouts/
│   │   └── BaseLayout.astro // Default layout for the blog
│   └── pages/
│       └── index.astro // Homepage
│       └── about.astro // About page
│       └── articles/
│           └── [...slug].astro // Page that shows a single article
|           └── index.astro // Page that shows an index of all articles
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## Interesting things

### Search

Hit CTRL + K to open the search bar. It uses Minisearch as a search engine and is implemented in [Solid.js](https://www.solidjs.com/).
