import { css, StyleSheet } from "aphrodite";
import * as React from "react";

export default class Home extends React.Component {
  public render() {
    return (
      <div className={css(styles.details)}>
        <div>
          <div>
            <h1 className={css(styles.heading)}>When</h1>
            <h2 className={css(styles.heading)}>Date</h2>
            January 26th, 2019
            <h2 className={css(styles.heading)}>Schedule</h2>
            1:30 pm - Ceremony <br />
            5:30 pm - Reception
          </div>
          <div className={css(styles.washiHorizontal)} />
          <div>
            <h1 className={css(styles.heading)}>Where</h1>
            Richview Baptist Church <br />
            15484 Kipling Ave. <br />
            Etobicoke, ON Canada <br />
            https://richviewchurch.com/
            <h2 className={css(styles.heading)}>Airport and hotel stuffs</h2>
            Thing thing thing
          </div>
        </div>
        <div className={css(styles.washiPreview)} />
        <div>
          <h1 className={css(styles.heading)}>Contact Us</h1>
          Laura: laurastericker@gmail.com <br />
          Joshua: joshua@nettek.ca <br />
          Darlene Stericker: darlenestericker@gmail.com
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  details: {
    fontFamily: "Cormorant",
    display: "flex",
  },
  heading: {
    fontFamily: "Tangerine",
  },
  washiPreview: {
    width: 40,
    height: 700,
    background: "url(washi_1.svg)",
    backgroundSize: "contain",
  },
  washiHorizontal: {
    width: "90%",
    height: 40,
    background: "url(washi_2.svg)",
    backgroundSize: "contain",
  },
});
