import { useQuery } from '@apollo/client';
import { Card, CardActions, CardContent, Grid } from '@mui/material';
import { DateTime } from 'luxon';
import { DueWordsDocument, KnownWordsDocument } from '../schema/generated';
import { GridContainer } from '../Components/Layout/Common';

// TODO visualize this data somehow
const Home: React.FC<{}> = () => {
  const { loading, data, error } = useQuery(KnownWordsDocument, {
    fetchPolicy: 'network-only',
  });

  const { loading: loadingDue, data: dataDue, error: errorDue } = useQuery(
    DueWordsDocument,
    {
      variables: { dayStartUTC: DateTime.now().startOf('day').toUTC().toISO() },
      fetchPolicy: 'network-only',
    }
  );

  if (loading) return <div></div>;
  if (error) return <div></div>;
  if (!data) return <div></div>;

  return (
    <GridContainer>
      <Grid item>
        <div lang="zh"></div>
      </Grid>
    </GridContainer>
  );
};

export default Home;

/* TODO remove this and replace with a proper home page - but leave for now - this works! *
                some kind of home page - testing button! 
                
                Idea: floating word
                cloud visualization of the words that are due Could do a
                wordcloud where words are sized by their interval (or an inverse
                function of it) basically, the 'newer' (or more recently wrong)
                a word is, the bigger it is on this visualization.

                Feature - as you review words, they dissapear from the word cloud (even if the same word will appear in a subsequent sentence)
                (although they would reappear in it if you got them wrong in a review).
                REally fun idea, but functionaly not important, leave until using app.

                https://github.com/veysiyildiz/d3-tagcloud-for-react
                https://github.com/IjzerenHein/react-tag-cloud
                https://github.com/Yoctol/react-d3-cloud

                https://github.com/chrisrzhou/react-wordcloud
                react-wordcloud handles updating D3 transitions when words, size and options prop change. The following example demonstrates this behavior.
                - ie could have an endless loop updating the size/options to keep it buzzing around

                I say just use a d3 wordcloud library with minimal/no animation.
                Then as a programming exercise of my own (later one) build a word sphere library.

                https://www.cssscript.com/animated-sphere-tag-cloud/ - this is what I really want
                
                 -------------------------------------
                 |  words here    | onclick get
                 |                    |  definition
                 |                    | etc here
                 |                    |
                 |----------------------------------
                 | click to make the cloud known words
                 | click to make the cloud due words

                 actually dont show 'count due' or 'cound known' as numbers
                 it is confusing vs the number of documents due.
                 Just have button


                 The wordclouds dont work for known words - far too many. 
                 Frankly not useful anyway, even if 'cute'.
                 also hard to do responsively. Think of something else.

                 simplest possible is a big blog of text (maybe vertically),
                 with each word a different colour.

                //  Can I make the words big enough to fill the space (but not infintiately small)

                    */
