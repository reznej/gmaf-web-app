import React from "react";

function FeatureContent(props) {
  function getFeatures() {
    // Get all features and create sub-arrays of size 6
    let allFeatures = [];
    for (let i = 0; i < props.features.length; i += 6) {
      const subArray = props.features.slice(i, i + 6);
      allFeatures.push(subArray);
    }

    // For each sub-array, create sub-arrays of size 2
    return allFeatures.map((size6List, i) => {
      let size2List = [];
      for (let i = 0; i < size6List.length; i += 2) {
        const list = size6List.slice(i, i + 2);
        size2List.push(list);
      }
      // Create bootstrap html for pairs of two
      let html = size2List.map((list, i) => {
        return (
          <div
            key={i}
            className="list-group list-group-horizontal mb-2 mx-xl-3 mx-xxl-5"
          >
            <button
              className="btn btn-outline-secondary btn-sm list-group-item rounded-pill me-2 flex-fill"
              onClick={(e) => {
                props.onTagSelect(e.target.innerText, true);
              }}
            >
              {list[0]}
            </button>
            <button
              className="btn btn-outline-secondary btn-sm list-group-item rounded-pill flex-fill"
              onClick={(e) => {
                props.onTagSelect(e.target.innerText, true);
              }}
            >
              {list[1]}
            </button>
          </div>
        );
      });
      return (
        // The currently shown carousel has class active
        <div
          key={i}
          className={
            i === 0
              ? "carousel-item active px-4 mt-2"
              : "carousel-item px-4 mt-2"
          }
        >
          {html}
        </div>
      );
    });
  }

  return (
    <div className="card-body carousel-card bg-light px-0 pt-4 mt-1 me-2">
      <div
        id={"id" + props.id}
        className="carousel carousel-dark slide"
        data-bs-interval="false"
      >
        <div className="carousel-inner">{getFeatures()}</div>
        <button
          className="carousel-control-prev justify-content-start"
          type="button"
          data-bs-target={"#id" + props.id}
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next justify-content-end me-1"
          type="button"
          data-bs-target={"#id" + props.id}
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default FeatureContent;
