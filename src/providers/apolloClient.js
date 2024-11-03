import { ApolloClient, InMemoryCache } from '@apollo/client';

// Replace with your subgraph endpoint
const client = new ApolloClient({
    uri: process.env.REACT_APP_SUB_GRAPH_API,
    cache: new InMemoryCache(),
});

export default client;
