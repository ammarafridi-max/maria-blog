import AdminDashboardLayout from '@/views/admin/AdminDashboardLayout';

export const metadata = {
  title: {
    default: 'Admin — Maria',
    template: '%s | Maria Admin',
  },
  robots: { index: false, follow: false },
};

const nav = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard', exact: true, roles: ['admin', 'blog-manager'] },
    ],
  },
  {
    section: 'Content',
    items: [
      { label: 'Blog', href: '/admin/blog', icon: 'BookOpen', roles: ['admin', 'blog-manager'] },
      { label: 'Blog Tags', href: '/admin/blog-tags', icon: 'Tag', roles: ['admin', 'blog-manager'] },
    ],
  },
  {
    section: 'People',
    items: [
      { label: 'Admin Users', href: '/admin/users', icon: 'Users', roles: ['admin'] },
    ],
  },
  {
    section: 'Settings',
    items: [
      { label: 'My Account', href: '/admin/account', icon: 'UserCircle', roles: ['admin', 'blog-manager'] },
    ],
  },
];

const brand = { name: 'Maria', icon: 'Activity' };

export default function Layout({ children }) {
  return (
    <AdminDashboardLayout nav={nav} brand={brand}>
      {children}
    </AdminDashboardLayout>
  );
}
