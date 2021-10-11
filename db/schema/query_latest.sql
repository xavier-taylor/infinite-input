SET search_path TO mandarin;



with candidates as ( 
SELECT 
	chinese,id, english, n_non_punct 
FROM
	document 
WHERE
	
/*	exists ( -- exists at least one word that is due (with this, the 'candidates' query gets all the docs we need in 7.4 seconds)
	SELECT 
		1
	FROM
		sentence_word
	JOIN
		student_word_read
	ON
		student_word_read.student_id = 1 AND student_word_read.word_hanzi = sentence_word.word_hanzi AND due <= CURRENT_DATE
	WHERE
		sentence_word.document_id = document.id 
) and*/ NOT EXISTS ( -- doesn't exist a word I don't know

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
)
 

),

due as (SELECT word_hanzi FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE)
-- exists a word that is due today
select 
	id, chinese, english, count(distinct(due.word_hanzi)) as count_due, 
	array_agg(distinct(due.word_hanzi)) as due, 
	(
		case when 
			n_non_punct =0 
		then 
			0 
		else 
			cast(count(distinct(due.word_hanzi)) as float)/cast(n_non_punct as float) 
		end
	) as fraction_due,	
	n_non_punct as sentence_len
from 
	candidates 
JOIN 
	sentence_word on candidates.id = sentence_word.document_id
 JOIN 
	due on sentence_word.word_hanzi = due.word_hanzi 
group by 
	id, chinese, english, n_non_punct 
order by 
	--id
	count_due desc, fraction_due desc
;



-- query currently takes 8 seconds

-- with hash index also seemed to take 6.5 seconds - worth seeing if the hash index is better in the end.
