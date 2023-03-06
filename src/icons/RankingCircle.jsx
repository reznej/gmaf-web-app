// SVG Source: https://codepen.io/hari2609/pen/LmEzOm

// Copyright (c) 2023 by hari (https://codepen.io/hari2609/pen/LmEzOm)
// Fork of an original work SVG Pie Chart (https://codepen.io/robbielane/pen/mVVRWr

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { useState, useEffect } from "react";
import { initBootstrapTooltip } from "../helper/helper";

function RankingCircle(props) {
  const [circleStyle, setCircleStyle] = useState({
    strokeDasharray: "0 100",
    strokeDashoffset: "-75",
  });

  // Update state on query or object update, init bootstrap tooltip dependency
  useEffect(() => {
    updateCircleStyle();
    initBootstrapTooltip();
  }, [props.query, props.object]);

  function calculateRelevance() {
    const queryLength = props.query.split(" ").length;
    const points = props.object.ranking[0];
    return points / queryLength;
  }

  // Update circle depending on result relevance
  function updateCircleStyle() {
    const result = calculateRelevance().toFixed(2);
    setCircleStyle(() => {
      switch (result) {
        case "1.00":
          // Strokearray <dash gap>
          return {
            strokeDasharray: "100 0",
            strokeDashoffset: "-75",
          };
        case "0.67":
          return {
            strokeDasharray: "66 33",
            strokeDashoffset: "-75",
          };
        case "0.50":
          return {
            strokeDasharray: "50 50",
            strokeDashoffset: "-75",
          };
        case "0.33":
          return {
            strokeDasharray: "33 66",
            strokeDashoffset: "-75",
          };
        case "0.25":
          return {
            strokeDasharray: "25 75",
            strokeDashoffset: "-75",
          };
        case "0.20":
          return {
            strokeDasharray: "20 80",
            strokeDashoffset: "-75",
          };
        default:
          return {
            strokeDasharray: "0 100",
            strokeDashoffset: "-75",
          };
      }
    });
  }

  return (
    <div
      data-bs-toggle="tooltip"
      data-bs-placement="bottom"
      title={`Search Relevance: ${
        calculateRelevance().toFixed(2) * 100
      }% for query: ${props.query}`}
      style={{
        width: "3rem",
        filter: "drop-shadow(1px 1.5px 2px rgba(26, 26, 26, 0.5))",
      }}
    >
      <svg
        className="statusCircle filterShadow"
        style={{
          border: "1px solid #393E46",
          background: "transparent",
          borderRadius: "50%",
          fill: "none",
          stroke: "#215176",
          strokeWidth: 33,
        }}
        viewBox="0 0 64 64"
      >
        <circle r="25%" cx="50%" cy="50%" style={circleStyle}></circle>
      </svg>
    </div>
  );
}

export default RankingCircle;
