import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Media } from './collections/Media';
import { PreviousSponsors } from './collections/PreviousSponsors';
import { Shows } from './collections/Shows';
import { Sponsors } from './collections/Sponsors';
import { Users } from './collections/Users';
import { AboutMedRevue } from './globals/AboutMedRevue';
import { Contact } from './globals/Contact';
import { Homepage } from './globals/Homepage';
import { OurCharity } from './globals/OurCharity';
import { SiteSettings } from './globals/SiteSettings';
import { SponsorUs } from './globals/SponsorUs';
import { ThemeSettings } from './globals/ThemeSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  collections: [Users, Media, PreviousSponsors, Shows, Sponsors],
  globals: [
    Homepage,
    AboutMedRevue,
    OurCharity,
    SponsorUs,
    Contact,
    SiteSettings,
    ThemeSettings,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
});
