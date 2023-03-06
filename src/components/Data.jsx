import React, { useState, useEffect } from "react";
import Search from "./Search";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import * as ENV from "../helper/env.js";
import {
  fetchData,
  getMediaCategory,
  getRankingData,
  handleQuery,
} from "../helper/helper";

function Data() {
  // ------------ STATE VARIABLES ------------
  const [authToken, setAuthToken] = useState("");
  const [query, setQuery] = useState("");
  const [queryData, setQueryData] = useState([]);
  const [userChosenCategory, setUserChosenCategory] = useState("all");

  // ------------ STATE SETTER ------------
  // Set authToken @ first load
  useEffect(() => {
    getToken();
  }, []);

  // Update state of queryData and sort results
  const updateQueryData = function (queryData) {
    document.querySelector(".waitingText").classList.add("d-none");
    // Return and sort queryData
    setQueryData(
      queryData
        // 1. Sort for query relevance
        .sort((a, b) => b.ranking[0] - a.ranking[0])
        // 2. Sort sublist for number of recognized objects and features related to query
        .sort((a, b) => {
          return a.ranking[0] - b.ranking[0] === 1 ||
            a.ranking[0] - b.ranking[0] === 0
            ? b.ranking[1] - a.ranking[1]
            : 0;
        })
        // 3. Sort sublist for number of features recognized on media-object
        .sort((a, b) => {
          return (a.ranking[0] - b.ranking[0] === 1 ||
            a.ranking[0] - b.ranking[0] === 0) &&
            (a.ranking[1] - b.ranking[1] === 1 ||
              a.ranking[1] - b.ranking[1] === 0)
            ? b.ranking[2] - a.ranking[2]
            : 0;
        })
    );
  };

  // ------------ API CALLS ------------
  // returns authToken
  function getToken() {
    fetchData("GET", "/getToken", ENV.AUTHKEY).then((token) => {
      setAuthToken(token);
    });
  }

  // returns a list of mmfg-data for query
  function queryByKeyword(searchTerm, searchByTag) {
    // Hide dashboard container and show waiting text
    document.querySelector(".waitingText").classList.remove("d-none");
    document.querySelector(".startPlaceholder").classList.add("d-none");
    document.querySelector(".tag-group").classList.add("d-none");
    document.querySelector(".grid-results").classList.add("d-none");
    document.querySelector(".grid-related").classList.add("d-none");
    // Check if query was triggered by tags and adjust the search term if necessary
    let search;
    if (searchByTag) {
      search = handleQuery(query + " " + searchTerm).join(" ");
    } else {
      search = handleQuery(searchTerm).join(" ");
    }
    // Reset state
    setQueryData([]);
    // Save current query
    setQuery(search);
    // returns a list of ids matching the query
    fetchData("POST", "/query", authToken, search).then((res) => {
      Promise.all(
        res.map((id, index) => {
          // get list of image-URLs for query ids
          return fetchData("GET", "/preview", authToken, id).then((blob) => {
            // create blobURL from Java-Response entity
            let imageURL = URL.createObjectURL(blob);
            // get additional metadata for query results
            return fetchData("POST", "/getmmfg", authToken, id).then((data) => {
              // get category
              const category = getMediaCategory(data.generalMetadata.fileName);
              // get graph-code for query results
              return fetchData("POST", "/getgc", authToken, id).then((gc) => {
                // Calculate ranking data
                let ranking = getRankingData(search, gc);
                // Save all queried data
                return {
                  id,
                  imageURL,
                  category,
                  data,
                  gc,
                  ranking,
                };
              });
            });
          });
        })
      ).then((queryData) => updateQueryData(queryData));
    });
  }

  // Exclude getSimData and getRecData from queryByKeyword fetch due to performance reasons: Only fetch if needed --> on opening DetailCard

  // returns a list of similar objects ids
  function getSimDataFor(mmfgId) {
    return fetchData("POST", "/getSim", authToken, mmfgId).then((simData) => {
      // Get Ids of similar assets
      const simIds = simData.map((element) => {
        return element.generalMetadata.id;
      });
      const simObjects = simIds.map((simId) => {
        return queryData.find((element) => element.id === simId);
      });
      return simObjects;
    });
  }

  // returns a list of recommended objects ids
  function getRecDataFor(mmfgId) {
    return fetchData("POST", "/getRec", authToken, mmfgId).then((recData) => {
      // Get Ids of rec assets
      const recIds = recData.map((element) => {
        return element.generalMetadata.id;
      });
      const recObjects = recIds.map((recId) => {
        return queryData.find((element) => element.id === recId);
      });
      return recObjects;
    });
  }

  // Optional: returns the whole collection
  // function getCollection() {
  //   fetchData("POST", "/getCollection", authToken).then((res) => {
  //   });
  // };

  return (
    <div>
      <div className="app">
        <Search
          onCategorySelect={setUserChosenCategory}
          onQuery={queryByKeyword}
          onQueryByTag={query}
        />
        <Dashboard
          queryData={queryData}
          query={query}
          userChosenCategory={userChosenCategory}
          onTagSelect={queryByKeyword}
          getSimDataFor={getSimDataFor}
          getRecDataFor={getRecDataFor}
        />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Data;
