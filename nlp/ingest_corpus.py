#! /usr/bin/python3.9
import psycopg2
import stanza
from typing import List
from datetime import datetime
from psycopg2.extras import Json

'''
>> import stanza
>>> stanza.download('zh') - you need to do this to get the chinese models first
for traditional chinese - zh-hant, ran that too, id for indonesian, ran that too

Notes: - can do nlp at rate of 21 sentences per sec
- But with the below database ingestion and file i/o, seem to be able to do.... 15.64 when inserted 1000 sentences.
'''
#word: stanza.models.common.doc.Word

def extract_feats(word):
    feats = {}
    if(word.feats is None or word.feats == ''):
        return feats
    else:
        feat_list = word.feats.split('|')
        feat_pairs = list(map((lambda x: x.split('=')), feat_list))
        for pair in feat_pairs:
            key = pair[0]
            value = pair[1]
            feats[key] = value
        return feats


class SubCorpus:
    def __init__(self, title: str, path: str, summary: str):
        self.title = title
        self.path = path
        self.summary = summary

SubCorpusList = List[SubCorpus]

class Corpus:
    def __init__(
        self, 
        title: str,
        root_dir: str,
        licence: str,
        website: str,
        summary: str,
        sub_corpuses: SubCorpusList
        ):
        self.title = title
        self.root_dir = root_dir
        self.licence = licence
        self.website = website
        self.summary = summary
        self.sub_corpuses = sub_corpuses
    
um_summary = '''The UM-Corpus has been designed to be a multi-domain and balanced parallel corpus for research and development purpose. In this version, a two million English-Chinese aligned corpus is provided, and it is categorized into eight different text domains, covering several topics and text genres, including: Education, Laws, Microblog, News, Science, Spoken, Subtitles, and Thesis. For a detailed description of the corpus, you may refer to [1].

You should acknowledge with appropriate citation in any publication or presentation containing research results obtained in whole or in part through the use of the UM-Corpus. The following reference should be cited: [1].

Download UM-Corpus

Reference

[1] Liang Tian, Derek F. Wong, Lidia S. Chao, Paulo Quaresma, Francisco Oliveira, Shuo Li, Yiming Wang, Yi Lu, "UM-Corpus: A Large English-Chinese Parallel Corpus for Statistical Machine Translation". Proceedings of the 9th International Conference on Language Resources and Evaluation (LREC'14), Reykjavik, Iceland, 2014.'''
um_ed_summary = 'The texts in this domain are acquired from online  teaching  materials,  such  as  language  teaching resources,  dictionaries,  etc.,  which  can  be  served  as language education'

# I just so happened to ingest the 8 corpora (+ 1 test set) in these chunks, no significance in their order etc
# A B done, C done
#sub_corpora_a=[SubCorpus(title='Education', path='Education/Bi-Education.txt', summary=um_ed_summary)])
#sub_corpora_b = [SubCorpus(title='Laws', path='Laws/Bi-Laws.txt', summary='TBD'), SubCorpus(title='Microblog', path='Microblog/Bi-Microblog.txt', summary='TBD'), SubCorpus(title='News', path='News/Bi-News.txt', summary='TBD'), SubCorpus(title='Spoken', path='Spoken/Bi-Spoken.txt', summary='TBD') ]
# sub_corpora_c = [SubCorpus(title='Science', path='Science/Bi-Science.txt', summary='TBD'), SubCorpus(title='Subtitles', path='Subtitles/Bi-Subtitles.txt', summary='TBD'), SubCorpus(title='Thesis', path='Thesis/Bi-Thesis.txt', summary='TBD'), SubCorpus(title='Testing', path='Testing/Testing-Data.txt', summary='Test data for the um corpus') ]

corpus = Corpus(
    title='UM-Corpus', 
    root_dir='../../../files/UM-Corpus/data/Bilingual/',
    licence='https://creativecommons.org/licenses/by-nc-nd/4.0/',
    website='http://nlp2ct.cis.umac.mo/um-corpus/',
    summary=um_summary,
    #sub_corpuses=[SubCorpus(title='Education', path='Education/Bi-Education.txt', summary=um_ed_summary)])
    # sub_corpuses=sub_corpora_c)
    sub_corpuses=[SubCorpus(title='Microblog', path='Microblog/Bi-Microblog.txt', summary='TBD')])

zh_nlp = stanza.Pipeline('zh')
# records = cur.fetchall()
# print(records[0])

# INSERT corpus
conn = psycopg2.connect("dbname=infinite_input user=xavier password=localdb-4301")
conn.autocommit = True
cur = conn.cursor()

if (True):
    cur.execute('''
        INSERT INTO mandarin.corpus (title, licence, website, summary) 
        VALUES (%(title)s, %(licence)s, %(website)s, %(summary)s);''',
        {
            'title': corpus.title,
            'licence': corpus.licence,
            'website': corpus.website,
            'summary': corpus.summary
        }
        )

