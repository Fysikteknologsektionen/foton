import React from 'react';
import LightboxModal from './LightboxModal';
import LightboxImg from './LightboxImg';

class AlbumDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      images: []
    };
  }

  testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  componentDidMount() {
    fetch("/albums/" + this.props.match.params.albumId)
    .then(res => this.testForErrors(res))
    .then(data => this.setState(data));
  }

  render() {
    return (
      <main>
        <LightboxModal>
          {this.state.images.map((image, index) => (
            <LightboxImg src={`/${this.props.match.params.albumId}/${image}`} key={index} />
          ))}
        </LightboxModal>
      </main>
    );
  }
}

export default AlbumDetails;