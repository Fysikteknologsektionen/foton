import React from 'react';

export default function ImageThumbnail(props) {
  
  const albumId = props.album;
  const image = props.image;
  const url = `/files/${albumId}/thumbnails/${image}`;

  /**
   * Changes from thumbnail to fullsize backup image
   * @param {object} event - Error event object
   */
  function changeToFallbackImage(event) {
    const fallbackUrl = `/files/${albumId}/${image}`;
    event.target.onError = null;
    event.target.src = fallbackUrl;
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
