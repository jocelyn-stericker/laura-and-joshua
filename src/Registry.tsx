import { css, StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";

import { ApolloError } from "apollo-boost";
import { Link } from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";
import RegistryItem, { RegistryItemModel } from "./RegistryItem";
import { COLORS } from "./shared-styles";

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

interface Props {
  // From React Router
  match: {
    params: {
      category?: string;
    };
  };
}

export default class Registry extends React.Component<Props> {
  public render() {
    const selectedCategory = this.props.match.params.category;

    return (
      <RegistryQuery
        query={REGISTRY_QUERY}
        onError={this.checkIfExpired}
        pollInterval={8000}
      >
        {result => {
          const categories =
            (result.data &&
              result.data.allGifts &&
              Object.keys(
                result.data.allGifts.nodes.reduce((categorySet, gift) => {
                  categorySet[gift.category] = true;
                  return categorySet;
                }, {}),
              )) ||
            [];

          return (
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
                    {selectedCategory ? (
                      <div>
                        Only showing items in category{" "}
                        <strong>{selectedCategory}</strong>.{" "}
                        <Link className={css(styles.category)} to="/registry">
                          Show all items
                        </Link>
                      </div>
                    ) : (
                      <div>
                        Filter by category:{" "}
                        {categories.map(category => (
                          <span>
                            <Link
                              className={css(styles.category)}
                              to={`/registry/category/${category}`}
                            >
                              {category[0].toUpperCase() + category.slice(1)}
                            </Link>{" "}
                          </span>
                        ))}
                      </div>
                    )}

                    {result.data.allGifts.nodes
                      .filter(
                        node =>
                          !selectedCategory ||
                          selectedCategory === node.category,
                      )
                      .map(node => (
                        <RegistryItem
                          key={node.id}
                          item={node}
                          familyId={result.data!.currentFamily!.id}
                        />
                      ))}
                  </div>
                )}
            </div>
          );
        }}
      </RegistryQuery>
    );
  }

  private checkIfExpired = (e: ApolloError) => {
    if (
      e.networkError &&
      [401, 403].indexOf((e.networkError as any).statusCode) > -1
    ) {
      delete localStorage.auth;
      // TODO: just reload the client...
      window.location.reload();
    }
  };
}

const styles = StyleSheet.create({
  category: {
    border: `1px solid ${COLORS.darkTeal}`,
    borderRadius: 4,
    background: COLORS.lightTeal,
    color: COLORS.white,
    padding: "4px 16px",
    fontWeight: "bold",
    marginLeft: 8,
    textDecoration: "none",
    [":hover"]: {
      background: COLORS.plum,
    },
  },
  registry: {
    fontFamily: "Cormorant",
  },
});
