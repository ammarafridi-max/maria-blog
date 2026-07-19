import AdminLoginPage from '@/views/admin/AdminLoginPage';

export const metadata = {
  title: 'Sign In — Admin',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminLoginPage siteName="Maria" />;
}
