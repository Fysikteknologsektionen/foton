import React from "react";
import PropTypes from "prop-types";
import "./webcomponents/gallery-img";

class GalleryImg extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    aspectRatio: PropTypes.number
  };

  render() {
    return (
      <gallery-img {...this.props}>
        {this.props.children}
      </gallery-img>
    );
  }
}

export default GalleryImg;
