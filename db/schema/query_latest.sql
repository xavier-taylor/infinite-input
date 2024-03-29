SET search_path TO mandarin;

with candidates as ( 
SELECT 
	chinese,id, english 
FROM
	document 
-- doesn't exist a word I don't know
WHERE NOT EXISTS (
	SELECT 
		1
	FROM
		sentence_word
	LEFT JOIN
		student_word_read
	ON
		student_word_read.student_id = 1 AND student_word_read.word_hanzi = sentence_word.word_hanzi
	WHERE
		student_word_read.word_hanzi IS null AND sentence_word.document_id = document.id AND sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM')
) ),

due as (SELECT word_hanzi FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE)
-- exists a word that is due today
select 
	id, chinese, english, count(distinct(sentence_word.word_hanzi)), array_agg(distinct(sentence_word.word_hanzi)) as due, cast(count(distinct(sentence_word.word_hanzi)) as float)/cast((length(chinese)) as float) as fraction_due 
from 
	candidates 
JOIN 
	sentence_word on candidates.id = sentence_word.document_id
JOIN 
	due on sentence_word.word_hanzi = due.word_hanzi 
group by 
	id, chinese, english 
order by 
	count(distinct(sentence_word.word_hanzi)) desc, fraction_due desc
;

-- took 11.5 secs before index creation
-- took 6.5-7 secs after btree index creation
-- with hash index also seemed to take 6.5 seconds

--


-- TODO - try version of query that is just a join that starts from
-- ie from student_word_read join sentence word join document (something like that)