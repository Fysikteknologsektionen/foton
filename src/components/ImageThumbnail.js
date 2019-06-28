import React from 'react';

export default function ImageThumbnail(props) {
  const albumId = props.album;
  const image = props.image;
  const url = `/files/${albumId}/thumbnails/${image}`;

  function changeToFallbackImage(event) {
    const fallbackUrl = `/files/${albumId}/${image}`;
    event.target.src = fallbackUrl;
    event.target.onError = null;
  }
  
  return (
    <div className="thumbnail">
      <img 
        src={url} 
        alt={image} 
        onError={changeToFallbackImage}
        onClick={props.onClick}
      />
    </div>
  );
}