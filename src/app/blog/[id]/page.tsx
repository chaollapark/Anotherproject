import { getPostData } from '@/lib/blogUtils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = { id: string };

/** Generate metadata for SEO */
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  try {
    const postData = await getPostData(params.id);
    return {
      title: postData.title,
      description: `Read ${postData.title} - EU Jobs insights and career advice`,
      alternates: {
        canonical: `/blog/${params.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
    };
  }
}

/** 
 * Use Incremental Static Regeneration (ISR) for blog posts
 * Pages will be generated on-demand when first visited, then cached
 * This prevents build timeouts while maintaining good performance
 */
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }: { params: { id: string } }) {
  try {
    const postData = await getPostData(params.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
        <div className="text-gray-500 mb-6">{postData.date}</div>
        <div className="!prose max-w-none" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
