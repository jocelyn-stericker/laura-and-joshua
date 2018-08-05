import { css, StyleSheet } from "aphrodite";
import createBrowserHistory from "history/createBrowserHistory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Router } from "react-router";

import Details from "./Details";
import Header, { HEADER_HEIGHT } from "./Header";
import Registry from "./Registry";
import RSVP from "./RSVP";
import { COLORS } from "./shared-styles";

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
  <Router history={history}>
    <div className={css(styles.page)}>
      <Header />
      <div className={css(styles.content)}>
        <Route exact={true} path="/" component={Details} />
        <Route exact={true} path="/rsvp" component={RSVP} />
        <Route exact={true} path="/registry" component={Registry} />
      </div>
    </div>
  </Router>,

  document.getElementById("root") as HTMLElement,
);
