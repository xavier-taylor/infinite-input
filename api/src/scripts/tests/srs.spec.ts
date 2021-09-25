import { DateTime } from 'luxon';
/**
 * 
 * some notes in case I use them for how to do this kind of trickery in postgres
-- epoch gets the number of seconds in the interval https://www.postgresql.org/docs/9.2/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
WITH v (delta, i, due, study_time) as (
	-- note age(a,b) is          study_time - due
   values (extract(epoch from age( current_timestamp, current_timestamp)) /60/60/24, 10,current_timestamp, current_timestamp )
)
select due, study_time, delta,
(0.5*(i+ delta)/i *i) + i as new_interval
from v;

;
 */
function srs(
  interval: number,
  due: DateTime, // when it was due - should be in UTC timezone
  studyDate: DateTime // the datetime the study took place - should be in UTC timezone
): { newInterval: Number; newDueDate: DateTime } {
  const delta = studyDate.diff(due, 'days').toObject().days as number;
  console.log('delta:', delta);

  const newInterval =
    0.5 * ((interval + delta) / interval) * interval + interval; // This formula returns 1.5*interval when studied on due day, less than that (capped at interval, I hope) when studied before due date, and greater than that when studied after due date

  return {
    newInterval,
    newDueDate: studyDate.plus({ days: newInterval }),
  };
}

// These tests are me working out some logic,
describe.only('the logic for the SRS algorithm', () => {
  it('returns 1.5 times the previous interval when studyDate === due date', () => {
    const studyDate = DateTime.now();
    const { newInterval, newDueDate } = srs(50, DateTime.now(), studyDate);
    expect(newInterval).toBeCloseTo(75);
    expect(newDueDate.day).toEqual(studyDate.plus({ days: 75 }).day);
  });

  it('returns the previous interval when due-interval === studyDate, ie when you study a word shortly after studying it', () => {
    const studyDate = DateTime.now();
    const dueDate = studyDate.plus({ days: 30 }); // it was due 30 days from right now
    const interval = 30;

    const { newInterval, newDueDate } = srs(interval, dueDate, studyDate);
    expect(newInterval).toBeGreaterThanOrEqual(30);
    expect(newInterval).toBeLessThanOrEqual(30);
    const { day, month, year } = studyDate;
    expect(newDueDate.day).toEqual(day);
  });

  it('returns an interval bigger than *1.5 when card studied after due date', () => {
    const dueDate = DateTime.now();
    const studyDate = dueDate.plus({ days: 40 });
    const interval = 20;

    const { newInterval, newDueDate } = srs(interval, dueDate, studyDate);

    expect(newInterval).toBeCloseTo(50);
    // When not so overdue, the new interval isn't so giant
    const smallerInterval = srs(interval, dueDate, dueDate.plus({ days: 2 }))
      .newInterval;
    expect(smallerInterval).toBeCloseTo(31);

    // when overdue larger relative to the original interval, new interval bigger relative to interval
    const biggerRelativeInterval = srs(10, dueDate, studyDate).newInterval;
    expect(biggerRelativeInterval.valueOf() / 10).toBeGreaterThan(
      newInterval.valueOf() / interval
    );
  });
});
