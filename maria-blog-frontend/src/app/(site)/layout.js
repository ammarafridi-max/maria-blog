import PublicHeader from '@/components/shared/layout/PublicHeader';
import PublicFooter from '@/components/shared/layout/PublicFooter';

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
