import { CmsClient } from './CmsClient';

const configuredBaseUrl = import.meta.env.VITE_CMS_BASE_URL?.trim();

export const cmsBaseUrl = configuredBaseUrl || 'http://localhost:3001';
export const cmsClient = new CmsClient(cmsBaseUrl);
