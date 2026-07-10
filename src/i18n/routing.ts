import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'de', 'pt', 'ar', 'hi'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
