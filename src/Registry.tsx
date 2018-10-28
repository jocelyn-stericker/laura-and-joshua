import { css, StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";

import { ApolloError } from "apollo-boost";
import Login from "./Login";
import Logout from "./Logout";
import RegistryItem, { RegistryItemModel } from "./RegistryItem";

interface Data {
  currentFamily?: {
    id: number;
    name: string;
  };
  allGifts?: {
    nodes: RegistryItemModel[];
  };
}

class RegistryQuery extends Query<Data, {}> {}
const REGISTRY_QUERY = gql`
  query rsvpPage {
    currentFamily {
      id
      name
    }
    allGifts {
      nodes {
        id
        name
        costCents
        description
        link
        image
        maxCount
        category
        familyGiftsByGiftId {
          nodes {
            id
            familyId
            giftId
          }
        }
      }
    }
  }
`;

export default class Home extends React.Component {
  public render() {
    return (
      <RegistryQuery query={REGISTRY_QUERY} onError={this.checkIfExpired}>
        {result => (
          <div className={css(styles.registry)}>
            {result.data &&
              result.data.currentFamily && (
                <Logout
                  name={result.data.currentFamily.name}
                  client={result.client}
                />
              )}
            {result.loading && <span>Loading&hellip;</span>}
            {result.error && <span>Could not load this page.</span>}
            {!result.loading &&
              !result.error &&
              (!result.data || !result.data.currentFamily) && <Login />}
            {!result.loading &&
              !result.error &&
              result.data &&
              result.data.currentFamily &&
              result.data.allGifts && (
                <div>
                  <h1>Registry</h1>
                  {result.data.allGifts.nodes.map(node => (
                    <RegistryItem
                      key={node.id}
                      item={node}
                      familyId={result.data!.currentFamily!.id}
                    />
                  ))}
                </div>
              )}
          </div>
        )}
      </RegistryQuery>
    );
  }

  private checkIfExpired = (e: ApolloError) => {
    if (e.networkError && (e.networkError as any).statusCode === 401) {
      delete localStorage.auth;
      // TODO: just reload the client...
      window.location.reload();
    }
  };
}

const styles = StyleSheet.create({
  registry: {
    fontFamily: "Cormorant",
  },
});
