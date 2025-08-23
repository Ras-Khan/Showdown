import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client';

// Placeholder GraphQL endpoint
const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://placeholder-graphql-api.com/graphql' }), // Replace with real endpoint
  cache: new InMemoryCache(),
});

// Placeholder query for searching TV shows
export const SEARCH_SHOWS = gql`
  query SearchShows($query: String!) {
    searchShows(query: $query) {
      id
      name
      nextEpisode {
        airDate
        episodeNumber
        seasonNumber
      }
    }
  }
`;

export default client;
