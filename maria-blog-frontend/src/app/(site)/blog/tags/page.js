import { getBlogTagsApi } from '@/services/apiBlogTags';
import {
  SITE_URL,
  buildBreadcrumbList,
  buildGraph,
  buildOrganization,
  buildWebPage,
  buildWebsite,
} from '@/lib/schema';
import BlogTagsPage from '@/views/client/v2/BlogTagsPage';

const meta = {
  title: 'Topics | Maria Physiotherapy Blog',
  description:
    'Browse physiotherapy topics to find posts on back pain, injuries, posture, rehab exercises, and staying active.',
  canonical: `${SITE_URL}/blog/tags`,
};

const hero = {
  title: 'Topics',
  subtitle: 'Find posts by subject',
};

const breadcrumbPaths = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'Topics', path: '/blog/tags' },
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

export const revalidate = 300;

export default async function Page() {
  const tags = await getBlogTagsApi().catch(() => []);

  const schema = buildGraph([
    buildOrganization(),
    buildWebsite(),
    buildWebPage({ canonical: meta.canonical, title: meta.title, description: meta.description }),
  ]);
  const breadcrumbJsonLd = buildBreadcrumbList({ paths: breadcrumbPaths });

  return (
    <BlogTagsPage
      tags={tags || []}
      hero={hero}
      breadcrumbPaths={breadcrumbPaths}
      schema={schema}
      breadcrumbJsonLd={breadcrumbJsonLd}
    />
  );
}
