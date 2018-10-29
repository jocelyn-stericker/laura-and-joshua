import { css, StyleSheet } from "aphrodite";
import ApolloClient from "apollo-boost";
import createBrowserHistory from "history/createBrowserHistory";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import { Route, Router } from "react-router";

import Details from "./Details";
import Header, { HEADER_HEIGHT } from "./Header";
import Registry from "./Registry";
import RSVP from "./RSVP";
import { COLORS } from "./shared-styles";

const graphqlClient = new ApolloClient({
  uri: "https://api.laura-joshua.site/graphql",
  request: operation => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      operation.setContext({
        headers: {
          Authorization: auth,
        },
      });
    }

    return Promise.resolve();
  },
});

const history = createBrowserHistory();

const styles = StyleSheet.create({
  page: {
    width: "100%",
    minHeight: "100%",
    position: "absolute",
    background: COLORS.lightTeal,
  },
  content: {
    maxWidth: 1024 - 16 * 2,
    margin: "0 auto",
    padding: 16,
    background: COLORS.white,
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px - 16px * 4)`,
    marginBottom: 32,
  },
});

ReactDOM.render(
  <ApolloProvider client={graphqlClient}>
    <Router history={history}>
      <div className={css(styles.page)}>
        <Header />
        <div className={css(styles.content)}>
          <Route exact={true} path="/" component={Details} />
          <Route exact={true} path="/rsvp" component={RSVP} />
          <Route exact={true} path="/registry" component={Registry} />
        </div>
      </div>
    </Router>
  </ApolloProvider>,

  document.getElementById("root") as HTMLElement,
);
