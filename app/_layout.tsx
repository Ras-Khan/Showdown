import { ApolloProvider } from "@apollo/client/react";
import React from "react";
import client from "./graphql";
import Showdown from "./Showdown";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Showdown />
    </ApolloProvider>
  );
}
