import { DateTime } from 'luxon';

export const getStartOfTomorrow: (dayStartUTC: string) => string = (
  dayStartUTC
) => DateTime.fromISO(dayStartUTC).plus({ days: 1 }).toUTC().toISO();