# FOR subcorpus
# -- INSERT subcorpus
for subcorpus in corpus.sub_corpuses:
    print('starting to process subcorpus: '+subcorpus.title)
    cur.execute('''
        INSERT INTO mandarin.sub_corpus (title, corpus_title, summary) 
        VALUES (%(title)s, %(corpus_title)s, %(summary)s);''',
        {
            'title': subcorpus.title,
            'corpus_title': corpus.title,
            'summary': subcorpus.summary
        }
        )
    path = corpus.root_dir + subcorpus.path
    with open(path) as f:
        line_index = 0 
        english = ''
        chinese = ''
        before = datetime.now()
        document_id = None # the first document has a null reference for its previous_document ref

        for line in f:
            if(line_index==2):
                break
            if (line_index%2 == 0):
                english = line
                line_index = line_index + 1
            else:
                chinese = line

                # -- FOR text in corpus
                # -- -- run nlp
                doc = zh_nlp(chinese)

                # -- -- insert document

                cur.execute('''
                    INSERT INTO mandarin.document (sub_corpus_title, corpus_title, previous_document, english, chinese) 
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;''',
                    (subcorpus.title, corpus.title, document_id, english, chinese.rstrip() )
                    )
                document_id = cur.fetchone()[0]
                # -- -- FOR sentence in document
                for idx, sentence in enumerate(doc.sentences):
                # -- -- -- insert sentence
                    # add sentence index TODO (ie a field called document_index that has value 0 for first sentence in a document)
                    cur.execute('''
                        INSERT INTO mandarin.sentence (document_id, chinese, sentiment, document_index) 
                        VALUES (%s, %s, %s, %s)
                        RETURNING id;''',
                        (document_id, sentence.text, sentence.sentiment, idx)
                        )
                    sentence_id = cur.fetchone()[0]
                    assert(len(sentence.words) == len(sentence.tokens))
                # -- -- -- FOR word in sentence
                # -- -- -- -- upsert lemma
                # -- -- -- -- upsert word sycopg2.extras.execute_batch(cur, sql, argslist, page_size=100)
                # -- -- -- -- insert sentence_word https://www.psycopg.org/docs/extras.html#fast-exec
                    for i in range(len(sentence.words)):
                        word = sentence.words[i]
                        token = sentence.tokens[i]
                        feats = extract_feats(word)
                        cur.execute('''
                        INSERT INTO mandarin.word (hanzi) 
                        VALUES (%s ) ON CONFLICT DO NOTHING;
                        ''',
                        (word.text, ))
                        if(word.text != word.lemma):
                            cur.execute('''
                            INSERT INTO mandarin.word (hanzi ) 
                            VALUES (%s ) ON CONFLICT DO NOTHING;
                            ''',
                            (word.lemma, ))
                        cur.execute('''
                        INSERT INTO mandarin.sentence_word (
                            stanza_id, 
                            sentence_id, 
                            word_hanzi,
                            lemma,
                            part_of_speech,
                            universal_part_of_speech,
                            head,
                            deprel,
                            feats,
                            start_char,
                            end_char,
                            ner,
                            document_id
                        ) 
                        VALUES (
                            %s, 
                            %s, 
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s
                            );
                        ''',
                        (
                            word.id,
                            sentence_id,
                            word.text,
                            word.lemma,
                            word.xpos,
                            word.upos,
                            word.head,
                            word.deprel,
                            Json(feats),
                            token.start_char,
                            token.end_char,
                            token.ner,
                            document_id
                        ))
                # -- -- -- FOR ent in sentence
                # -- -- -- -- insert named_entity
                    for ent in sentence.ents:
                        cur.execute('''
                        INSERT INTO mandarin.named_entity (chinese, entity_type, start_char, end_char, document_id) 
                        VALUES (%s, %s, %s, %s, %s) RETURNING id;
                        ''',
                        (ent.text, ent.type, ent.start_char, ent.end_char, document_id))
                        entity_id = cur.fetchone()[0]
                # -- -- -- -- FOR word in ent
                # -- -- -- -- -- update sentence_word with named_entity
                        for word in ent.words:
                            cur.execute('''
                            UPDATE mandarin.sentence_word
                            SET named_entity_id = %s
                            WHERE 
                                stanza_id = %s AND
                                sentence_id = %s
                            ;
                            ''',
                            (entity_id, word.id, sentence_id))




                line_index = line_index + 1
                # if( line_index > 2000):
                    # break
        print(line_index)
        after = datetime.now()
        print('sentences: '+ str(line_index/2))
        print(after - before)
        delta = after - before
        print('seconds ' +str(delta.seconds))
        print(delta.seconds / 60)
        print(delta.seconds % 60)
        if (delta.seconds > 0):
            print('sentences per second ', str(line_index/2/delta.seconds))

       # TODO undo set session_replication_role to replica;, which you did before running this for the subcorpus.  
            

'''
TODO continue here
status: I have this file 'runnable' again (don't forget to run delete script and set Corpus boolean before running again).
The problem is, I don't have my pytorch and or cuda etc set up right - I get various errors, ie:
My next task is to resolve these errors

/home/xavier/.local/lib/python3.9/site-packages/torch/cuda/__init__.py:52: UserWarning: CUDA initialization: Unexpected error from cudaGetDeviceCount(). Did you run some cuda functions before calling NumCudaDevices() that might have already set an error? Error 803: system has unsupported display driver / cuda driver combination (Triggered internally at  /pytorch/c10/cuda/CUDAFunctions.cpp:115.)
  return torch._C._cuda_getDeviceCount() > 0

/home/xavier/.local/lib/python3.9/site-packages/torch/nn/functional.py:652: UserWarning: Named tensors and all their associated APIs are an experimental feature and subject to change. Please do not use them for anything important until they are released as stable. (Triggered internally at  /pytorch/c10/core/TensorImpl.h:1156.)
  return torch.max_pool1d(input, kernel_size, stride, padding, dilation, ceil_mode)

1. fix these errors/fix the installation of this python stuff
2. re ingest the um corpus
3. regenerate my sql typescript types, then update gql stuff including generating types etc etc

'''
