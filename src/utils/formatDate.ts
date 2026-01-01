type Locales = 'uk-UA' | 'en-US';

export const getHumanReadableDay = (
  date: Date,
  locale: Locales = 'uk-UA',
): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return locale === 'uk-UA' ? 'Сьогодні' : 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return locale === 'uk-UA' ? 'Вчора' : 'Yesterday';
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getLocalTime = (date: Date, locale: Locales = 'uk-UA'): string =>
  new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const getNumericLocalDateTime = (
  date: Date,
  locale: Locales = 'uk-UA',
): string =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const getHumanReadableDateTime = (
  date: Date,
  locale: Locales = 'uk-UA',
): string =>
  new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
  }).format(date) +
  ' ' +
  date.getFullYear() +
  ', ' +
  getLocalTime(date, locale);
