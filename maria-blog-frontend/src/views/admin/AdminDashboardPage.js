'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  FileText, CheckCircle2, PenLine, Clock, Tag, Plus, ArrowRight, Loader2,
} from 'lucide-react';
import { useGetBlogs } from '../../hooks/blog/useGetBlogs';
import { useGetBlogTags } from '../../hooks/blog-tags/useGetBlogTags';

const STATUS_STYLES = {
  published: 'bg-green-50 text-green-700 border-green-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
};

function StatCard({ icon: Icon, label, value, loading, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-gray-900 leading-none">
          {loading ? <Loader2 size={20} className="animate-spin text-gray-300" /> : value}
        </p>
        <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const published = useGetBlogs({ status: 'published', limit: 1 });
  const drafts = useGetBlogs({ status: 'draft', limit: 1 });
  const scheduled = useGetBlogs({ status: 'scheduled', limit: 1 });
  const recent = useGetBlogs({ limit: 6 });
  const { tags, isLoadingBlogTags } = useGetBlogTags('');

  const publishedCount = published.pagination?.total ?? 0;
  const draftCount = drafts.pagination?.total ?? 0;
  const scheduledCount = scheduled.pagination?.total ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            An overview of your physiotherapy blog.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shrink-0"
        >
          <Plus size={16} /> New post
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} label="Published" value={publishedCount} loading={published.isLoadingBlogs} accent="bg-green-50 text-green-600" />
        <StatCard icon={PenLine} label="Drafts" value={draftCount} loading={drafts.isLoadingBlogs} accent="bg-gray-100 text-gray-500" />
        <StatCard icon={Clock} label="Scheduled" value={scheduledCount} loading={scheduled.isLoadingBlogs} accent="bg-amber-50 text-amber-600" />
        <StatCard icon={Tag} label="Tags" value={tags.length} loading={isLoadingBlogTags} accent="bg-primary-50 text-primary-700" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <FileText size={16} className="text-gray-400" /> Recent posts
          </h2>
          <Link href="/admin/blog" className="text-xs font-semibold text-primary-700 hover:text-primary-800 inline-flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {recent.isLoadingBlogs ? (
          <div className="py-14 flex justify-center text-gray-300">
            <Loader2 size={22} className="animate-spin" />
          </div>
        ) : recent.blogs.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm text-gray-500">No posts yet.</p>
            <Link href="/admin/blog/new" className="text-sm font-semibold text-primary-700 hover:text-primary-800 mt-1 inline-block">
              Write your first post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recent.blogs.map((blog) => (
              <li key={blog._id}>
                <Link
                  href={`/admin/blog/${blog._id}/edit`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition"
                >
                  <div className="relative w-14 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {blog.coverImageUrl && (
                      <Image src={blog.coverImageUrl} alt="" fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{blog.title}</p>
                    <p className="text-xs text-gray-400 truncate">/{blog.slug}</p>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[blog.status] ?? STATUS_STYLES.draft}`}>
                    {blog.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
