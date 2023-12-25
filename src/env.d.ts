/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />


interface ImportMetaEnv {
  readonly PUBLIC_GISCUS_REPO: string;
  readonly PUBLIC_GISCUS_REPO_ID: string;
  readonly PUBLIC_GISCUS_CATEGORY: string;
  readonly PUBLIC_GISCUS_CATEGORY_ID: string;
  readonly PUBLIC_GITHUB_DISCUSSIONS_LINK: string; // e.g. https://github.com/VIEWVIEWVIEW/blog/discussions/categories/blog-comments
  readonly PUBLIC_CONTACT_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}