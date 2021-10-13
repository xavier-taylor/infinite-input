set search_path = mandarin;
select current_timestamp, current_timestamp + interval '1' day, age(current_timestamp , (current_timestamp+ interval '27' hour)),
-- epoch gets the number of seconds in the  interval https://www.postgresql.org/docs/9.2/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
-- * note interval is overloaded here - one meaning is in context of SRS, other meaning is just a postgres data type. above sentence is latter, postgres

extract(epoch from age(current_timestamp , (current_timestamp + interval '27' hour))) / 60 / 60 /24 ;


-- lets say interval is 10 days. 

-- case 1: it is due now, previous interval i = 10, we expect a 1.5 multiplier

WITH v (delta, i, due, study_time) as (
	-- note age(a,b) is            due - studytime
   values (extract(epoch from age( current_timestamp, current_timestamp)) /60/60/24, 10,current_timestamp, current_timestamp )
)
select due, study_time, delta,
(0.5*(i- delta)/i *i) + i as new_interval
from v;

-- case 2: it is due a week from now, so less than a 1.5 multiplier

WITH v (delta, i, due, study_time) as (
								-- due - study time	
   values (extract(epoch from age(  current_timestamp + interval '7' day, current_timestamp)) /60/60/24, 10, current_timestamp,current_timestamp + interval '7' day )
)
select due, study_time, delta,
(0.5*(i- delta)/i *i) + i as new_interval
from v;

-- case 3: it was due a week ago - so more than 1.5 multiplier

WITH v (delta, i, due, study_time) as (
								-- due    - study_time	
   values (extract(epoch from age( current_timestamp - interval '7' day, current_timestamp)) /60/60/24, 10, current_timestamp, current_timestamp - interval '7' day )
)
select due, study_time, delta,
(0.5*(i- delta)/i *i) + i as new_interval
from v;

-- Crucial - this is how you calculate an interval as a fractional mulitple of a day
select current_timestamp + interval '1' day * 10,
 current_timestamp + interval '1' day * 10.5
 
 
 -- NOTE - the above is some useful logic, but we still need to work through all the steps, in particular things like handling doubles rather than ints.
 
 /*
 1. we get 'study_time' as a full date/time string (using someting like luxon DateTime.now()
 2. we always have 'due' as a full timestamp sitting in our db.
 3. We always have interval sitting in the db as a double
 
 // TODO how can I add a new interval (a double), which represents the number of days, to a timestamp?
 	-- answer:  current_timestamp + interval '1' day * 10.5
 // TODO handle overflow on interval - can I set it to 'if overflow, set to max double'
 -- we can easily prevent overflow by using least(36500, newinterval) - this will cap our intervals at 100 years, and prevent any interval from getting remotely close to overflowing (which would prbably take millions or billions of years anyway lol)
 -- need to remember to always apply this to operations that are altering the interval columns. Shouldnt be an issue however.
 // TODO add interval to the two tables in postgres, and also in mandarin.sql (with not null etc)
			done
*/