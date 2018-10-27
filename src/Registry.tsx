import { css, StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";

import Login from "./Login";
import Logout from "./Logout";

interface Data {
  currentFamily: {
    id: number;
    name: string;
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
      <RegistryQuery query={REGISTRY_QUERY}>
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
              result.data.currentFamily && (
                <div>
                  <h1>Registry</h1>
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}
          </div>
        )}
      </RegistryQuery>
    );
  }
}

const styles = StyleSheet.create({
  registry: {
    fontFamily: "Cormorant",
  },
});
