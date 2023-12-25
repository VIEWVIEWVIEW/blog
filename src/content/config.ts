import { z, defineCollection } from 'astro:content';


const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()),
    imageHeader: z.object({
      url: z.string().optional(),
      alt: z.string().optional()
    }).optional(),
    draft: z.boolean(),
    publishDate: z.date(),
    updateDate: z.date().optional(),
  })
});


// Export a single `collections` object to register collection
// The key should match the collection directory name in "src/content"
export const collections = {
  'posts': postsCollection,
};