import React, { useState, useEffect } from "react";
import "./Search.css";
import ReactDOMServer from "react-dom/server";
import AudioIcon from "../icons/AudioIcon";
import CategoryIcon from "../icons/CategoryIcon";
import ImageIcon from "../icons/ImageIcon";
import TextIcon from "../icons/TextIcon";
import VideoIcon from "../icons/VideoIcon";

function Search(props) {
  // ------------ STATE VARIABLES ------------
  const [query, setQuery] = useState("");
  const [categoryIcon, setCategoryIcon] = useState(
    `url("data:image/svg+xml,${encodeURIComponent(
      ReactDOMServer.renderToStaticMarkup(<CategoryIcon />)
    )}")`
  );

  // ------------ STATE SETTER ------------
  // Query by Tag: Update value of search bar for better visibility/explainability
  useEffect(() => {
    setQuery(props.onQueryByTag);
  }, [props.onQueryByTag]);

  // Handle manual input through the user
  const updateQuery = function (e) {
    const value = e.target.value;
    setQuery(value);
  };

  // Send query
  const sendQuery = function (e) {
    e.preventDefault();
    props.onQuery(query);
  };

  // Change category toggle icon
  const updateCategoryIcon = function (e) {
    const sender = e.target.id;
    setCategoryIcon(() => {
      switch (sender) {
        case "image":
          return `url("data:image/svg+xml,${encodeURIComponent(
            ReactDOMServer.renderToStaticMarkup(<ImageIcon />)
          )}")`;
        case "text":
          return `url("data:image/svg+xml,${encodeURIComponent(
            ReactDOMServer.renderToStaticMarkup(<TextIcon />)
          )}")`;
        case "audio":
          return `url("data:image/svg+xml,${encodeURIComponent(
            ReactDOMServer.renderToStaticMarkup(<AudioIcon />)
          )}")`;
        case "video":
          return `url("data:image/svg+xml,${encodeURIComponent(
            ReactDOMServer.renderToStaticMarkup(<VideoIcon />)
          )}")`;
        default:
          return `url("data:image/svg+xml,${encodeURIComponent(
            ReactDOMServer.renderToStaticMarkup(<CategoryIcon />)
          )}")`;
      }
    });
  };

  return (
    <nav className="navbar fixed-top navbar navbar-light bg-light">
      <div className="navbar-brand">
        <img
          className="border border-dark border-1 rounded"
          src={require("../icons/gmaf-logo.png")}
          height="35px"
          width="70px"
          alt="Logo"
        />
      </div>
      <form className="d-flex me-auto w-25" role="search" onSubmit={sendQuery}>
        <input
          className="form-control me-2"
          onChange={updateQuery}
          value={query}
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
      <button
        className="navbar-toggler border border-dark me-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span
          className="navbar-toggler-icon"
          style={{ backgroundImage: categoryIcon }}
        ></span>
      </button>
      <div
        className="collapse collapse-horizontal navbar-collapse"
        id="navbarTogglerDemo01"
      >
        <ul className="navbar-nav ml-auto list-group list-group-horizontal float-end">
          <li
            className="nav-item me-2"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse.show"
          >
            <button
              id="all"
              onClick={(e) => {
                props.onCategorySelect(e.target.id);
                updateCategoryIcon(e);
              }}
              className="categoryButton btn btn-outline-secondary btn-sm"
            >
              All
            </button>
          </li>
          <li
            className="nav-item me-2"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse.show"
          >
            <button
              id="image"
              onClick={(e) => {
                props.onCategorySelect(e.target.id);
                updateCategoryIcon(e);
              }}
              className="categoryButton btn btn-outline-secondary btn-sm"
            >
              Images
            </button>
          </li>
          <li
            className="nav-item me-2"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse.show"
          >
            <button
              id="audio"
              onClick={(e) => {
                props.onCategorySelect(e.target.id);
                updateCategoryIcon(e);
              }}
              className="categoryButton btn btn-outline-secondary btn-sm"
            >
              Audio
            </button>
          </li>
          <li
            className="nav-item me-2"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse.show"
          >
            <button
              id="video"
              onClick={(e) => {
                props.onCategorySelect(e.target.id);
                updateCategoryIcon(e);
              }}
              className="categoryButton btn btn-outline-secondary btn-sm"
            >
              Video
            </button>
          </li>
          <li
            className="nav-item"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse.show"
          >
            <button
              id="text"
              onClick={(e) => {
                props.onCategorySelect(e.target.id);
                updateCategoryIcon(e);
              }}
              className="categoryButton btn btn-outline-secondary btn-sm"
            >
              Docs
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Search;
