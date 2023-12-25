import { getCollection, getEntryBySlug } from "astro:content";
import type { APIRoute } from "astro";

/**
 * This function will get all posts at build time.
 * We will use the posts to generate a search index, which can be used by Minisearch.
 */
export const GET: APIRoute = async function GET({}) {
  const allPosts = await getCollection("posts");

  // unfortunately getCollection does NOT return the sub headlines. I want them to be searchable too, so we need to iterate through all posts and get render every post.
  // https://docs.astro.build/en/reference/api-reference/#render
  // To make it a bit faster, I'll run them in parallel and await the array of promises
  const searchablePostsPromises = allPosts.map(async (post) => {
    // get entry by slug
    const entry = await getEntryBySlug("posts", post.slug);
    // extract headings
    const { headings } = await entry.render();

    // ignore drafts
    if (post.data.draft) return;

    return {
      slug: post.slug,
      title: post.data.title,
      subtitle: post.data.subtitle,
      description: post.data.description,
      tags: post.data.tags,
      pubDate: post.data.publishDate,
      updateDate: post.data.updateDate,
      headings: headings, // our array with sub headlines
    };
  });

  // wait till all promises are successfully fullfilled
  const searchablePosts = await Promise.all(searchablePostsPromises);

  // We still need to filter out null values
  const filteredSearchablePosts = searchablePosts.filter(
    (post) => post !== null
  );

  // Setting headers is not supported when returning an object. We have to return an instance of Response.

  return new Response(JSON.stringify([...filteredSearchablePosts]), {
    headers: {
      "Content-Type": "application/json",
      // https://web.dev/stale-while-revalidate/
      // the response stays fresh for 1d, but is also cached for 30d
      // if the user visits the page after 1d, but before 30d, the cached response will be used and the new response will be fetched in the background
      // if the user visits the page after 30d, a fresh version must be fetched first. Cache is not used.
      // note that this obviously doesn't work for SSG; only for SSR
      "Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000",
    },
  });
};
