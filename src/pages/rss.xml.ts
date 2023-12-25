import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
export const prerender = true;

import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET({site}: {site: string}) {
  const allPosts = await getCollection('posts');

  // filter out drafts
  const filteredPosts = allPosts.filter((post) => !post.data.draft)

  return rss({
    title: 'Super256',
    description: 'A blog about stuff I find interesting.',
    site,
    items: filteredPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,

      // render markdown to HTML and sanitize 
      content: sanitizeHtml(parser.render(post.body)),
      
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/article/${post.slug}/`,
    })),
  });
}