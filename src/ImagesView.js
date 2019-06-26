import React, { useState, useEffect } from 'react';

export default function ImageView(props) {
  const [images, setImages] = useState([]);
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
      .then(data => setImages(data));
  });

  const sortedImages = images.sort();

  return (
    <main>
      <div className="images-meta">

      </div>
      <div className="wrapper wrapper-images">
        {sortedImages.map(image => (
          <div className="thumbnail">
            <img src={`/${albumId}/${image}`} key={image} />
          </div>
        ))}
      </div>
      <div className="lightbox">
        
      </div>
    </main>
  );
}