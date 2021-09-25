set search_path = mandarin;
select current_timestamp, current_timestamp + interval '1' day, age(current_timestamp , (current_timestamp+ interval '27' hour)),
-- epoch gets the number of seconds in the  interval https://www.postgresql.org/docs/9.2/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
-- * note interval is overloaded here - one meaning is in context of SRS, other meaning is just a postgres data type. above sentence is latter, postgres

extract(epoch from age(current_timestamp , (current_timestamp+ interval '27' hour))) / 60 / 60
;


-- lets say interval is 10 days. 

-- case 1: it is due now, previous interval i = 10, we expect a 1.5 multiplier

WITH v (delta, i, due, study_time) as (
	-- note age(a,b) is          study_time - due
   values (extract(epoch from age( current_timestamp, current_timestamp)) /60/60/24, 10,current_timestamp, current_timestamp )
)
select due, study_time, delta,
(0.5*(i+ delta)/i *i) + i as new_interval
from v;

-- case 2: it is due a week from now, so less than a 1.5 multiplier

WITH v (delta, i, due, study_time) as (
								-- study_time - due	
   values (extract(epoch from age( current_timestamp, current_timestamp + interval '7' day)) /60/60/24, 10,current_timestamp + interval '7' day, current_timestamp )
)
select due, study_time, delta,
(0.5*(i+ delta)/i *i) + i as new_interval
from v;

-- case 3: it was due a week ago - so more than 1.5 multiplier

WITH v (delta, i, due, study_time) as (
								-- study_time - due	
   values (extract(epoch from age( current_timestamp, current_timestamp - interval '7' day)) /60/60/24, 10,current_timestamp - interval '7' day, current_timestamp )
)
select due, study_time, delta,
(0.5*(i+ delta)/i *i) + i as new_interval
from v;