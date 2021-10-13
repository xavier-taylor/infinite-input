import { DateTime } from 'luxon';
/**
 * 
 * some notes in case I use them for how to do this kind of trickery in postgres
-- epoch gets the number of seconds in the interval https://www.postgresql.org/docs/9.2/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
-- see the .sql file

;
 */
function srs(
  interval: number,
  due: DateTime, // when it was due - should be in UTC timezone
  studyDate: DateTime // the datetime the study took place - should be in UTC timezone
): { newInterval: number; newDueDate: DateTime } {
  const delta = due.diff(studyDate, 'days').toObject().days as number;

  /* 
  const now = DateTime.now();
  const tomorrow = DateTime.now().plus({ days: 1 });

  console.log(tomorrow.diff(now, 'days'));
Duration {
        values: { days: 1 },
  */

  const newInterval =
    0.5 * Math.max(0, (interval - delta) / interval) * interval + interval; // This formula returns 1.5*interval when studied on due day, less than that (capped at interval, I hope) when studied before due date, and greater than that when studied after due date
  /*
Notes:
this formula for newInterval and hence newDueDate seems to be reasonable.
furthermore, I have worked out how to do something equivalent in postgres (see .sql)

However, I have not yet taken the time to think seriously about edge cases etc.
It is really important that I do so at some point.

Note that since we start our interval at 1, and the newInterval formula uses Math.max(0),
the smallest interval we can ever get is 1. And going forward, the smallest new interval is always
the current interval value (unless we reset it to 1 in case of someone getting a word wrong).

A few things to look into: 
1) what happens when you learn a word late at night today, then revise it early tomorrow morning?

*/

  return {
    newInterval,
    newDueDate: studyDate.plus({ days: newInterval }),
  };
}

// These tests are me working out some logic,
describe('the logic for the SRS algorithm', () => {
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

    expect(newInterval).toBeCloseTo(30);
    expect(studyDate.plus({ days: newInterval }).valueOf()).toEqual(
      newDueDate.valueOf()
    );
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

  // EDGE CASES and details
  it('returns interval less than 2 when you first study a new card near midnight the day it was due', () => {
    const now = DateTime.now();
    const due = now.startOf('day'); // new cards are due at the start of the day, see getNewProperties
    const interval = 1;
    const studyTime = due.set({ hour: 23, minute: 59, second: 59 }); // you are studing this read card at 11:59pm. you learned it yesterday
    const { newInterval, newDueDate } = srs(interval, due, studyTime);
    expect(newInterval).toBeGreaterThan(1.5);
    expect(newInterval).toBeLessThan(2);
  });
  it('returns interval greater than 1.5 when you first study a new card near in the early am the day it was due', () => {
    const now = DateTime.now();
    const due = now.startOf('day'); // new cards are due at the start of the day, see getNewProperties
    const interval = 1;
    const studyTime = due.set({ hour: 0, minute: 0, second: 2 }); // you are studing this read card at 00:00am. you learned it yesterday
    const { newInterval, newDueDate } = srs(interval, due, studyTime);
    expect(newInterval).toBeGreaterThan(1.5);
    expect(newInterval).toBeLessThan(2);
    // console.log('$', newInterval);
  });
  // it('returns something when you studied late last night but then early this morning', () => {
  //   const now = DateTime.now();
  //   const lastNight = now.minus({ days: 1 }).set({ hour: 23 });
  //   const thisMorning = now.set({ hour: 8 });
  //   const { newInterval, newDueDate } = srs(1, DateTime.now(), studyDate);
  //   expect(newInterval).toBeCloseTo(75);
  //   expect(newDueDate.day).toEqual(studyDate.plus({ days: 75 }).day);
  // });
});
