import { css, StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import * as React from "react";
import { Mutation, Query } from "react-apollo";

import { ApolloError } from "apollo-boost";
import Login from "./Login";
import Logout from "./Logout";
import RSVPGuest, { Guest } from "./RSVPGuest";
import { sharedStyles } from "./shared-styles";

interface Data {
  currentFamily: {
    id: number;
    name: string;
    guestsByFamilyId: {
      nodes: Guest[];
    };
  };
}

class RSVPQuery extends Query<Data, {}> {}
const RSVP_QUERY = gql`
  query rsvpPage {
    currentFamily {
      id
      name
      guestsByFamilyId {
        nodes {
          id
          name
          email
          comment
          dietaryRestrictions
          acceptedCeremony
          acceptedReception
        }
      }
    }
  }
`;

export default class RSVP extends React.Component {
  public render() {
    return (
      <RSVPQuery query={RSVP_QUERY} onError={this.checkIfExpired}>
        {result => (
          <div className={css(styles.rsvp)}>
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
                  <h1 className={css(sharedStyles.heading)}>
                    Party of {result.data.currentFamily.name}
                  </h1>
                  {result.data.currentFamily.guestsByFamilyId.nodes.map(
                    (guest, i) => (
                      <div key={guest.id}>
                        <h2>
                          Guest {i + 1} (
                          <Mutation
                            variables={{
                              id: guest.id,
                            }}
                            mutation={gql`
                              mutation deleteAGuest($id: Int!) {
                                deleteGuestById(input: { id: $id }) {
                                  familyByFamilyId {
                                    id
                                    guestsByFamilyId {
                                      nodes {
                                        id
                                      }
                                    }
                                  }
                                }
                              }
                            `}
                          >
                            {deleteGuest => (
                              <a
                                onClick={() => {
                                  if (
                                    confirm(
                                      'Really delete this guest? If you will not attend, RSVP with "No, sorry".',
                                    )
                                  ) {
                                    deleteGuest();
                                  }
                                }}
                                href="javascript:void(0)"
                              >
                                delete
                              </a>
                            )}
                          </Mutation>
                          )
                        </h2>
                        <RSVPGuest key={guest.id} guest={guest} />
                      </div>
                    ),
                  )}
                  {!result.data.currentFamily.guestsByFamilyId.nodes.length ? (
                    <div className={css(styles.plusOne)}>
                      Sorry, we don't have any guests recorded in your party.
                      Please start by adding a guest.
                    </div>
                  ) : (
                    <div className={css(styles.plusOne)}>
                      Family and +1s are more than welcome. Click "Add another
                      guest" to let us know they're coming.
                    </div>
                  )}
                  <Mutation
                    mutation={gql`
                      mutation createGuest($familyId: Int!) {
                        createGuest(input: { guest: { familyId: $familyId } }) {
                          guest {
                            familyByFamilyId {
                              id
                              guestsByFamilyId {
                                nodes {
                                  id
                                  name
                                  comment
                                  dietaryRestrictions
                                  acceptedCeremony
                                  acceptedReception
                                }
                              }
                            }
                          }
                        }
                      }
                    `}
                  >
                    {createGuest => (
                      <button
                        className={css(sharedStyles.button)}
                        onClick={() =>
                          createGuest({
                            variables: {
                              familyId:
                                result.data && result.data.currentFamily.id,
                            },
                          })
                        }
                      >
                        Add another guest
                      </button>
                    )}
                  </Mutation>
                </div>
              )}
          </div>
        )}
      </RSVPQuery>
    );
  }
  private checkIfExpired = (e: ApolloError) => {
    // TODO: check error for 403
    if (localStorage.auth) {
      delete localStorage.auth;
      // TODO: just reload the client...
      window.location.reload();
    }
  };
}

const styles = StyleSheet.create({
  rsvp: {
    fontFamily: "Cormorant",
    width: "100%",
  },
  plusOne: {
    marginTop: 24,
  },
});
