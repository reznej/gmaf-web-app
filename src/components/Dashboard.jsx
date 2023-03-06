import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import DetailCard from "./DetailCard";
import StartPlaceholder from "../icons/StartPlaceholder";
import TrophyIcon from "../icons/TrophyIcon";
import TextIcon from "../icons/TextIcon";
import AudioIcon from "../icons/AudioIcon";
import VideoIcon from "../icons/VideoIcon";
import { handleQuery } from "../helper/helper";

function Dashboard(props) {
  // ------------ STATE VARIABLES ------------
  const [grid, setGrid] = useState([]);
  const [category, setCategory] = useState("all");
  const [topics, setTopics] = useState([]);
  const [detailCards, setDetailCards] = useState([]);

  // ------------ STATE SETTER ------------
  // Update grid when queryData changes
  useEffect(() => {
    if (props.queryData.length > 0) {
      updateGrid();
    }
  }, [props.queryData, category]);

  // Update category on user-choice
  useEffect(() => {
    updateCategory();
  }, [props.userChosenCategory]);

  // Update topics and DetailCards when grid changes
  useEffect(() => {
    if (grid.length === 2) {
      updateTopics();
    }
    if (grid.length === 2 && detailCards.length > 0) {
      updateDetailCards();
    }
  }, [grid]);

  // Update grid and split queryResults into relevant and non-relevant results
  const updateGrid = function () {
    // Update grid for chosen category
    let grid;
    // Show all media by default
    if (category === "all") {
      grid = props.queryData;
    } else {
      // If user chooses category, filter based on user choice
      grid = props.queryData.filter((element) => {
        // Add element to array if userChosenCategory === elementCategory returns true
        return category === element.category;
      });
    }

    // Differentiate results in hits (any query term appears in features)...
    let search = handleQuery(props.query);
    const hits = grid.filter((element) => {
      const features = element.gc.dictionary;
      // If any of the search terms matches features return true, else return false
      return search.some((term, i) => {
        return features.includes(term);
      });
    });
    // Add current query position to each media-object
    hits.map((element, i) => {
      element.position = i + 1;
    });

    // ...and related results (other media from collection, query-term does not match)
    const related = grid.filter((element) => {
      const features = element.gc.dictionary;
      return !search.some((term, i) => {
        return features.includes(term);
      });
    });

    // Render topics and headings when needed only
    if (hits.length === 0 && related.length === 0) {
      document.querySelector(".tag-group").classList.add("d-none");
      document.querySelector(".grid-results").classList.add("d-none");
      document.querySelector(".grid-related").classList.add("d-none");
    }
    if (hits.length === 0 && related.length > 0) {
      document.querySelector(".tag-group").classList.add("d-none");
      document.querySelector(".grid-results").classList.add("d-none");
    }
    if (hits.length > 0) {
      document.querySelector(".tag-group").classList.remove("d-none");
      document.querySelector(".grid-results").classList.remove("d-none");
    }
    if (related.length > 0) {
      document.querySelector(".grid-related").classList.remove("d-none");
    }

    // Update grid
    setGrid([hits, related]);
  };

  // Update topics for search-exploration
  const updateTopics = function () {
    const queryResults = grid[0];
    // Get all recognized features of query matches
    const features = queryResults.flatMap((element) => {
      return element.gc.dictionary;
    });
    // Count feature appearances - Source: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
    const featurePerCount = features.reduce(
      (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
      new Map()
    );
    // Sort from highest to lowest appearance
    const sortedFeatures = new Map(
      [...featurePerCount].sort((a, b) => b[1] - a[1])
    );
    // Create keys-only array
    let topics = [...sortedFeatures.keys()];
    // Exclude query terms, root-image and objects (cat_1, cat_2 ...) from topics
    const splitQuery = props.query.split(" ").map((str) => str.trim());
    const filteredTopics = topics.filter((tag) => {
      let temp;
      splitQuery.forEach((term, i, array) => {
        temp =
          !tag.includes("root-image") &&
          !tag.includes("root-asset") &&
          !tag.includes(term) &&
          !tag.endsWith(i) &&
          !tag.includes(array[0]) &&
          !tag.includes(array[1]);
      });
      return temp;
    });
    // Set state
    setTopics(filteredTopics);
  };

  // Update state for chosen category
  const updateCategory = function () {
    setCategory(props.userChosenCategory);
  };

  // Update state for DetailCard List
  const updateDetailCards = function (mediaObjectId, options) {
    document.querySelector(".detail-options").classList.remove("d-none");

    // 1. When user add or removes DetailCards
    if (mediaObjectId) {
      //Get media-object for Id
      let mediaObject = props.queryData.find(
        (element) => element.id === mediaObjectId
      );
      //Check if DetailCards array already contains media-object
      if (
        detailCards.some((element) => {
          return element.id === mediaObjectId;
        })
      ) {
        // If yes: Remove
        const reducedArray = detailCards.filter((element) => {
          return element.id !== mediaObjectId;
        });
        if (reducedArray.length === 0) {
          document.querySelector(".detail-options").classList.add("d-none");
        }
        setDetailCards([...reducedArray]);
      }
      // Else: Add object
      else {
        // Get data for similar and recommended media objects
        Promise.all([
          props.getSimDataFor(mediaObjectId),
          props.getRecDataFor(mediaObjectId),
        ]).then((res) => {
          mediaObject = {
            ...mediaObject,
            simData: res[0],
            recData: res[1],
          };
          // Add object and sort from newest to oldest entry
          setDetailCards((prevObjects) => {
            return [...prevObjects, mediaObject];
          });
        });
      }
      // 2. When user triggers sort
    } else if (options === "sort") {
      // Sort undefined at the end
      setDetailCards(
        [...detailCards].sort((a, b) => {
          if (b.position === undefined) {
            return 1;
          } else if (a.position === undefined) {
            return -1;
          } else {
            return b.position - a.position;
          }
        })
      );
      // 3. When user triggers reset of DetailCards
    } else if (options === "clearAll") {
      document.querySelector(".detail-options").classList.add("d-none");
      setDetailCards([]);
      //4. When grid change (new query, category change) triggers DetailCard state refresh
    } else {
      const flatGrid = grid.flatMap((element) => element);

      Promise.all(
        detailCards.map((prevODetailCardObject) => {
          if (
            // Check if current grid includes one of the detailImages shown
            !flatGrid.some((element) => {
              return prevODetailCardObject.id === element.id;
            })
            // If not, keep state (prevObject)
          ) {
            return prevODetailCardObject;
            // Else update the object-state (ranking, position etc.)
          } else {
            const gridObject = flatGrid.find(
              (element) => element.id === prevODetailCardObject.id
            );
            // Async getSim, getRec data
            return props.getSimDataFor(gridObject.id).then((sim) => {
              return props.getRecDataFor(gridObject.id).then((rec) => {
                const updatedGridObject = {
                  ...gridObject,
                  simData: sim,
                  recData: rec,
                };
                return updatedGridObject;
              });
            });
          }
        })
      ).then((updatedDetailCards) => {
        setDetailCards(updatedDetailCards);
      });
    }
  };

  // Change Dashboard opacity based on user-focus (Grid/DetailCards)
  const toggleFocus = function (e) {
    if (e.currentTarget.classList.contains("grid")) {
      document.querySelector(".grid").classList.remove("overlay");
      document.querySelector(".detail").classList.add("overlay");
      document.querySelector(".grid").classList.add("fade-overlay");
      document.querySelector(".detail").classList.remove("fade-overlay");
    } else if (
      e.currentTarget.classList.contains("detail") &&
      detailCards.length !== 0
    ) {
      document.querySelector(".grid").classList.add("overlay");
      document.querySelector(".detail").classList.remove("overlay");
      document.querySelector(".grid").classList.remove("fade-overlay");
      document.querySelector(".detail").classList.add("fade-overlay");
    }
  };

  return (
    <div className="grid-container row">
      <StartPlaceholder />
      <div
        onMouseOver={(e) => {
          toggleFocus(e);
        }}
        className="grid col-6"
      >
        <h4 className="waitingText d-none">👀 Fetching data...</h4>
        <div className="container-fluid">
          <div className="col-12 mb-4 list-group list-group-horizontal tag-group d-none">
            <button
              type="button"
              className="btn btn-light list-group-item list-group list-group-item-action-horizontal list-group-item-light flex-fill rounded-pill me-2 align-items-center tag"
              onClick={(e) => {
                props.onTagSelect(e.target.innerText, true);
              }}
            >
              {topics.length > 0
                ? topics[0][0].toUpperCase() + topics[0].slice(1)
                : null}
            </button>
            <button
              type="button"
              className="btn btn-light list-group-item list-group list-group-item-action-horizontal list-group-item-light flex-fill rounded-pill me-2 align-items-center tag"
              onClick={(e) => {
                props.onTagSelect(e.target.innerText, true);
              }}
            >
              {topics.length > 0
                ? topics[1][0].toUpperCase() + topics[1].slice(1)
                : null}
            </button>
            <button
              type="button"
              className="btn btn-light list-group-item list-group list-group-item-action-horizontal list-group-item-light flex-fill rounded-pill me-2 align-items-center tag"
              onClick={(e) => {
                props.onTagSelect(e.target.innerText, true);
              }}
            >
              {topics.length > 0
                ? topics[2][0].toUpperCase() + topics[2].slice(1)
                : null}
            </button>
            <button
              type="button"
              className="btn btn-light list-group-item list-group list-group-item-action-horizontal list-group-item-light flex-fill rounded-pill me-2 align-items-center tag"
              onClick={(e) => {
                props.onTagSelect(e.target.innerText, true);
              }}
            >
              {topics.length > 0
                ? topics[3][0].toUpperCase() + topics[3].slice(1)
                : null}
            </button>
            <button
              type="button"
              className="btn btn-light list-group-item list-group list-group-item-action-horizontal list-group-item-light flex-fill rounded-pill align-items-center tag"
              onClick={(e) => {
                props.onTagSelect(e.target.innerText, true);
              }}
            >
              {topics.length > 0
                ? topics[4][0].toUpperCase() + topics[4].slice(1)
                : null}
            </button>
          </div>
          <div className="grid-results row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 gy-0 gx-3 rounded-4 mb-2 pb-4 pt-1 px-1">
            {grid.length ? (
              grid[0].map((element, i) => (
                <div
                  key={i}
                  onClick={() => {
                    updateDetailCards(element.id);
                  }}
                  className="card"
                >
                  {element.category === "text" ? (
                    <div className="d-flex img justify-content-center align-items-center img boxShadowLight rounded-4">
                      <TextIcon />
                    </div>
                  ) : element.category === "audio" ? (
                    <div className="d-flex img justify-content-center align-items-center img boxShadowLight rounded-4">
                      <AudioIcon />
                    </div>
                  ) : element.category === "video" ? (
                    <div className="d-flex img justify-content-center align-items-center img boxShadowLight rounded-4">
                      <VideoIcon />
                    </div>
                  ) : (
                    <img
                      className="img boxShadowLight rounded-4"
                      src={element.imageURL}
                      alt=""
                    ></img>
                  )}
                  <div className="card-img-overlay mx-2 rounded-4 d-flex align-items-center justify-content-center">
                    <p className="px-1 truncateText-3">
                      {element.data.generalMetadata.fileName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
          {/* Related  */}
          <div className="grid-related d-none">
            <h3 className="relatedMediaHeading pb-1">Related Media</h3>
            <div className="row row-cols-1 row-cols-md-4 row-cols-xl-6 gy-0 gx-3  pt-1 px-1">
              {grid.length ? (
                grid[1].map((element, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      updateDetailCards(element.id);
                    }}
                    className="card"
                  >
                    {element.category === "text" ? (
                      <div className="d-flex img justify-content-center align-items-center img boxShadowLight rounded-4">
                        <TextIcon />
                      </div>
                    ) : element.category === "audio" ? (
                      <div className="d-flex img justify-content-center align-items-center img boxShadowLight rounded-4">
                        <AudioIcon />
                      </div>
                    ) : element.category === "video" ? (
                      <div className="d-flex img justify-content-center align-items-center img boxShadowLight rounded-4 px-2">
                        <VideoIcon />
                      </div>
                    ) : (
                      <img
                        className="img boxShadowLight rounded-4"
                        src={element.imageURL}
                        alt=""
                      ></img>
                    )}
                    <div className="card-img-overlay mx-2 rounded-4 d-flex align-items-center justify-content-center">
                      <p className="px-1 truncateText-3">
                        {element.data.generalMetadata.fileName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        onMouseOver={(e) => {
          toggleFocus(e);
        }}
        className="detail col-6 border-light border border-2 border-top-0 border-end-0 border-bottom-0"
      >
        <div className="container-fluid">
          <div className="col-12 mb-4 list-group list-group-horizontal justify-content-end px-1 detail-options d-none">
            <button
              type="button"
              className="btn btn-light list-group-item list-group list-group-item-action-horizontal list-group-item-light rounded-3 me-2"
              onClick={(e) => {
                updateDetailCards(undefined, "sort");
              }}
            >
              {" "}
              Sort for
              <div className="d-inline align-text-bottom">
                {" "}
                <TrophyIcon width={"1.2rem"} height={"1.2rem"} />
              </div>
            </button>
            <button
              type="button"
              className="btn btn-outline-danger list-group list-group-item list-group-item-danger list-group-item-action-horizontal rounded-3 me-2 px-4"
              onClick={(e) => {
                updateDetailCards(undefined, "clearAll");
              }}
            >
              Clear all
            </button>
          </div>
          {detailCards
            .map((object, i) => {
              return (
                <DetailCard
                  key={i}
                  object={object}
                  query={props.query}
                  onMediaSelect={updateDetailCards}
                  onTagSelect={props.onTagSelect}
                />
              );
            })
            .reverse()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
