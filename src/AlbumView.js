import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlbumThumbnail from './components/AlbumThumbnail';

export default function AlbumView() {
  const [albums, setAlbums] = useState([]);

  function testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };
  
  useEffect(() => {
    fetch('/gallery/albums')
    .then(res => testForErrors(res))
    .then(data => setAlbums(data))
    .catch(error => {
      console.error(error);
    });
  }, []);

  const sortedAlbums = albums.sort((a, b) => {
    return b.order - a.order;
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