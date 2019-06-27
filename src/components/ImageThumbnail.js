import React from 'react';

export default function ImageThumbnail(props) {
  const albumId = props.album;
  const image = props.image;
  const url = `/${albumId}/${image}`;

  function changeToFallbackImage(event) {
    const fallbackUrl = `/${albumId}/${image}`;
    event.target.src = fallbackUrl;
    event.target.onError = null;
  }
  
  return (
    <div className="thumbnail">
      <img 
      src={url} 
      alt={image} 
      onError={changeToFallbackImage} />
    </div>
  );
}