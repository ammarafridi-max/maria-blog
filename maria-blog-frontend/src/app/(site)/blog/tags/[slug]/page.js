import { notFound } from 'next/navigation';
import { getPublishedBlogsApi } from '@/services/apiBlog';
import { getBlogTagsApi, getBlogTagBySlugApi } from '@/services/apiBlogTags';
import {
  SITE_URL,
  buildBreadcrumbList,
  buildGraph,
  buildOrganization,
  buildWebPage,
  buildWebsite,
} from '@/lib/schema';
import BlogTagDetailPage from '@/views/client/v2/BlogTagDetailPage';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const tags = await getBlogTagsApi();
    return (Array.isArray(tags) ? tags : [])
      .map((t) => t?.slug)
      .filter(Boolean)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tag = await getBlogTagBySlugApi(slug).catch(() => null);

  if (!tag) {
    return { title: 'Topic Not Found', robots: { index: false, follow: false } };
  }

  const title = tag.metaTitle || `${tag.name} | Maria Physiotherapy`;
  const description =
    tag.metaDescription || tag.description || `Physiotherapy posts tagged ${tag.name}.`;
  const canonical = `${SITE_URL}/blog/tags/${tag.slug || slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { url: canonical, title, description },
  };
}

export default async function Page({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page || 1) || 1);

  const tag = await getBlogTagBySlugApi(slug).catch(() => null);
  if (!tag) notFound();

  let blogs = [];
  let pagination = null;
  try {
    const data = await getPublishedBlogsApi({ page: currentPage, limit: 9, tag: tag.name });
    blogs = data?.blogs || [];
    pagination = data?.pagination || null;
  } catch {

  }

  const canonical = `${SITE_URL}/blog/tags/${tag.slug || slug}`;
  const title = tag.metaTitle || `${tag.name} | Maria Physiotherapy`;
  const description =
    tag.metaDescription || tag.description || `Physiotherapy posts tagged ${tag.name}.`;

  const breadcrumbPaths = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'Topics', path: '/blog/tags' },
    { label: tag.name, path: `/blog/tags/${tag.slug || slug}` },
  ];

  const graph = buildGraph([
    buildOrganization(),
    buildWebsite(),
    buildWebPage({ canonical, title, description }),
  ]);
  const breadcrumbJsonLd = buildBreadcrumbList({ paths: breadcrumbPaths });

  return (
    <BlogTagDetailPage
      tag={tag}
      blogs={blogs}
      pagination={pagination}
      currentPage={currentPage}
      breadcrumbPaths={breadcrumbPaths}
      graph={graph}
      breadcrumbJsonLd={breadcrumbJsonLd}
    />
  );
}
