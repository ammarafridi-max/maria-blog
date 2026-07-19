import {
  createSchemaBuilders,
  buildFAQPage,
  buildBreadcrumbList as _buildBreadcrumbList,
  buildGraph,
} from '@/utils/schema';
import { buildMetadata as _buildMetadata } from '@/utils/publicMetadata';

// Set NEXT_PUBLIC_SITE_URL in production; this fallback is only for local dev.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const SITE_NAME = 'Maria Physiotherapy';

export const {
  buildOrganization,
  buildWebsite,
  buildWebPage,
  buildBlog,
  buildBlogPosting,
} = createSchemaBuilders({
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  logoUrl: `${SITE_URL}/logo.png`,
  email: 'hello@mariaphysio.com',
});

export { buildFAQPage, buildGraph };

export const buildBreadcrumbList = (opts = {}) =>
  _buildBreadcrumbList({ baseUrl: SITE_URL, ...opts });

export const buildMetadata = (opts) => _buildMetadata({ siteUrl: SITE_URL, ...opts });
