import { parse, format, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

export const convertDateFormat =
  (inputFormat: string, outputFormat: string, locale = ko) =>
  (dateString: string): string => {
    const parsed = parse(dateString, inputFormat, new Date(), { locale });
    return isValid(parsed) ? format(parsed, outputFormat) : '';
  };

export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd', // API 날짜 형식
  SHORT_SLASH: 'yy/MM/dd', // dateInput 형식
  FULL_DOT: 'yyyy.MM.dd', // 카드 날짜 형식
} as const;

export const toISO = convertDateFormat(DATE_FORMATS.SHORT_SLASH, DATE_FORMATS.ISO); // YY/MM/DD → YYYY-MM-DD
export const fromISO = convertDateFormat(DATE_FORMATS.ISO, DATE_FORMATS.SHORT_SLASH); // YYYY-MM-DD → YY/MM/DD
export const toFullDot = convertDateFormat(DATE_FORMATS.ISO, DATE_FORMATS.FULL_DOT); // YYYY-MM-DD → YYYY.MM.DD

export function formatDate(date: Date | undefined) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  return format(date, DATE_FORMATS.SHORT_SLASH); // yy/MM/dd
}

export function parseDate(value: string): Date | undefined {
  const parsed = parse(value, DATE_FORMATS.SHORT_SLASH, new Date(), { locale: ko });
  return isValid(parsed) ? parsed : undefined;
}
