import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['en', 'id', 'zh-CN', 'vi'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
    'en': 'English',
    'id': 'Indonesia',
    'zh-CN': '简体中文',
    'vi': 'Tiếng Việt'
};

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const headersList = await headers();

    let locale: Locale = (cookieStore.get('locale')?.value as Locale) || 'en';

    if (!locales.includes(locale)) {
        const acceptLanguage = headersList.get('accept-language');
        if (acceptLanguage) {
            const detected = acceptLanguage.split(',')[0].split('-')[0];
            if (detected === 'zh') {
                locale = 'zh-CN';
            } else if (locales.includes(detected as Locale)) {
                locale = detected as Locale;
            } else {
                locale = 'en';
            }
        } else {
            locale = 'en';
        }
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});