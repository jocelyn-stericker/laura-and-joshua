import { css, StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import * as React from "react";
import { Mutation, Query } from "react-apollo";

import { ApolloClient } from "apollo-boost";
import { COLORS, sharedStyles } from "./shared-styles";

interface State {
  postalCode: string;
  triedSubmitting: boolean;
}

export default class Login extends React.Component<{}, State> {
  public state: State = {
    postalCode: "",
    triedSubmitting: false,
  };

  public render() {
    const { postalCode, triedSubmitting } = this.state;
    const isValidCode = Boolean(postalCode.match(/^(([A-Z]\d){3}|\d{5}$)/));

    return (
      <div className={css(styles.login)}>
        <h1 className={css(sharedStyles.heading)}>Login</h1>
        <form className={css(styles.form)} onSubmit={this.handleSubmit}>
          <label htmlFor="postalCode" className={css(styles.label)}>
            What ZIP or Postal Code was your invitation sent to?{" "}
          </label>
          <input
            className={css(styles.loginInput)}
            id="postalCode"
            value={this.state.postalCode}
            onChange={this.handlePostalCodeChange}
            autoFocus={true}
            placeholder="A1A1A1"
          />
          {isValidCode && (
            <Query
              query={gql`
                query loginPage($postalCode: String!) {
                  lookupFamily(postalCode: $postalCode) {
                    nodes {
                      id
                      postalCode
                      name
                    }
                  }
                }
              `}
              variables={{
                postalCode,
              }}
            >
              {result => {
                if (result.loading) {
                  return <span>Loading, please wait&hellip;</span>;
                }
                if (result.error || !result.data || !result.data.lookupFamily) {
                  return (
                    <span>
                      Sorry, something went wrong. Try again in a few minutes.
                    </span>
                  );
                }
                if (result.data.lookupFamily.nodes.length === 0) {
                  return (
                    <span>
                      Sorry, we can't find you. Please double check your code,
                      or contact us.
                    </span>
                  );
                }
                return (
                  <Mutation
                    mutation={gql`
                      mutation authenticate($postalCode: String!, $id: Int!) {
                        authenticate(
                          input: { postalCode: $postalCode, id: $id }
                        ) {
                          jwtToken
                        }
                      }
                    `}
                    onCompleted={authResult =>
                      this.handleAuth(result.client, authResult)
                    }
                  >
                    {authenticate => (
                      <ul className={css(styles.familyList)}>
                        {result.data.lookupFamily.nodes.map(
                          (node: any, i: number) => (
                            <li key={i}>
                              <button
                                className={css(sharedStyles.buttonLogin)}
                                onClick={() =>
                                  authenticate({
                                    variables: {
                                      postalCode: node.postalCode,
                                      id: node.id,
                                    },
                                  })
                                }
                              >
                                Continue as {node.name}
                              </button>
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                  </Mutation>
                );
              }}
            </Query>
          )}
          {!isValidCode &&
            triedSubmitting && (
              <div>
                Sorry, that code doesn't look right. Please double check it.
              </div>
            )}
        </form>
      </div>
    );
  }

  private handlePostalCodeChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({
      triedSubmitting: false,
      postalCode: ev.target.value
        .replace(/\s/g, "")
        .toUpperCase()
        .slice(0, 6),
    });
  };

  private handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    this.setState({
      triedSubmitting: true,
    });
  };

  private handleAuth = (
    client: ApolloClient<{}>,
    {
      authenticate: { jwtToken },
    }: {
      authenticate: { jwtToken: string };
    },
  ) => {
    // tslint:disable-next-line
    if (!jwtToken) {
      alert("Could not load your profile.");
      return;
    }
    localStorage.auth = `Bearer ${jwtToken}`;
    client.resetStore();
  };
}

const styles = StyleSheet.create({
  login: {},
  familyList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 24,
  },
  label: {
    fontWeight: "bold",
  },
  loginInput: {
    marginTop: 4,
    marginBottom: 24,
    borderRadius: 4,
    height: 18,
    fontSize: 18,
    boxShadow: "none",
    border: `1px solid ${COLORS.plum}`,
    fontFamily: "Cormorant",
    padding: 8,
    resize: "none",
    maxWidth: 100,
  },
});
