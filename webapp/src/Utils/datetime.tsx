import { DateTime } from 'luxon';

// Some backend queries need to know 'what is the UTC timestamp,
// expressed in ISO format, of the moment in time that is the start of
// the day in the users local timezone?'
export const getDayStartUTC: () => string = () =>
  DateTime.now().startOf('day').toUTC().toISO();
