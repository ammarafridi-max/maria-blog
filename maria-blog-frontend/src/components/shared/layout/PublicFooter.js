import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50">
      <div className="mx-auto w-[90%] py-12 md:w-[85%] lg:w-[80%]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-white">
                <Activity size={18} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-gray-900">
                Maria <span className="text-primary-700">Physio</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Practical physiotherapy advice you can trust, written by a practising
              physiotherapist. Simple guidance on pain, movement, and recovery.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Explore</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="text-gray-600 hover:text-primary-700">Blog</Link></li>
                <li><Link href="/blog/tags" className="text-gray-600 hover:text-primary-700">Topics</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">More</p>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:hello@mariaphysio.com" className="text-gray-600 hover:text-primary-700">Contact</a></li>
                <li><Link href="/admin" className="text-gray-600 hover:text-primary-700">Admin</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400">
            © {year} Maria Physiotherapy. This blog is for general information and is
            not a substitute for personalised medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
