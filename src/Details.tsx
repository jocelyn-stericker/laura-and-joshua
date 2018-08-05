import { css, StyleSheet } from "aphrodite";
import * as React from "react";

export default class Home extends React.Component {
  public render() {
    return (
      <div className={css(styles.details)}>
        Here are some details.
        <div className={css(styles.washiPreview)} />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  details: {},
  washiPreview: {
    width: 40,
    height: 700,
    background: "url(washi_1.svg)",
    backgroundSize: "contain",
  },
});
