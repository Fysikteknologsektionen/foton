import React from "react";
import "./webcomponents/lightbox-modal";

class LightboxModal extends React.Component {
  render() {
    return (
      <lightbox-modal {...this.props}>
        {this.props.children}
      </lightbox-modal>
    );
  }
}

export default LightboxModal;
