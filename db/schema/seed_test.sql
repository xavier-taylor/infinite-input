
--INSERT INTO mandarin.student (first_name, last_name) values ('xavier', 'taylor');


-- due today 
INSERT INTO mandarin.student_word
(word_hanzi, student_id, locked, date_last_unlocked, date_learned, learning)
SELECT distinct(hanzi),1, false,  CURRENT_DATE-1, CURRENT_DATE-1,'learned'::mandarin.learning_state  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =2;

INSERT INTO mandarin.student_word_read 
(word_hanzi, student_id,  due, interval)
SELECT distinct(hanzi),1, CURRENT_DATE, 1  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =2 on conflict do nothing;


-- due later,
INSERT INTO mandarin.student_word
(word_hanzi, student_id, locked, date_last_unlocked, date_learned, learning)
SELECT distinct(hanzi),1, false,  CURRENT_DATE-1, CURRENT_DATE-1, 'learned'::mandarin.learning_state  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010  in(1,3,4);

INSERT INTO mandarin.student_word_read 
(word_hanzi, student_id, due, interval)
SELECT distinct(hanzi),1,  CURRENT_DATE+180, 1 from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 in (1,3,4) on conflict do nothing


set search_path = 'mandarin';
select count(*) from student_word_read swr join word on swr.word_hanzi = word.hanzi group by hsk_word_2010;

select hsk_word_2010, count(*) from  word  group by hsk_word_2010;
select * from word where hsk_word_2010 is null;

