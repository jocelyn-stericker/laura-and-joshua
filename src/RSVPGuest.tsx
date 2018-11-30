import { css, StyleSheet } from "aphrodite";
import * as React from "react";

import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { COLORS, sharedStyles } from "./shared-styles";

export interface Guest {
  id: number;
  name: string | null;
  email: string | null;
  comment: string | null;
  dietaryRestrictions: string | null;
  acceptedCeremony: boolean | null;
  acceptedReception: boolean | null;
}

interface Props {
  guest: Guest;
  invitedToReception: boolean;
}

interface State {
  name: string | null;
  email: string | null;
  comment: string | null;
  dietaryRestrictions: string | null;
  acceptedCeremony: boolean | null;
  acceptedReception: boolean | null;
}

export default class RSVPGuest extends React.Component<Props, State> {
  public state: State = {
    ...this.props.guest,
  };

  public render() {
    const { invitedToReception } = this.props;
    const { id } = this.props.guest;
    const keyPrefix = `RSVPGuest_${id}`;

    const canUpdate =
      this.state.name !== this.props.guest.name ||
      this.state.email !== this.props.guest.email ||
      this.state.comment !== this.props.guest.comment ||
      this.state.dietaryRestrictions !== this.props.guest.dietaryRestrictions ||
      this.state.acceptedCeremony !== this.props.guest.acceptedCeremony ||
      this.state.acceptedReception !== this.props.guest.acceptedReception;

    const didRespond =
      this.state.acceptedCeremony != null &&
      this.state.acceptedReception != null;

    const hasName = (this.state.name || "").length > 0;

    return (
      <Mutation
        mutation={gql`
          mutation updateGuest(
            $id: Int!
            $name: String
            $email: String
            $comment: String
            $dietaryRestrictions: String
            $acceptedCeremony: Boolean!
            $acceptedReception: Boolean!
          ) {
            updateGuestById(
              input: {
                id: $id
                guestPatch: {
                  name: $name
                  email: $email
                  comment: $comment
                  dietaryRestrictions: $dietaryRestrictions
                  acceptedCeremony: $acceptedCeremony
                  acceptedReception: $acceptedReception
                }
              }
            ) {
              guest {
                id
                name
                email
                comment
                dietaryRestrictions
                acceptedCeremony
                acceptedReception
              }
            }
          }
        `}
        variables={{
          id,
          name: this.state.name,
          email: this.state.email,
          comment: this.state.comment,
          dietaryRestrictions: this.state.dietaryRestrictions,
          acceptedCeremony: this.state.acceptedCeremony,
          acceptedReception: this.state.acceptedReception,
        }}
      >
        {save => (
          <form className={css(styles.form)}>
            <label className={css(styles.label)} htmlFor={`${keyPrefix}_name`}>
              Guest's Name
            </label>
            <div className={css(styles.formRow)}>
              <input
                id={`${keyPrefix}_name`}
                value={this.state.name || ""}
                onChange={ev => this.setState({ name: ev.target.value })}
                className={css(styles.textInput, styles.nameInput)}
              />
            </div>

            <label className={css(styles.label)} htmlFor={`${keyPrefix}_email`}>
              Email &mdash; Recommended
            </label>
            <div>
              We will use your email for running the wedding and sending you
              wedding updates, including pictures.
            </div>
            <div className={css(styles.formRow)}>
              <input
                id={`${keyPrefix}_email`}
                value={this.state.email || ""}
                onChange={ev => this.setState({ email: ev.target.value })}
                className={css(styles.textInput, styles.nameInput)}
              />
            </div>

            <div className={css(styles.label)}>Will you be attending?</div>
            <fieldset className={css(styles.attending)}>
              <div className={css(styles.ceremony)}>
                <input
                  id={`${keyPrefix}_notAttending`}
                  className={css(styles.checkbox)}
                  type="radio"
                  checked={
                    this.state.acceptedCeremony === false &&
                    this.state.acceptedReception === false
                  }
                  onChange={ev =>
                    this.setState({
                      acceptedCeremony: false,
                      acceptedReception: false,
                    })
                  }
                />
                <label htmlFor={`${keyPrefix}_notAttending`}>No, sorry.</label>
              </div>
              <div className={css(styles.ceremony)}>
                <input
                  id={`${keyPrefix}_onlyCeremony`}
                  className={css(styles.checkbox)}
                  type="radio"
                  checked={
                    this.state.acceptedCeremony === true &&
                    this.state.acceptedReception === false
                  }
                  onChange={ev =>
                    this.setState({
                      acceptedCeremony: true,
                      acceptedReception: false,
                    })
                  }
                />
                <label htmlFor={`${keyPrefix}_onlyCeremony`}>
                  {invitedToReception
                    ? "Yes, just the ceremony."
                    : "Yes, I will attend the ceremony."}
                </label>
              </div>
              {invitedToReception && (
                <div className={css(styles.reception)}>
                  <input
                    id={`${keyPrefix}_attending`}
                    className={css(styles.checkbox)}
                    type="radio"
                    checked={
                      this.state.acceptedCeremony === true &&
                      this.state.acceptedReception === true
                    }
                    onChange={ev =>
                      this.setState({
                        acceptedReception: true,
                        acceptedCeremony: true,
                      })
                    }
                  />
                  <label htmlFor={`${keyPrefix}_attending`}>
                    Yes, both the ceremony and reception!
                  </label>
                </div>
              )}
            </fieldset>

            {invitedToReception && (
              <div>
                <label
                  className={css(styles.label)}
                  htmlFor={`${keyPrefix}_diet`}
                >
                  Do you have any dietary restrictions?
                </label>
              </div>
            )}
            {invitedToReception && (
              <textarea
                className={css(styles.textInput)}
                id={`${keyPrefix}_diet`}
                value={this.state.dietaryRestrictions || ""}
                placeholder="All food will be vegetarian. Please let us know about any other dietary restrictions."
                disabled={!this.state.acceptedReception}
                onChange={ev =>
                  this.setState({ dietaryRestrictions: ev.target.value })
                }
              />
            )}
            {(this.state.dietaryRestrictions || "").indexOf("meat") > -1 && (
              <div className={css(styles.meatTroll)}>
                You will have time to find meat between the ceremony and the
                reception.
              </div>
            )}

            {!invitedToReception && <div style={{ height: 16 }} />}

            <div>
              <label
                className={css(styles.label)}
                htmlFor={`${keyPrefix}_comment`}
              >
                Leave a comment?
              </label>
            </div>
            <textarea
              className={css(styles.textInput)}
              id={`${keyPrefix}_comment`}
              value={this.state.comment || ""}
              onChange={ev => this.setState({ comment: ev.target.value })}
            />

            <div>
              {didRespond && hasName && canUpdate && (
                <div>
                  <button
                    onClick={ev => {
                      ev.preventDefault();
                      save();
                    }}
                    className={css(sharedStyles.button)}
                  >
                    RSVP
                  </button>
                  <div>
                    Your changes for this guest aren't saved until you click
                    RSVP.
                  </div>
                </div>
              )}
              {!didRespond && (
                <div>
                  <button
                    disabled={true}
                    className={css(sharedStyles.buttonDisabled)}
                  >
                    RSVP
                  </button>
                  <div>
                    To RSVP, first select whether you will be attending or not.
                  </div>
                </div>
              )}
              {didRespond && !hasName && (
                <div>
                  <button
                    disabled={true}
                    className={css(sharedStyles.buttonDisabled)}
                  >
                    RSVP
                  </button>
                  <div>To RSVP, first enter a name.</div>
                </div>
              )}
              {didRespond && hasName && !canUpdate && (
                <div>
                  <button
                    disabled={true}
                    className={css(sharedStyles.buttonDisabled)}
                  >
                    RSVP
                  </button>
                  <div>All changes saved!</div>
                </div>
              )}
            </div>
          </form>
        )}
      </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    marginLeft: 24,
    marginRight: 24,
    display: "flex",
    flexDirection: "column",
  },
  formRow: {
    display: "flex",
    flexDirection: "row",
  },
  nameInput: {
    maxWidth: 400,
  },
  textInput: {
    flex: 1,
    marginTop: 4,
    marginBottom: 24,
    borderRadius: 4,
    height: 18,
    fontSize: 18,
    boxShadow: "none",
    border: `1px solid ${COLORS.plum}`,
    fontFamily: "Cormorant",
    padding: 8,
    resize: "none",
  },
  attending: {
    border: 0,
    marginLeft: 0,
  },
  checkbox: {
    marginRight: 4,
  },
  ceremony: {
    marginTop: 4,
  },
  reception: {
    marginTop: 4,
    marginBottom: 24,
  },
  meatTroll: {
    marginTop: -20,
    marginBottom: 24,
    color: COLORS.plum,
  },
  label: {
    fontWeight: "bold",
  },
});
