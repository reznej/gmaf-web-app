import React, { useEffect } from "react";
import TrophyIcon from "../icons/TrophyIcon";
import BoundingBoxIcon from "../icons/BoundingBoxIcon";
import SearchIcon from "../icons/SearchIcon";
import NodesIcon from "../icons/NodesIcon";
import { getMediaCategory, initBootstrapTooltip } from "../helper/helper";

function InfoContent(props) {
  // Init bootstrap tooltip dependency
  useEffect(() => {
    initBootstrapTooltip();
  }, [props.object]);

  // Define variables
  const query = props.query.split(" ");
  const fileName = props.object.data.generalMetadata.fileName;
  const fileType = getMediaCategory(props.object.data.generalMetadata.fileName);
  const fileExtension = fileName.split(".").pop();
  const queryPosition = props.object.position;
  const queryMatchCount = props.object.ranking[0];
  const queryObjectsCount = props.object.ranking[1];
  const featuresCount = props.object.gc.dictionary.length;
  let relationsCount;
  try {
    relationsCount = props.object.data.nodes[0].childNodes.length;
  } catch (error) {
    relationsCount = 0;
  }
  // Get terms for query-matches
  const queryMatchTerms = query
    .filter((term) => {
      if (props.object.gc.dictionary.includes(term)) {
        return term;
      }
    })
    .map((term, i) => {
      return term[0].toUpperCase() + term.slice(1);
    })
    .join(", ");
  // Get terms for recognized objects
  const recognizedObjectsTerms = query
    .flatMap((term) => {
      let objects = props.object.gc.dictionary.filter((feature) => {
        if (feature.includes(term)) {
          return feature;
        }
        return false;
      });
      return objects;
    })
    .map((term, i) => {
      return term[0].toUpperCase() + term.slice(1);
    })
    .join(", ");

  return (
    <div className="card-body ps-1 px-1 pt-4 mt-1 me-2 bg-light text-start">
      <p className="truncateText-1">
        <b>Filename: </b> {fileName}
      </p>
      <p>
        <b>Filetype: </b> {fileType}, {fileExtension}
      </p>
      <div className="card-group pt-3 pb-0 pt-2">
        <div className="info-tile rounded card border-secondary border border-1 mt-1 pb-0 me-2 mb-0">
          <div
            className="card-body text-center"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={
              queryPosition > 0
                ? `Query-Position: ${queryPosition}`
                : "Query-position N/A"
            }
          >
            <div>
              <TrophyIcon width={"2rem"} height={"2rem"} />
            </div>
            <p className="card-text fw-bold pt-1">
              {queryPosition > 0 ? queryPosition : "-"}
            </p>
          </div>
        </div>
        <div className="info-tile rounded card border-secondary border border-1 mt-1 pb-0 me-2 mb-0">
          <div
            className="card-body text-center"
            data-bs-custom-class="custom-tooltip"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={
              queryMatchCount > 0
                ? `Search Matches: ${queryMatchTerms}`
                : "No matches found related to query"
            }
          >
            <div>
              <SearchIcon />
            </div>
            <p className="card-text fw-bold pt-1">
              {queryMatchCount}/{query.length}
            </p>
          </div>
        </div>
        <div className="info-tile rounded card border-secondary border border-1 mt-1 pb-0 me-2 mb-0">
          <div
            className="card-body text-center"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={
              queryObjectsCount > 0
                ? `Recognized Objects:\n ${recognizedObjectsTerms}`
                : "No objects recognized related to query"
            }
          >
            <div>
              <BoundingBoxIcon />
            </div>
            <p className="card-text fw-bold pt-1">{queryObjectsCount}</p>
          </div>
        </div>
        <div className="info-tile rounded card border-secondary border border-1 mt-1 pb-0 mb-0">
          <div
            className="card-body text-center"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={`Recognized Features: ${featuresCount}\nRecognized Relations: ${relationsCount}`}
          >
            <div>
              <NodesIcon />
            </div>
            <p className="card-text fw-bold pt-1">{featuresCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoContent;
