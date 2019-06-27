import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ImageView(props) {
  const [album, setAlbum] = useState({
    images: []
  });
  const albumId = props.match.params.albumId;

  function testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };
  
  useEffect(() => {
    fetch(`/albums/${albumId}`)
    .then(res => testForErrors(res))
    .then(data => setAlbum(data))
    .catch(error => {
      console.error(error);
    });
  }, [albumId]);

  const sortedImages = album.images.sort();
  
  return (
    <main>
      <div className="images-meta">
        <span className="back-button">
          <Link to="/">
            &lt; Tillbaka
          </Link>
        </span>
      </div>
      <div className="wrapper wrapper-images">
        {sortedImages.map(image => (
          <div className="thumbnail">
            <img src={`/${album.id}/${image}`} alt={album.name} key={image} />
          </div>
        ))}
      </div>
      <div className="lightbox">
        
      </div>
    </main>
  );
}