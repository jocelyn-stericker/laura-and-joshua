import { css, StyleSheet } from "aphrodite";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";

import { CANNOT_HOVER, COLORS, SMALL_SCREEN } from "./shared-styles";

export const HEADER_HEIGHT = 112;

export class Header extends React.Component<RouteComponentProps<{}>> {
  public render() {
    const { location } = this.props;
    return (
      <div className={css(styles.headerWrapper)}>
        <div className={css(styles.header)}>
          <div className={css(styles.logo)}>
            <div className={css(styles.lauraAndJoshua)}>Laura &amp; Joshua</div>
            <div className={css(styles.logoSubtext)}>are getting married</div>
          </div>
          <div className={css(styles.spacer)} />
          <div className={css(styles.sections)}>
            <Link
              to="/"
              className={css(
                styles.section,
                location.pathname === "/" && styles.currentSection,
              )}
            >
              Details
            </Link>
            <Link
              to="/rsvp"
              className={css(
                styles.section,
                location.pathname === "/rsvp" && styles.currentSection,
              )}
            >
              RSVP
            </Link>
            <Link
              to="/registry"
              className={css(
                styles.section,
                location.pathname.indexOf("/registry") === 0 &&
                  styles.currentSection,
              )}
            >
              Registry
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);

const styles = StyleSheet.create({
  headerWrapper: {
    color: COLORS.white,
    background: COLORS.lightTeal,
    height: HEADER_HEIGHT,
    [SMALL_SCREEN]: {
      height: "auto",
    },
  },
  header: {
    maxWidth: 1024,
    margin: "0 auto",
    display: "flex",
    [SMALL_SCREEN]: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 16,
    },
  },
  logo: {
    display: "inline-block",
    position: "relative",
    padding: 16,
  },
  lauraAndJoshua: {
    fontFamily: "Tangerine",
    fontSize: 64,
    lineHeight: 0.9,
    [SMALL_SCREEN]: {
      fontSize: 48,
    },
  },
  logoSubtext: {
    fontFamily: "Cormorant",
    fontSize: 24,
    width: "100%",
    textAlign: "center",
    lineHeight: 0.9,
    [SMALL_SCREEN]: {
      fontSize: 18,
    },
  },
  spacer: {
    flex: 1,
    [SMALL_SCREEN]: {
      marginBottom: 8,
    },
  },
  sections: {
    display: "flex",
    paddingRight: 16,
    [SMALL_SCREEN]: {
      width: "calc(100% - 16px)",
      maxWidth: 420,
      marginLeft: "auto",
      marginRight: "auto",
      paddingRight: 0,
    },
  },
  section: {
    width: 120,
    flex: 1,
    textAlign: "center",
    fontFamily: "Cormorant",
    marginTop: "auto",
    marginBottom: "auto",
    fontSize: 24,
    color: COLORS.white,
    textDecoration: "none",
    [CANNOT_HOVER]: {
      textDecoration: "underline",
      paddingTop: 4,
      paddingBottom: 4,
    },
    ":hover": {
      textDecoration: "underline",
    },
    [SMALL_SCREEN]: {
      width: "auto",
    },
  },
  currentSection: {
    cursor: "normal",
    fontWeight: "bold",
    border: "2px solid white",
    // padding: "12px 0",
    borderRadius: 4,
    background: COLORS.white,
    color: COLORS.lightTeal,
    [CANNOT_HOVER]: {
      textDecoration: "none",
    },
    ":hover": {
      cursor: "default",
      textDecoration: "none",
    },
  },
});
