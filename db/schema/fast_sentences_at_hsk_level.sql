-- CREATE INDEX idx_sentence_word_sentence_id on mandarin.sentence_word  (sentence_id);
-- CREATE INDEX idx_sentence_word_word_hanzi on mandarin.sentence_word  (word_hanzi);
-- CREATE INDEX idx_sentence_document_id on mandarin.sentence (document_id);
-- CREATE INDEX idx_word_hsk_word_2010 on mandarin.word (hsk_word_2010);

SELECT document.id, document.chinese, document.english, document.words_upos_not_punct FROM mandarin.document
WHERE NOT EXISTS (
	SELECT sentence.id FROM mandarin.sentence
	JOIN mandarin.sentence_word ON sentence_word.sentence_id = sentence.id
	JOIN mandarin.word ON sentence_word.word_hanzi = word.hanzi
	WHERE word.hsk_word_2010 > 4 AND sentence.document_id = document.id AND
	sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM', 'PROPN')
);

--! 1.711seconds for this, rather than 1 min 15 seconds the old way!!! niceee-- 
---! after all the indexes added, only down to 1.67ish seconds lol, but maybe useful at larger data sizes!!

-- note that in reality we wont be searching by hsk level, instead by the inclusion of the words in a users known words,
-- but I *think* this is a useful heuristic.
-- also really important ASAP to get a few million documents in and see how these queries hold up.