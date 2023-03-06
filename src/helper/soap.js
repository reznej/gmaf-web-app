/* Optional SOAP calls */

/*
import * as ENV from "../env.js";
let authToken;
let queryIds;

// returns authToken
const getAuthToken = function () {
  const body = getBody("getAuthToken", ENV.AUTHKEY);
  fetchData(body, "ui").then((res) => {
    authToken = truncateString(res, "<return>", "</return>");
  });
};

// returns a list of ids as query results
const queryByKeyword = function (query) {
  const body = getBody("queryByKeyword", authToken, query);
  fetchData(body, "ui").then((res) => {
    queryIds = res.split("</return>");
    queryIds.forEach((element, i) => {
      let id = truncateString(element, "<return>");
      // Update array
      queryIds[i] = id;
    });
    // Remove last array-element (some SOAP-Call syntax)
    queryIds.pop();
  });
};

//HELPER FUNCTIONS
function fetchData(xml, endpoint) {
  const headers = new Headers({
    "Content-Type": "text/xml; charset=utf-8",
  });
  let path = endpoint === "api" ? ENV.APIPATH : ENV.UIPATH; //Set proxy in package.json

  return fetch(path, {
    method: "POST",
    headers: headers,
    body: xml,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      return res.text();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function getBody(type, arg0, arg1) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://api.gmaf.swa.de/">
      <soap:Body>
      <gs:${type}>
        <arg0>${arg0}</arg0>
        <arg1>${arg1}</arg1>
      </gs:${type}>
      </soap:Body>
    </soap:Envelope>`;
}

export default getAuthToken;
export { queryByKeyword };
*/
