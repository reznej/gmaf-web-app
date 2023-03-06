import React from "react";
import AudioIcon from "./AudioIcon";
import VideoIcon from "./VideoIcon";
import ImageIcon from "./ImageIcon";
import TextIcon from "./TextIcon";
import GMAFIcon from "./GMAFIcon";

function StartPlaceholder() {
  return (
    <div className="startPlaceholder container-fluid d-flex align-items-center text-center justify-content-center">
      <div className="col col-12 col-md-8 col-xl-6 col-xxl-4">
        <div className="gmafIcon">
          <GMAFIcon />
        </div>
        <div>
          <ul className="list-group list-group-horizontal d-none d-sm-flex">
            <li className="list-group-item flex-fill bg-light border-end-0 px-xxl-1">
              <AudioIcon />
            </li>
            <li className="list-group-item flex-fill bg-light border-end-0 px-xxl-1">
              <ImageIcon />
            </li>
            <li className="list-group-item flex-fill bg-light border-end-0 px-xxl-1">
              <VideoIcon />
            </li>
            <li className="list-group-item flex-fill bg-light px-xxl-1">
              <TextIcon />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StartPlaceholder;
