import * as ENV from "./env.js";
import { Tooltip } from "./bootstrap.bundle.min.js";

function fetchData(method, type, arg0, arg1) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  // create path from given params
  const path = [type, arg0, arg1].join("/");

  return fetch(ENV.APIPATH + path, {
    headers: headers,
    method: method,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      // getToken returns as text, images as Blob else json
      if (type === "/preview" && method === "GET") {
        return res.blob();
      } else {
        return type === "/getToken" ? res.text() : res.json();
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function getMediaCategory(filename) {
  const fileExtension = filename.split(".").pop();
  switch (fileExtension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "svg":
      return "image";
    case "txt":
    case "md":
    case "json":
    case "xml":
      return "text";
    case "mp3":
    case "wav":
    case "aac":
      return "audio";
    case "mov":
    case "mp4":
    case "avi":
    case "wmv":
      return "video";
    default:
      console.log("Unknown file extension: " + fileExtension);
  }
}

function getRankingData(query, gc) {
  // Check if query consists of multiple terms separated by comma, plus or space
  let search = handleQuery(query);
  // Count if query-term appears in features
  const features = gc.dictionary;
  const countFeatures = features.length;
  let countQuery = 0;
  let countQueryFeatures = 0;
  search.forEach((term, i) => {
    if (features.includes(term)) countQuery++;
  });

  // Count number of recognized objects and features related to query, e.g. dog_1, dog_2, dog_breed
  features.forEach((tag) => {
    search.forEach((term, i) => {
      if (tag.includes(term)) countQueryFeatures++;
    });
  });

  // return counts;
  return [countQuery, countQueryFeatures, countFeatures];
}

// Check if query consists of multiple terms separated by comma, plus or space
function handleQuery(query) {
  if (query.includes(",")) {
    return query.split(",").map((str) => str.trim().toLowerCase());
  } else if (query.includes("+")) {
    return query.split("+").map((str) => str.trim().toLowerCase());
  } else if (query.includes("&")) {
    return query.split("&").map((str) => str.trim().toLowerCase());
  } else if (query.includes(" ")) {
    return query.split(" ").map((str) => str.trim().toLowerCase());
  } else {
    return [query.toLowerCase()];
  }
}

// Init bootstrap tooltip dependency
function initBootstrapTooltip() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl);
  });
}

// Helper to truncate Strings (SOAP-calls)
function truncateString(string, sliceBefore, sliceAfter) {
  // sliceBefore, sliceAfter are optional parameters
  if (!sliceBefore && !sliceAfter) {
    console.log("There are no parameters set, nothing to slice!");
  } else if (sliceBefore) {
    const tempString = string.slice(
      string.indexOf(sliceBefore) + sliceBefore.length
    );
    // If sliceAfter is set > slice tempString further, else return tempString
    return sliceAfter
      ? tempString.slice(0, tempString.indexOf(sliceAfter))
      : tempString;
  } else if (!sliceBefore) {
    const finalString = string.slice(0, string.indexOf(sliceAfter));
    return finalString;
  }
}

export {
  fetchData,
  getMediaCategory,
  getRankingData,
  handleQuery,
  initBootstrapTooltip,
};
