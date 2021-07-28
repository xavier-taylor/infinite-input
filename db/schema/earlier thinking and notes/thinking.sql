SET search_path TO mandarin;

WITH hsk AS ( 
	SELECT distinct(simplified) as w from cc_cedict JOIN word on hanzi = simplified WHERE hsk_word_2010 < 4
)
SELECT DIstinct document.id, document.chinese, document.english FROM mandarin.document 
JOIN document_word ON document.id = document_id
where all document_word.word in (SELECT w from hsk);

SELECT column_name(s)
FROM table_name
WHERE condition
GROUP BY column_name(s)
HAVING condition
ORDER BY column_name(s);
 - maybe I need to use a having?
 https://stackoverflow.com/questions/14297354/sql-select-i-need-a-in-all-clause
/* -- t
 
 WHERE NOT EXISTS (
		SELECT full_sentence_word.document_id from mandarin.full_sentence_word
		JOIN mandarin.word ON word.hanzi = full_sentence_word.word_hanzi
		WHERE full_sentence_word.document_id = document.id
		AND word.hsk_word_2010 > 5        -- this line is a subsitutute for identifying the users set of known words
		AND full_sentence_word.word_upos NOT IN ('PUNCT', 'NUM') 
		AND full_sentence_word.ner = 'O'
	);
	
	*/