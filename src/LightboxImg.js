import React from "react";
import PropTypes from "prop-types";
import "./webcomponents/lightbox-img";

class LightboxImg extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    thumbnail: PropTypes.string
  };

  render() {
    return (
      <lightbox-img {...this.props}>
        {this.props.children}
      </lightbox-img>
    );
  }
}

export default LightboxImg;
