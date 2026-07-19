import Link from 'next/link';
import { ArrowRight, Activity, HeartPulse, Dumbbell, ShieldCheck } from 'lucide-react';
import { getPublishedBlogsApi } from '@/services/apiBlog';
import { getBlogTagsApi } from '@/services/apiBlogTags';
import Container from '@/components/shared/layout/Container';
import PrimarySection from '@/components/shared/layout/PrimarySection';
import BlogCard from '@/components/cards/v2/BlogCard';
import {
  SITE_URL,
  buildGraph,
  buildOrganization,
  buildWebsite,
  buildWebPage,
} from '@/lib/schema';

const meta = {
  title: 'Maria Physiotherapy | Practical Advice on Pain, Movement & Recovery',
  description:
    'Physiotherapy tips you can actually use, written by a practising physiotherapist. Clear guidance on back pain, injuries, posture, and getting moving again.',
  canonical: SITE_URL,
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.canonical },
  robots: { index: true, follow: true },
  openGraph: {
    url: meta.canonical,
    title: meta.title,
    description: meta.description,
    type: 'website',
  },
};

export const revalidate = 3600;

const HIGHLIGHTS = [
  { Icon: HeartPulse, title: 'Pain, explained simply', text: 'What is actually going on, and what helps, without the jargon.' },
  { Icon: Dumbbell, title: 'Exercises that work', text: 'Practical movements and progressions you can do at home.' },
  { Icon: ShieldCheck, title: 'Advice you can trust', text: 'Written by a practising physiotherapist, not by AI.' },
];

export default async function HomePage() {
  const [blogData, tags] = await Promise.all([
    getPublishedBlogsApi({ page: 1, limit: 3 }).catch(() => ({ blogs: [] })),
    getBlogTagsApi().catch(() => []),
  ]);
  const posts = blogData?.blogs || [];
  const topTags = (Array.isArray(tags) ? tags : []).slice(0, 8);

  const schema = buildGraph([
    buildOrganization(),
    buildWebsite(),
    buildWebPage({ canonical: meta.canonical, title: meta.title, description: meta.description }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <PrimarySection className="bg-linear-to-br from-primary-800 via-primary-700 to-primary-600 text-white">
        <Container className="py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/20">
              <Activity size={13} /> Physiotherapy blog
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Move better, hurt less, recover with confidence.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-100">
              Straightforward physiotherapy advice on back pain, injuries, posture,
              and staying active. Written by Maria, a practising physiotherapist who
              would rather explain things plainly than sound clever.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
              >
                Read the blog <ArrowRight size={16} />
              </Link>
              <Link
                href="/blog/tags"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/15"
              >
                Browse topics
              </Link>
            </div>
          </div>
        </Container>
      </PrimarySection>

      {/* Highlights */}
      <PrimarySection className="py-14">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HIGHLIGHTS.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-bold text-gray-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </PrimarySection>

      {/* Latest posts */}
      <PrimarySection className="pb-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Latest from the blog</h2>
              <p className="mt-1 text-sm text-gray-500">Fresh, practical physiotherapy reads.</p>
            </div>
            <Link href="/blog" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800">
              All posts <ArrowRight size={14} />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
              <p className="text-sm text-gray-500">No posts published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post._id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  date={post.publishedAt || post.createdAt}
                  readTime={post.readingTime}
                  coverImageUrl={post.coverImageUrl}
                  tags={post.tags}
                />
              ))}
            </div>
          )}
        </Container>
      </PrimarySection>

      {/* Topics */}
      {topTags.length > 0 && (
        <PrimarySection className="border-t border-gray-100 bg-gray-50 py-14">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Explore by topic</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {topTags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/blog/tags/${tag.slug || tag._id}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </Container>
        </PrimarySection>
      )}
    </>
  );
}
