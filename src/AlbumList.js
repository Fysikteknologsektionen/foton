import React from 'react';
import AlbumThumbnail from './AlbumThumbnail';

class AlbumList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
    };
  }

  testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  componentDidMount() {
    fetch('/albums/')
    .then(res => this.testForErrors(res))
    .then(data => this.setState({albums: data}));
  }

  render() {
    var sortedAlbums = this.state.albums.sort((a, b) => {
      return a.order - b.order;
    });
    return (
        <main>
          <div className='wrapper wrapper-albums'>
            {sortedAlbums.map(album => (
              <AlbumThumbnail {...album} key={album.id} />
            ))}
          </div>
        </main>
    );
  }
}

export default AlbumList;