/*
* This file was generated by a tool.
* Rerun sql-ts to regenerate this file.
*/
export interface cc_cedict {
  "id"?: any 
  "simplified": string 
  "traditional": string 
  "pinyin": string 
  "definitions": string[] 
}
export interface cc_cedict_definition {
  "cc_cedict_id": any 
  "definition_meaning": string 
}
export interface corpus {
  "title": string 
  "licence": string 
  "website": string 
  "summary": string 
}
export interface document {
  "id"?: any 
  "sub_corpus_title": string 
  "corpus_title": string 
  "previous_document": any | null 
  "english": string | null 
  "chinese": string 
  "words_upos_not_punct": any 
}
export interface document_word {
  "document_id": any | null 
  "document_chinese": string | null 
  "document_english": string | null 
  "sentence_id": any | null 
  "word": string | null 
  "word_upos": string | null 
  "ner": string | null 
}
export interface full_sentence_word {
  "document_id": any | null 
  "sentence_id": any | null 
  "word_hanzi": string | null 
  "word_upos": string | null 
  "ner": string | null 
}
export interface listen_log {
  "date_time": Date 
  "student_id": any 
  "understood": boolean 
  "sentence_word_id": number 
  "sentence_id": any 
}
export interface named_entity {
  "id"?: any 
  "chinese": string 
  "entity_type": string 
  "start_char": number 
  "end_char": number 
  "document_id": any 
}
export interface read_log {
  "date_time": Date 
  "student_id": any 
  "understood": boolean 
  "sentence_word_id": number 
  "sentence_id": any 
}
export interface sentence {
  "id"?: any 
  "document_id": any 
  "chinese": string 
  "sentiment": string 
}
export interface sentence_word {
  "id": number 
  "sentence_id": any 
  "word_hanzi": string 
  "lemma": string 
  "part_of_speech": string 
  "universal_part_of_speech": string 
  "head": number 
  "deprel": string 
  "feats": any 
  "start_char": number 
  "end_char": number 
  "ner": string 
  "named_entity_id": any | null 
}
export interface student {
  "id"?: any 
  "first_name": string 
  "last_name": string 
}
export interface student_document_listen {
  "student_id": any 
  "document_id": any 
  "listen_count": any 
}
export interface student_document_read {
  "student_id": any 
  "document_id": any 
  "read_count": any 
}
export interface student_word_listen {
  "student_id": any 
  "word_hanzi": string 
  "f1": any 
  "f2": any 
  "due": Date 
  "previous": Date 
  "understood_count": any 
  "understood_distinct_documents_count": any 
}
export interface student_word_read {
  "student_id": any 
  "word_hanzi": string 
  "f1": any 
  "f2": any 
  "due": Date 
  "previous": Date 
  "understood_count": any 
  "understood_distinct_documents_count": any 
}
export interface sub_corpus {
  "title": string 
  "corpus_title": string 
  "summary": string 
}
export interface word {
  "hanzi": string 
  "hsk_word_2010": number 
  "hsk_char_2010": number 
}
