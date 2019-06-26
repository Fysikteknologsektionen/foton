import React from "react";
import AlbumThumbnail from "./AlbumThumbnail";
import { Link } from "react-router-dom";
import GalleryGrid from "./GalleryGrid";

class AlbumList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: []
    };
  }

  testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  componentDidMount() {
    fetch("/albums/")
      .then(res => this.testForErrors(res))
      .then(data => this.setState({ albums: data }));
  }

  render() {
    var sortedAlbums = this.state.albums.sort((a, b) => {
      return a.order - b.order;
    });
    //wrapper wrapper-albums
    return (
      <main>
        <GalleryGrid class="wrapper">
          {sortedAlbums.map(album => (
            <Link
              className="undecorated"
              to={`/album/${album.id}`}
              key={album.id}
              slot="image"
            >
              <AlbumThumbnail {...album} key={album.id} />
            </Link>
          ))}
        </GalleryGrid>
      </main>
    );
  }
}

export default AlbumList;
