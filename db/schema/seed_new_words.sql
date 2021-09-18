

set search_path = 'mandarin';


-- insert some unlocked but not yet learned words
insert into student_word
(word_hanzi, student_id, locked, date_last_unlocked, learning, tags, position)
SELECT
distinct(hanzi) as h, 1, false, current_date, 'not_yet_learned'::learning_state, '{}'::text[], floor(random() * 10 + 1)::int
from mandarin.word w JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =6 and 
not exists (select 1 from student_word sw1 where sw1.word_hanzi= w.hanzi)
group by h
limit 10;

-- insert some partially learned words
insert into student_word
(word_hanzi, student_id, locked, date_last_unlocked, learning, tags, position, due)
SELECT
distinct(hanzi) as h, 1, false, current_date, 'meaning'::learning_state, '{}'::text[], floor(random() * 10 + 1)::int, current_date -1
from mandarin.word w JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =6 and 
not exists (select 1 from student_word sw1 where sw1.word_hanzi= w.hanzi)
group by h
limit 3;

-- sample new words query that puts partially learned words above not_yet_learned, and then sorts by order
select * from student_word
where learning != 'learned'::learning_state
and student_id = 1
and locked = false
order by learning desc, position asc
limit 10;

select count(*) from student_word
where learning != 'learned'::learning_state
and student_id = 1
and locked = false
