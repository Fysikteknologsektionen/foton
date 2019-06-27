import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageThumbnail from './components/ImageThumbnail';

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
        <h1 className="name">{album.name}</h1>
        <span className="date">{album.date}</span>
        <span className="author"> | av {album.author}</span>
        <p className="description">{album.description}</p>
      </div>
      <div className="wrapper wrapper-images">
        {sortedImages.map(image => (
          <ImageThumbnail album={album.id} image={image} />
        ))}
      </div>
      <div className="back-button">
          <Link to="/">
            &lt; Tillbaka
          </Link>
        </div>
      <div className="lightbox">
        
      </div>
    </main>
  );
}