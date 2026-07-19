import { getPublishedBlogsApi } from '@/services/apiBlog';
import {
  SITE_URL,
  buildBlog,
  buildBreadcrumbList,
  buildGraph,
  buildOrganization,
  buildWebPage,
  buildWebsite,
} from '@/lib/schema';
import BlogPage from '@/views/client/v2/BlogPage';

const meta = {
  title: 'Physiotherapy Blog | Tips on Pain, Injuries & Recovery',
  description:
    'Practical physiotherapy guides on back pain, injuries, posture, and rehab exercises, written by a practising physiotherapist to help you move and feel better.',
  canonical: `${SITE_URL}/blog`,
};

const hero = {
  title: 'The Blog',
  subtitle: 'Physiotherapy, made simple',
};

const breadcrumbPaths = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
];

export const metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.canonical },
  robots: { index: true, follow: true },
  openGraph: {
    url: meta.canonical,
    title: meta.title,
    description: meta.description,
  },
};

export const revalidate = 3600;

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page || 1) || 1);

  let blogs = [];
  let pagination = null;
  try {
    const data = await getPublishedBlogsApi({ page: currentPage, limit: 9 });
    blogs = data?.blogs || [];
    pagination = data?.pagination || null;
  } catch {

  }

  const schema = buildGraph([
    buildOrganization(),
    buildWebsite(),
    buildWebPage({ canonical: meta.canonical, title: meta.title, description: meta.description }),
    buildBlog({ canonical: meta.canonical, title: meta.title, description: meta.description }),
  ]);
  const breadcrumbJsonLd = buildBreadcrumbList({ paths: breadcrumbPaths });

  return (
    <BlogPage
      blogs={blogs}
      pagination={pagination}
      currentPage={currentPage}
      hero={hero}
      breadcrumbPaths={breadcrumbPaths}
      schema={schema}
      breadcrumbJsonLd={breadcrumbJsonLd}
    />
  );
}
