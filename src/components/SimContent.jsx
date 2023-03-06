import React from "react";

function SimContent(props) {
  return (
    <div
      className="card-body bg-light ps-1 px-1 pt-4 mt-1 me-3 contentImageContainer"
      style={{ overflow: "auto" }}
    >
      <div className="list-group list-group-horizontal mb-1">
        {props.simData.map((object, i) => {
          return (
            <img
              key={i}
              className="contentImg rounded-3 border border-1 border-dark list-group-item me-2 flex-fill px-0 py-0"
              src={object.imageURL}
              onClick={(e) => {
                props.onMediaSelect(object.id);
              }}
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
}
export default SimContent;
