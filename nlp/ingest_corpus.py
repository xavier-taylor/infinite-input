import stanza;


zh_nlp = stanza.Pipeline('zh')

# 1. Read the corpus file line by line
with open('../../../files/UM-Corpus/data/Testing/Testing-Data.txt') as f:
    # for line in f:
    i = 0
    for line in f:
        if (i%2 == 0):
            i = i + 1
            pass
        else:
            #is chinese line
            i = i + 1
            doc = zh_nlp(line)
            if (doc.num_tokens != doc.num_words):
                print('tokens not same count as words')


    #     print(line)
    # eng = "'Couples’ marital satisfaction can depend on whether they commute to work in the same or different directions,' said lead researcher Irene Huang, from the Chinese University of Hong Kong."
    # zh = "香港中文大学首席研究员艾琳•黄说，“夫妇们的婚姻满足感可能取决于他们上下班的时候是否同路。”"


''' By running this stuff in the python repl you get tab completion and can see:
doc.add_property(        doc.ents                 doc.get_mwt_expansions(  doc.num_tokens           doc.set(                 doc.to_dict(             
doc.build_ents(          doc.from_serialized(     doc.iter_tokens(         doc.num_words            doc.set_mwt_expansions(  doc.to_serialized(       
doc.entities             doc.get(                 doc.iter_words(          doc.sentences            doc.text                 

'''


    # TODO workd out which field are optional, which are always there, possibly upos and xpos are compulsory, feats optional. actually can just have field
    # nullable then once have ingested db can confirm empirically which fields are nullable then set a null constraint based on that.

    # TODO workout for this chinese model, is there a distinction between words and tokens? or will the token always be a wrapper around a single 'word'
    # I need to know because I need to know what counts as a 'word' for my use case.
   # tokens	List[Token]	The list of tokens in this sentence.
     # words	List[Word]	The list of words in this sentence
'''A Token object holds a token, and a list of its underlying syntactic Words. 
     In the event that the token is a multi-word token (e.g., French au = à le), 
     the token will have a range id as described in the CoNLL-U format specifications (e.g., 3-4), 
     with its words property containing the underlying Words corresponding to those ids. 
     In other cases, the Token object will function as a simple wrapper around one Word object, where its words property is a singleton.'''

    # can probably have a todo around empirical analysis to understand the different NER categories.
''' Note how they don't use just ORG, but this annoying prefix (when in fact its one who NER)
      { text: '香港', ner: 'B-ORG' },
  { text: '中文', ner: 'I-ORG' },
  { text: '大学', ner: 'E-ORG' },
  { text: '首席', ner: 'O' },
  { text: '研究', ner: 'O' },
  { text: '员', ner: 'O' },
  { text: '艾琳', ner: 'S-PERSON' },
  { text: '•', ner: 'O' },
  { text: '黄说', ner: 'S-PERSON' },
 now note, in addition to these *token level* entities, we have: sentence/document level
'''

'''   print(doc.ents) note - it gets it kinda wrong,as the person name is 艾琳黄, 说 is just a verb!
 But at least this gives us both word level ner tag and also a sentence level one.
    >>> doc.ents or >>> doc.sentences[0].ents both give us the following list. One supposes the offsets would be different in a multi sentence doc
    INCORRECT! see appendix B below. the offsets are always in the full text of the document, not within the sentence! 
[{
  "text": "香港中文大学",
  "type": "ORG",
  "start_char": 0,
  "end_char": 6
}, {
  "text": "艾琳",
  "type": "PERSON",
  "start_char": 11,
  "end_char": 13
}, {
  "text": "黄说",
  "type": "PERSON",
  "start_char": 14,
  "end_char": 16
}]
ALSO note of interest: each of these ents is a Span object, which has other properties not shown in the print(), ie:
>>> doc.sentences[0].ents[0].tokens
[[
  {
    "id": 3,
    "text": "中国",
    "lemma": "中国",
    "upos": "PROPN",
    "xpos": "NNP",
    "head": 4,
    "deprel": "compound",
    "misc": "start_char=2|end_char=4",
    "ner": "S-NORP"
  }
]]

'''
  




    #dic = doc.to_dict() - doesnt seem that important, as the object it creates is the same as AAA below
    #print(dic[0][0]) # {'id': 1, 'text': '香港', 'lemma': '香港', 'upos': 'PROPN', 'xpos': 'NNP', 'head': 6, 'deprel': 'nmod', 'misc': 'start_char=0|end_char=2', 'ner': 'B-ORG'}
   
   
   
    #print(doc.sentences[0].words)


'''
    for sentence in doc.sentences:
        print(sentence)
    # prints an array of objects like
   AAA   {
    "id": 1,
    "text": "香港",
    "lemma": "香港",
    "upos": "PROPN",
    "xpos": "NNP",
    "head": 6,
    "deprel": "nmod",
    "misc": "start_char=0|end_char=2", # end char seems to be exclusive
    "ner": "B-ORG"
  },

    
  {
    "id": 21,
    "text": "他们",
    "lemma": "他", #I wonder if lemma is worth storing in db? I suppose each word instance could have a lemma pointing back at a hanzi
    "upos": "PRON",
    "xpos": "PRP",
    "feats": "Number=Plur|Person=3", # note how this is a | seperated list, and an optional field
    "head": 23,
    "deprel": "nsubj",
    "misc": "start_char=32|end_char=34",
    "ner": "O"
  },
'''

'''
    print(doc.sentences[0].words) - confusing, slightly different to the above, seems like a subset
prints an array of things like this:
{
  "id": 1,
  "text": "香港",
  "lemma": "香港",
  "upos": "PROPN",
  "xpos": "NNP",
  "head": 6,
  "deprel": "nmod",
  "misc": "start_char=0|end_char=2"
},
{
  "id": 21,
  "text": "他们",
  "lemma": "他",
  "upos": "PRON",
  "xpos": "PRP",
  "feats": "Number=Plur|Person=3",
  "head": 23,
  "deprel": "nsubj",
  "misc": "start_char=32|end_char=34"
},

'''



''' BBB
>>> zh = "我是中国人。 香港中文大学首席研究员艾琳•黄说，“夫妇们的婚姻满足感可能取决于他们上下班的时候是否同路。”"
>>> doc = zh_nlp(zh)
>>> doc.ents
[{
  "text": "中国",
  "type": "NORP",
  "start_char": 2,
  "end_char": 4
}, {
  "text": "香港中文大学",
  "type": "ORG",
  "start_char": 7,
  "end_char": 13
}, {
  "text": "艾琳",
  "type": "PERSON",
  "start_char": 18,
  "end_char": 20
}, {
  "text": "黄说",
  "type": "PERSON",
  "start_char": 21,
  "end_char": 23
}]
>>> doc.sentences[0].ents
[{
  "text": "中国",
  "type": "NORP",
  "start_char": 2,
  "end_char": 4
}]
>>> doc.sentences[1].ents
[{
  "text": "香港中文大学",
  "type": "ORG",
  "start_char": 7,
  "end_char": 13
}, {
  "text": "艾琳",
  "type": "PERSON",
  "start_char": 18,
  "end_char": 20
}, {
  "text": "黄说",
  "type": "PERSON",
  "start_char": 21,
  "end_char": 23
}]

'''