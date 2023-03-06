import React, { useState } from "react";
import "./DetailCard.css";
import InfoContent from "./InfoContent";
import FeatureContent from "./FeatureContent";
import SimContent from "./SimContent";
import RecContent from "./RecContent";
import InfoIcon from "../icons/InfoIcon";
import FeaturesIcon from "../icons/FeaturesIcon";
import LinkIcon from "../icons/SimIcon";
import RecIcon from "../icons/RecIcon";
import RankingCircle from "../icons/RankingCircle";
import TextIcon from "../icons/TextIcon";
import AudioIcon from "../icons/AudioIcon";
import VideoIcon from "../icons/VideoIcon";

function DetailCard(props) {
  // ------------ STATE VARIABLES ------------
  const [content, setContent] = useState({
    info: true, // Show Info-Panel as default
    features: false,
    sim: false,
    rec: false,
  });

  // ------------ STATE SETTER ------------
  function updateContent(e) {
    const id = e.currentTarget.id;
    setContent((prevStatus) => {
      return {
        info: false,
        features: false,
        sim: false,
        rec: false,
        [id]: !prevStatus[id],
      };
    });
  }

  const closeDetailCard = function (card) {
    props.onMediaSelect(card);
  };

  return (
    <div className="container-fluid mb-4 py-0">
      <div className="col">
        <div className="card detailCard bg-light boxShadowLight rounded-3">
          <div className="row">
            <div className="detailCardImgContainer rounded-start col-6 col-md-6 col-lg-4 col-xl-4">
              {props.object.category === "text" ? (
                <div className="d-flex justify-content-center align-items-center border-end detailCardImg rounded-start">
                  <TextIcon />
                </div>
              ) : props.object.category === "audio" ? (
                <div className="d-flex justify-content-center align-items-center border-end detailCardImg rounded-start">
                  <AudioIcon />
                </div>
              ) : props.object.category === "video" ? (
                <div className="d-flex justify-content-center align-items-center border-end detailCardImg rounded-start">
                  <VideoIcon />
                </div>
              ) : (
                <img
                  className="detailCardImg rounded-start"
                  src={props.object.imageURL}
                  alt=""
                />
              )}
            </div>
            <div className="detailCardContentContainer col-6 col-md-6 col-lg-8 col-xl-8 ps-1">
              <div className="card bg-light border-0">
                <div className="card-header py-0 px-1 bg-light border-0 me-2">
                  <div className="float-end mt-2">
                    <RankingCircle object={props.object} query={props.query} />
                  </div>
                  {/* Toggles*/}
                  <ul className="float-start list-group list-group-horizontal list-group-flush mt-2">
                    <li className="list-group-item bg-light border border-0 ps-1">
                      <InfoIcon checked={content} onClick={updateContent} />
                    </li>
                    <li className="list-group-item bg-light border border-0">
                      <FeaturesIcon checked={content} onClick={updateContent} />
                    </li>
                    <li className="list-group-item bg-light border border-0">
                      <LinkIcon checked={content} onClick={updateContent} />
                    </li>
                    <li className="list-group-item bg-light border border-0">
                      <RecIcon checked={content} onClick={updateContent} />
                    </li>
                  </ul>
                </div>
                {content.info ? (
                  <InfoContent object={props.object} query={props.query} />
                ) : content.features ? (
                  <FeatureContent
                    onTagSelect={props.onTagSelect}
                    id={props.object.id}
                    features={props.object.gc.dictionary}
                  />
                ) : content.sim ? (
                  <SimContent
                    id={props.object.id}
                    image={props.object.imageURL}
                    simData={props.object.simData}
                    onMediaSelect={props.onMediaSelect}
                  />
                ) : (
                  <RecContent
                    id={props.object.id}
                    image={props.object.imageURL}
                    recData={props.object.recData}
                    onMediaSelect={props.onMediaSelect}
                  />
                )}
              </div>
              <button
                type="button"
                className="closeButton float-end btn btn-outline-danger btn-sm rounded-3"
                onClick={(e) => {
                  e.preventDefault();
                  closeDetailCard(props.object.id);
                }}
              >
                X
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailCard;
