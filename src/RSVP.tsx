import { css, StyleSheet } from "aphrodite";
import * as React from "react";

export default class RSVP extends React.Component {
  public render() {
    return (
      <div className={css(styles.rsvp)}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i}>RSVP now!</div>
        ))}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  rsvp: {},
});
