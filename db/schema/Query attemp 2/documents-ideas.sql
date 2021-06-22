SET search_path TO mandarin;

-- perhaps start with a non aggregated version where you just join doc x sentence x sentence_w
select document.id, document.chinese, english, json_agg(json_build_object('id', sentence.id, 'chinese', sentence.chinese)) as sentences from document join sentence on document.id = document_id where document.id = 1 group by document.id;

--even if you accomplish a giga query
-- it might be smarter to just have
/*
1. a query that returns just a list of the documents (their ids, maybe their english) - this drives the study session, and maybe goes in a reactive var or something
2. a query that grabs all the sentence_words for the 'document' level view of the sentence - ie, one query for that logical component, parametized by the document id
3. sepearte queries for each individual word definition card
4. seperate query for the concordance


*/

/*
select count(sentence.id), document.id, document.chinese from document join sentence on document.id = sentence.document_id 
where document.id = 1068313
group by document.id order by count(sentence.id) desc
;

select document.id, document.chinese, document.english, sentence.id, sentence.chinese from document join sentence on document.id = sentence.document_id 
where document.id = 1068313
;
*/
-- doc id = 481 has 2 sentences

select document.id, sentence.id, sentence.chinese, array_agg(word_hanzi) from document
JOIN sentence on document.id = sentence.document_id
join sentence_word on sentence.id = sentence_word.sentence_id
where document.id = 481
group by document.id, sentence.id;