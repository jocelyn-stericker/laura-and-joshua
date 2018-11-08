import { css, StyleSheet } from "aphrodite";
import * as React from "react";

export default class Home extends React.Component {
  public render() {
    return (
      <div className={css(styles.details)}>
        <div className={css(styles.left)}>
          <div>
            <h1 className={css(styles.heading)}>When</h1>
            <h2 className={css(styles.heading)}>Date</h2>
            January 26th, 2019
            <h2 className={css(styles.heading)}>Schedule</h2>
            1:30 pm - Ceremony <br />
            After ceremony - Light refreshments <br />
            5:30 pm - Reception
          </div>
          <div className={css(styles.washiHorizontal)} />
          <div>
            <h1 className={css(styles.heading)}>Where</h1>
            Richview Baptist Church <br />
            15484 Kipling Ave. <br />
            Etobicoke, ON Canada <br />
            <h2 className={css(styles.heading)}>Airport</h2>
            Our venue is a 10 minute drive from Pearson International Airport
            (YYZ). <br />
            <h2 className={css(styles.heading)}>Hotel</h2>
            We do not have a block booking for a hotel, however, there are many
            hotels near the airport to choose from. We recommend{" "}
            <a href="https:/www.ihg.com/holidayinn/hotels/us/en/toronto/yyzae/hoteldetail">
              Holiday Inn Toronto-Airport East
            </a>
          </div>
        </div>
        <div className={css(styles.washiPreview)} />
        <div className={css(styles.right)}>
          <h1 className={css(styles.heading)}>Contact Us</h1>
          Laura: laurastericker@gmail.com <br />
          Joshua: joshua@nettek.ca <br />
          Darlene Stericker: darlenestericker@gmail.com
          <h2 className={css(styles.heading)}>Address</h2>
          After December 28th, our address will be <br />
          1207-4 Willow Street <br />
          Waterloo, Ontario <br />
          N2J 4S3
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  details: {
    fontFamily: "Cormorant",
    display: "flex",
    width: "100%",
  },
  left: {
    flex: 2,
    margin: 20,
  },
  right: {
    flex: 1,
    margin: 20,
  },
  heading: {
    fontFamily: "Tangerine",
  },
  washiPreview: {
    width: 40,
    height: "100%",
    background: "url(washi_1.svg)",
    backgroundSize: "contain",
  },
  washiHorizontal: {
    width: "100%",
    height: 50,
    background: "url(washi_2.svg)",
    backgroundSize: "contain",
    margin: 10,
    marginLeft: -5,
  },
});
