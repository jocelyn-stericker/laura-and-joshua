import { css, StyleSheet } from "aphrodite";
import { ApolloClient } from "apollo-boost";
import * as React from "react";

interface Props {
  client: ApolloClient<{}>;
  name: string;
}

export default class Logout extends React.Component<Props> {
  public render() {
    const { name } = this.props;
    return (
      <div className={css(styles.logout)}>
        Hello, {name}.{" "}
        <a href="javascript:void(0)" onClick={this.handleLogout}>
          Sign in as someone else?
        </a>
      </div>
    );
  }
  private handleLogout = () => {
    delete localStorage.auth;
    this.props.client.resetStore();
  };
}

const styles = StyleSheet.create({
  logout: {
    marginBottom: 24,
    textAlign: "center",
    backgroundColor: "#cecece",
    padding: 8,
    borderRadius: 4,
  },
});
