'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext.js';
import { getAdminUsersApi } from '../../../services/apiAdminUsers.js';
import { getAllBlogsApi } from '../../../services/apiBlog.js';

const ROLE_LABELS = {
  admin: 'Admin',
  'blog-manager': 'Blog Manager',
};

const CATEGORIES = [
  { key: 'blogs', label: 'Blog Posts' },
  { key: 'users', label: 'Admin Users' },
];

const CATEGORY_COLORS = {
  blogs: 'bg-rose-50 text-rose-700',
  users: 'bg-amber-50 text-amber-700',
};

function normaliseResults(key, raw) {
  try {
    if (key === 'users') {
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.users) ? raw.users : [];
      return items.slice(0, 5).map((u) => ({
        id: u._id || u.username,
        primary: u.name || u.username,
        secondary: `${u.email}${u.role ? ` · ${ROLE_LABELS[u.role] ?? u.role}` : ''}`,
        href: `/admin/users`,
      }));
    }

    if (key === 'blogs') {
      const items = Array.isArray(raw?.blogs)
        ? raw.blogs
        : Array.isArray(raw?.data?.blogs)
        ? raw.data.blogs
        : Array.isArray(raw)
        ? raw
        : [];
      return items.slice(0, 5).map((b) => ({
        id: b._id,
        primary: b.title || b.slug || b._id,
        secondary: b.status ?? '',
        href: `/admin/blog/${b._id}/edit`,
      }));
    }
  } catch {

  }
  return [];
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query.trim(), 300);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults({});
      setSearched(false);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setOpen(true);

    Promise.allSettled([
      getAllBlogsApi({ search: debouncedQuery, limit: 5 }),
      getAdminUsersApi({ search: debouncedQuery, limit: 5 }),
    ]).then(([blogs, users]) => {
      if (cancelled) return;
      setResults({
        blogs: normaliseResults('blogs', blogs.status === 'fulfilled' ? blogs.value : null),
        users: normaliseResults('users', users.status === 'fulfilled' ? users.value : null),
      });
      setSearched(true);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const totalResults = Object.values(results).reduce((s, arr) => s + arr.length, 0);
  const hasResults = totalResults > 0;

  function handleSelect() {
    setOpen(false);
    setQuery('');
    setResults({});
    setSearched(false);
  }

  function handleClear() {
    setQuery('');
    setResults({});
    setSearched(false);
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative flex-1 sm:max-w-md">

      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (searched) setOpen(true); }}
          placeholder="Search posts and users…"
          className="w-full h-9 pl-8 pr-8 rounded-lg border border-gray-200 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 focus:bg-white transition"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 size={13} className="text-gray-400 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          ) : null}
        </div>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-[440px] overflow-y-auto">
          {loading && !searched ? (
            <div className="px-4 py-6 text-center text-[13px] text-gray-400">
              Searching…
            </div>
          ) : !hasResults && searched ? (
            <div className="px-4 py-6 text-center text-[13px] text-gray-400">
              No results for <span className="font-medium text-gray-600">"{debouncedQuery}"</span>
            </div>
          ) : (
            <div className="py-1.5">
              {CATEGORIES.map(({ key, label }) => {
                const items = results[key] ?? [];
                if (!items.length) return null;
                return (
                  <div key={key}>

                    <div className="px-3 pt-3 pb-1.5 flex items-center gap-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${CATEGORY_COLORS[key]}`}>
                        {label}
                      </span>
                    </div>

                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={handleSelect}
                        className="flex flex-col gap-0.5 px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-[13px] font-medium text-gray-800 leading-snug truncate">
                          {item.primary}
                        </span>
                        {item.secondary && (
                          <span className="text-[11px] text-gray-400 leading-snug truncate capitalize">
                            {item.secondary}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminHeader() {
  const { adminUser } = useAdminAuth();

  const initials = adminUser?.name
    ? adminUser.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-4 px-6 shrink-0 pl-16 lg:pl-6">
      <GlobalSearch />

      <div className="flex-1" />

      {adminUser && (
        <Link
          href="/admin/account"
          className="flex items-center gap-2.5 hover:opacity-80 transition shrink-0"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-none">
              {adminUser.name}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 capitalize">
              {ROLE_LABELS[adminUser.role] ?? adminUser.role}
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-white">{initials}</span>
          </div>
        </Link>
      )}
    </header>
  );
}
