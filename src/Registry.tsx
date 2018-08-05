import { css, StyleSheet } from "aphrodite";
import * as React from "react";

export default class Home extends React.Component {
  public render() {
    return <div className={css(styles.registry)}>Buy us stuff.</div>;
  }
}

const styles = StyleSheet.create({
  registry: {},
});
