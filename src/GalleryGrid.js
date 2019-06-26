import React from "react";
import "./webcomponents/gallery-grid";

class GalleryGrid extends React.Component {
  render() {
    return <gallery-grid {...this.props}>{this.props.children}</gallery-grid>;
  }
}

export default GalleryGrid;
