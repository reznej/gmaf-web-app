// SVG Source: https://icons.getbootstrap.com/

// Copyright (c) 2019-2021 The Bootstrap Authors

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React from "react";

function FeaturesIcon(props) {
  return props.checked.features ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      id="features"
      onClick={(e) => {
        props.onClick(e);
      }}
      className="icon"
      style={{ width: "1.5rem", height: "1.5rem", transform: "scale(1.2)" }}
      fill="#215176"
      viewBox="0 0 16 16"
    >
      <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      id="features"
      onClick={(e) => {
        props.onClick(e);
      }}
      className="icon"
      style={{ width: "1.5rem", height: "1.5rem" }}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
      <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
    </svg>
  );
}

export default FeaturesIcon;
