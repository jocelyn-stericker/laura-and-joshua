import { StyleDeclaration, StyleSheet } from "aphrodite";

export const COLORS = {
  white: "white",
  lightTeal: "#05878a",
  darkTeal: "#074e67",
  purple: "#5a175d",
  plum: "#67074e",
  gold: "#dd9933",
};

export const SMALL_SCREEN = "@media (max-width: 768px)";
export const CANNOT_HOVER = "@media (hover: none)";

const buttonStyle: StyleDeclaration = {
  fontFamily: "Cormorant",
  fontSize: 16,
  fontWeight: "bold",
  padding: "12px 48px",
  margin: 8,
  borderRadius: 4,
  outline: "none",
  border: `1px solid ${COLORS.gold}`,
  cursor: "pointer",
  ":hover": {
    textDecoration: "underline",
  },
  ":focus": {
    background: COLORS.darkTeal,
  },
  ":active": {
    background: COLORS.darkTeal,
  },
  ":first-of-type": {
    marginLeft: 0,
  },
  ":last-of-type": {
    marginRight: 0,
  },
};

export const sharedStyles = StyleSheet.create({
  button: {
    ...buttonStyle,
    background: COLORS.plum,
    color: COLORS.white,
  },
  buttonLogin: {
    ...buttonStyle,
    padding: "12px",
    background: COLORS.plum,
    color: COLORS.white,
  },
  buttonDisabled: {
    ...buttonStyle,
    background: "grey",
    border: "1px solid grey",
    color: COLORS.white,
    cursor: "not-allowed",
    ":hover": {
      textDecoration: "none",
    },
  },
  heading: {
    marginTop: 0,
  },
});
