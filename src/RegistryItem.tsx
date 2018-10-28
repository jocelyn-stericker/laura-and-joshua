import { css, StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { COLORS, sharedStyles } from "./shared-styles";

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
          <img className={css(styles.img)} src={item.image} />
          <div>
            <div>{item.description}</div>
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
              <div className={css(styles.allPurchased)}>
                You are getting this gift. (
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
                    <a href="javascript:void(0)" onClick={() => undoGetGift()}>
                      I changed my mind.
                    </a>
                  )}
                </Mutation>
                )
              </div>
            )}
            <div className={css(styles.buttonGroup)}>
              <a
                href={item.link}
                target="_blank"
                className={css(styles.firstButton)}
                onClick={this.confirmView}
              >
                <button className={css(sharedStyles.button)}>View item</button>
              </a>
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
    marginBottom: 32,
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  img: {
    maxWidth: 200,
    alignSelf: "center",
    border: `1px solid ${COLORS.plum}`,
    marginRight: 16,
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
