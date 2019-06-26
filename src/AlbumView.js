import React from 'react';
import { Link } from 'react-router-dom';
import AlbumThumbnail from './components/AlbumThumbnail';

export default function AlbumView(props) {
  const albums = props.albums;

  const sortedAlbums = albums.sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <main>
      <div className="wrapper wrapper-albums">
        {sortedAlbums.map(album => (
          <Link to={`/album/${album.id}`} key={album.id}>
            <AlbumThumbnail {...album} key={album.id} />
          </Link>
        ))}
      </div>
    </main>
  );
}