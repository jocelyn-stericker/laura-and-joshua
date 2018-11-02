import { css, StyleSheet } from "aphrodite";
import { ApolloError } from "apollo-boost";
import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import {
  COLORS,
  sharedStyles,
  SMALL_SCREEN,
  TINY_SCREEN,
} from "./shared-styles";

export interface RegistryItemModel {
  id: number;
  name: string;
  costCents: number;
  description: string;
  link: string;
  image: string;
  maxCount: number;
  category: string;
  familyGiftsByGiftId: {
    nodes: Array<{
      id: number;
      familyId: number;
    }>;
  };
}

interface Props {
  familyId: number;
  item: RegistryItemModel;
}

function formatCents(cents: number): string {
  const dollarPart = String(cents).slice(0, -2);
  const centPart = String(cents).slice(-2);
  if (centPart === "00") {
    return `\$${dollarPart}`;
  }
  return `\$${dollarPart}.${centPart}`;
}

export default class RegistryItem extends React.Component<Props> {
  public render() {
    const { item, familyId } = this.props;
    const count = item.familyGiftsByGiftId.nodes.length;
    const haveEnough = count >= item.maxCount;

    const currentFamilyGetting = item.familyGiftsByGiftId.nodes.filter(
      familyGift => familyGift.familyId === familyId,
    );

    return (
      <div className={css(styles.item)}>
        <h2>
          {item.name} ({formatCents(item.costCents)}){" "}
        </h2>
        <div className={css(styles.row)}>
          <img className={css(styles.imgBig)} src={item.image} />
          <div>
            <div className={css(styles.description)}>
              <img className={css(styles.imgSmall)} src={item.image} />
              <div>
                {item.description}{" "}
                {currentFamilyGetting.length === 0 && (
                  <a
                    href={item.link}
                    target="_blank"
                    onClick={this.confirmView}
                  >
                    More&hellip;
                  </a>
                )}
              </div>
            </div>
            {haveEnough &&
              item.maxCount === 1 &&
              currentFamilyGetting.length === 0 && (
                <div className={css(styles.allPurchased)}>
                  Someone has already purchased this gift.
                </div>
              )}
            {haveEnough &&
              item.maxCount !== 1 &&
              currentFamilyGetting.length === 0 && (
                <div className={css(styles.allPurchased)}>
                  All of these gifts have been purchased.
                </div>
              )}
            {currentFamilyGetting.length > 0 && (
              <div>
                <div className={css(styles.allPurchased)}>
                  You are getting this gift.
                </div>
                <ul>
                  <li>
                    <a href={item.link} target="_blank">
                      Purchase online!
                    </a>
                  </li>
                  <li>
                    If you find the same item somewhere else, feel free to buy
                    it there instead.
                  </li>
                  <li>
                    Changed your mind?{" "}
                    <Mutation
                      mutation={gql`
                        mutation undoGetGift($familyGiftId: Int!) {
                          deleteFamilyGiftById(input: { id: $familyGiftId }) {
                            giftByGiftId {
                              id
                              familyGiftsByGiftId {
                                nodes {
                                  familyId
                                  giftId
                                  id
                                }
                              }
                            }
                          }
                        }
                      `}
                      variables={{
                        familyGiftId: currentFamilyGetting[0].id,
                      }}
                    >
                      {undoGetGift => (
                        <a
                          href="javascript:void(0)"
                          onClick={() => undoGetGift()}
                        >
                          Let someone else give this.
                        </a>
                      )}
                    </Mutation>
                  </li>
                </ul>
              </div>
            )}
            {currentFamilyGetting.length === 0 && (
              <div className={css(styles.buttonGroup)}>
                <Mutation
                  variables={{
                    familyId,
                    giftId: item.id,
                  }}
                  mutation={gql`
                    mutation getAGift($familyId: Int!, $giftId: Int!) {
                      createFamilyGift(
                        input: {
                          familyGift: { familyId: $familyId, giftId: $giftId }
                        }
                      ) {
                        giftByGiftId {
                          id
                          familyGiftsByGiftId {
                            nodes {
                              id
                              familyId
                              giftId
                            }
                          }
                        }
                      }
                    }
                  `}
                  onError={(err: ApolloError) => {
                    if (
                      err.graphQLErrors.length === 1 &&
                      err.graphQLErrors[0].message === "too_many_gifts"
                    ) {
                      alert("Someone else is already getting this gift.");
                    } else {
                      alert(
                        "Something went wrong. It's not your fault. Email joshua@nettek.ca. It's probably his fault.",
                      );
                    }
                  }}
                >
                  {buyThisGift => (
                    <button
                      className={css(
                        sharedStyles.button,
                        haveEnough && sharedStyles.buttonDisabled,
                      )}
                      disabled={haveEnough}
                      onClick={() => buyThisGift()}
                    >
                      I will buy this gift
                    </button>
                  )}
                </Mutation>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  private confirmView = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      !confirm(
        "Please remember to click the 'I will buy this gift' button before actually ordering it.",
      )
    ) {
      ev.preventDefault();
    }
  };
}

const styles = StyleSheet.create({
  item: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
    [SMALL_SCREEN]: {
      marginBottom: 8,
    },
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  imgBig: {
    maxWidth: 200,
    alignSelf: "center",
    border: `1px solid ${COLORS.plum}`,
    marginRight: 16,
    [SMALL_SCREEN]: {
      alignSelf: "start",
      width: "100%",
      maxWidth: 128,
    },
    [TINY_SCREEN]: {
      display: "none",
    },
  },
  description: {
    display: "flex",
    flexDirection: "row",
  },
  imgSmall: {
    width: "100%",
    maxWidth: 128,
    alignSelf: "flex-start",
    border: `1px solid ${COLORS.plum}`,
    display: "none",
    [TINY_SCREEN]: {
      display: "block",
      marginRight: 8,
    },
  },
  buttonGroup: {
    marginTop: 32,
  },
  firstButton: {
    marginRight: 16,
  },
  allPurchased: {
    fontWeight: "bold",
    marginTop: 16,
  },
});
