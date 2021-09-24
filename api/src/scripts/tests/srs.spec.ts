import { DateTime } from 'luxon';

function srs(
  interval: number,
  due: DateTime,
  studyDate: DateTime
): { newInterval: Number; newDueDate: DateTime } {
  const newInterval = interval * 1.5;
  return {
    newInterval,
    newDueDate: studyDate.plus({ days: newInterval }),
  };
}

// These tests are me working out some logic, they are not an implementation and they do not test an implementation
describe.only('the logic for the SRS algorithm', () => {
  it('returns 1.5 times the previous interval when revisionDate === due date', () => {
    const studyDate = DateTime.now();
    const { newInterval, newDueDate } = srs(50, DateTime.now(), studyDate);
    expect(newInterval).toBeCloseTo(75);
    expect(newDueDate).toEqual(studyDate.plus({ days: 75 }));
  });

  it('returns the previous');
});

/*
Scenarios:

studyDate before due
    - If studyDate is before due, necassarily some fraction of the interval has passed. This fraction of the interval (a real number in days),
    is above zero (or at least non negative). It could only be negative if you went back in time.
    In this scenario - the new interval is = (fraction_of_interval/interval (a percent) * interval) + interval.
    We both store that new interval value and reset due.  CONTINUE HERE thinking about the SRS algo, with a clear mind.
    

studyDate === Due

studyDate after due


*/
