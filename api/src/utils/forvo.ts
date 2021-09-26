// sample real api response{
//     "items": [
//         {
//             "id": 4812832,
//             "word": "朋友",
//             "original": "朋友",
//             "addtime": "2017-02-08 11:07:41",
//             "hits": 2546,
//             "username": "gamyc",
//             "sex": "m",
//             "country": "China",
//             "code": "zh",
//             "langname": "Mandarin Chinese",
//             "pathmp3": "https://apifree.forvo.com/audio/...,
//             "pathogg": "https://apifree.forvo.com/audio/...,
//             "rate": 2,
//             "num_votes": 2,
//             "num_positive_votes": 2
//         }
//     ]
// }

export interface ForvoItem {
  id: number;
  word: string;
  original: string;
  addtime: string;
  hits: number;
  username: string;
  sex: string;
  country: string;
  code: string;
  langname: string;
  pathmp3: string;
  pathogg: string;
  rate: number;
  num_votes: number;
  num_positive_votes: number;
}
export interface ForvoApiResponse {
  items: Array<ForvoItem>;
}
