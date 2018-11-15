import { css, StyleSheet } from "aphrodite";
import * as React from "react";

import { SMALL_SCREEN } from "./shared-styles";

export default class Home extends React.Component {
  public render() {
    return (
      <div className={css(styles.details)}>
        <div className={css(styles.left)}>
          <div>
            <h1 className={css(styles.heading)}>When</h1>
            We look forward to celebrating with you on{" "}
            <strong>January 26th, 2019</strong>.
            <h2 className={css(styles.heading)}>Schedule</h2>
            The schedule will be as follows:
            <div className={css(styles.schedule)}>
              <div>
                <strong>1:30 pm</strong> &mdash; Ceremony <br />
              </div>
              <div>
                <i>Light refreshments will be provided after the ceremony.</i>
                <br />
                <br />
              </div>
              <div>
                <strong>5:30 pm</strong> &mdash; Reception
              </div>
            </div>
          </div>
          <div className={css(styles.washiHorizontal)} />
          <div>
            <h1 className={css(styles.heading)}>Where</h1>
            Both the ceremony and reception will be held at:
            <div className={css(styles.address)}>
              Richview Baptist Church <br />
              15484 Kipling Ave. <br />
              Etobicoke, ON Canada <br />
            </div>
            <h2 className={css(styles.heading)}>Airport</h2>
            Our venue is a 10 minute drive from Pearson International Airport
            (YYZ). <br />
            <h2 className={css(styles.heading)}>Hotel</h2>
            We do not have a block booking for a hotel, however, there are many
            hotels near the airport to choose from. We recommend{" "}
            <a href="https://www.ihg.com/holidayinn/hotels/us/en/toronto/yyzae/hoteldetail">
              Holiday Inn Toronto-Airport East
            </a>
            .
          </div>
        </div>
        <div className={css(styles.washiVertical)} />
        <div className={css(styles.right)}>
          <h1 className={css(styles.heading)}>Contact Us</h1>
          <div className={css(styles.name)}>Laura Stericker</div>
          <div className={css(styles.email)}>laurastericker@gmail.com</div>
          <div className={css(styles.name)}>Joshua Netterfield</div>
          <div className={css(styles.email)}>joshua@nettek.ca</div>
          <div className={css(styles.name)}>Darlene Stericker</div>
          <div className={css(styles.email)}>darlenestericker@gmail.com</div>
          <h2 className={css(styles.heading)}>Address</h2>
          After December 28th 2018, our address will be: <br />
          <div className={css(styles.address)}>
            1207-4 Willow Street <br />
            Waterloo, Ontario <br />
            N2J 4S3
          </div>
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
    [SMALL_SCREEN]: {
      flexDirection: "column",
    },
  },
  left: {
    flex: 2,
    margin: 20,
    position: "relative",
  },
  right: {
    flex: 1,
    margin: 20,
    minWidth: 256,
    [SMALL_SCREEN]: {
      marginTop: 0,
    },
  },
  heading: {
    fontFamily: "Tangerine",
  },
  washiVertical: {
    width: 40,
    height: "100%",
    background: "url(washi_1.svg)",
    backgroundSize: "contain",
    [SMALL_SCREEN]: {
      width: "calc(100% - 40px)",
      height: 50,
      background: "url(washi_2.svg)",
      backgroundSize: "contain",
      marginLeft: 0,
      marginRight: 0,
      boxSizing: "border-box",
      alignSelf: "center",
    },
  },
  washiHorizontal: {
    width: "calc(100% + 20px)",
    height: 50,
    background: "url(washi_2.svg)",
    backgroundSize: "contain",
    margin: 10,
    marginLeft: -20,
    [SMALL_SCREEN]: {
      width: "100%",
      marginLeft: 0,
    },
  },
  schedule: {
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
  },
  address: {
    fontStyle: "italic",
    marginTop: 16,
    marginLeft: 16,
  },
  name: {
    fontWeight: "bold",
  },
  email: {
    marginBottom: 16,
  },
});
