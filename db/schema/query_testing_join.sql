set search_path to mandarin;

select * from student_word_read;

select * from student_word_read where due < current_date;

select * from student_word_read r 
join 
	sentence_word s
on
	r.word_hanzi = s.word_hanzi
where
	r.due < current_date
;

select distinct(word_hanzi) from student_word_read r where student_id = 1;

-- My mission for today is - 'can I do the query just with a bunch of joins - would that somehow be faster?'
-- maybe start with a mega query that doesn't limit to words I only know

select id, english, chinese, array_agg(distinct(r.word_hanzi)) as due, count(r.word_hanzi) as c  from document d
-- this grabs all the words
join sentence_word sw ON d.id = sw.document_id

-- this grabs the due
join student_word_read r on sw.word_hanzi = r.word_hanzi and r.due<current_date

WHERE r.student_id = 1 And d.id in (1601046, 1444100,682204)

group by d.id
--having count(r.word_hanzi) >1

order by c desc
;



-- query A
select id, english, chinese, sw.word_hanzi as sw, k.word_hanzi as know, r.word_hanzi as due  from document d
-- this grabs all the words
join sentence_word sw ON d.id = sw.document_id

-- the grabs what you know
left join student_word_read k on k.word_hanzi = sw.word_hanzi and k.student_id = 1 

-- this grabs the due
left join student_word_read r on sw.word_hanzi = r.word_hanzi and r.due<current_date

WHERE d.id in (1601046, 1444100,1542432, 1517205, 1631792)

;
-- TODO - add a where or having as well as a group by that removes 1542432 because of the null i know.
-- having sum(case when CircumstanceValueGiven is null then 0 else 1 end) = count(*)

-- then after that, I think I can limit it to 

--query b 
select id, english, chinese, array_agg(distinct(sw.word_hanzi)) as sentence_words, array_agg(distinct(k.word_hanzi)) as know_words, array_agg(distinct(r.word_hanzi)) as due from document d
-- this grabs all the words
join sentence_word sw 
ON 
	d.id = sw.document_id

-- the grabs what you know
left join student_word_read k on k.word_hanzi = sw.word_hanzi and k.student_id = 1 

-- this grabs the due
left join student_word_read r on sw.word_hanzi = r.word_hanzi and r.due<current_date

--WHERE d.id in (1601046, 1444100,1542432, 1517205)
group by id 
having sum(case when (k.word_hanzi is null and sw.universal_part_of_speech NOT IN ('PUNCT', 'NUM')) then 0 else 1 end) = count(sw.word_hanzi) -- this limits us to known words
and sum(case when r.word_hanzi is null then 0 else 1 end) != 0 -- this limits us to documents with at least one due word
;
-- Hurray this query is correct -it returns the same 940 rows as my 'latest query' but boohoo it takes 1 min 40 seconds lol.






-- so the above 'works'
-- now can it be optimized by first selecting only for candidate documents ie
select document_id from sentence_word join student_word_read r on sentence_word.word_hanzi = r.word_hanzi 
where r.due<current_date and r.student_id = 1
group by document_id
;


-- idea? could I say 'where array_agg(sw.word_hanzi)' === array_agg(k.word_hanzi), ie, where the set of words in the sentence is the same as the set of known words in teh sentence?



