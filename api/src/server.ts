import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typedefs';
import { resolvers } from './resolvers';
import { PostgresqlRepo } from './repository/repo';
import Knex from 'knex';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { SpeechSynthesisOutputFormat } from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';

export interface IContextType {
  test: string;
  repo: PostgresqlRepo;
}

const connection = {
  host: 'localhost',
  user: 'xavier',
  password: 'localdb-4301',
  database: 'infinite_input',
};

const knexConfig = {
  client: 'pg',
  connection,
  searchPath: ['mandarin'],
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument
  // this argument is called for each request!
  context: async (): Promise<Omit<IContextType, 'dataSources'>> => {
    const knex = Knex(knexConfig); // TODO work out if need to delete/close etc this instance
    return {
      test: 'TEST',
      repo: new PostgresqlRepo(knex),
    };
  },
});
// note context can be async so can connect to db etc
// context: async ({req}) => ({
//   db: await client.connect(),
//   authScope: getScope(req.headers.authorization),
// })
// see also https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// Express app for serving audio
const app = express();
const port = 3000;
const azureKey = process.env['AZURE_KEY'];
app.get('/api/tts/word/:word.oga', async (req, res) => {
  const word = req.params.word;
  const subscriptionKey = azureKey;
  const serviceRegion = 'australiaeast';

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey as string,
    serviceRegion
  );

  speechConfig.speechSynthesisOutputFormat =
    SpeechSynthesisOutputFormat.Ogg24Khz16BitMonoOpus;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  synthesizer.speakSsmlAsync(
    `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
    <voice name="zh-CN-XiaoxiaoNeural">
        <mstts:express-as style="sad" styledegree="2">
            ${word}
        </mstts:express-as>
    </voice>
    </speak>
    `,
    (resp) => {
      const audio = resp.audioData;

      console.log(audio);

      synthesizer.close();

      const buffer = Buffer.from(audio);
      res.set('Content-Type', 'audio/ogg; codecs=opus; rate=24000');
      res.send(buffer);
    }
  );
});
// Below was using the REST api.
// console.log(word);
// try {
//   const authResp = await axios({
//     method: 'POST',
//     url:
//       'https://australiaeast.api.cognitive.microsoft.com/sts/v1.0/issueToken?=',
//     headers: {
//       'Ocp-Apim-Subscription-Key': azureKey,
//     },
//   });
//   const auth = authResp.data;

//   const xml = `
//   <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
//      xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
//   <voice name="zh-CN-XiaoxiaoNeural">
//       <mstts:express-as style="sad" styledegree="2">
//           ${word}
//       </mstts:express-as>
//   </voice>
//   </speak>
//   `;

//   const wordResp = await axios({
//     method: 'POST',
//     url:
//       'https://australiaeast.tts.speech.microsoft.com/cognitiveservices/v1',
//     headers: {
//       Authorization: `Bearer ${auth}`,
//       'Content-Type': 'application/ssml+xml',
//       'X-Microsoft-OutputFormat': 'ogg-24khz-16bit-mono-opus',
//       // 'X-Microsoft-OutputFormat': ' audio-24khz-160kbitrate-mono-mp3',
//       'User-Agent': 'xavier', // TODO what is this meant to be?
//     },
//     data: xml,
//   });
//   console.log(wordResp.status);
//   fs.writeFileSync('test.oga', wordResp.data);
//   // console.log(wordResp.data);
//   // // Just guessing this content type based on the content-type of the response
//   // // the above API call gives.
//   res.set('Content-Type', 'audio/ogg; codecs=opus; rate=24000');
//   // console.log(typeof wordResp.data);
//   // const buffer = Buffer.from(wordResp.data);

//   res.send(wordResp.data);
// } catch (e) {
//   console.log(e);
// }
// };

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
