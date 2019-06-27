import React from 'react';

export default function AlbumThumbnail(props) {
  const meta = props;
  const url = `/${meta.id}/thumbnails/${meta.thumbnail}`;

  function changeToFallbackImage(event) {
    const fallbackUrl = `/${meta.id}/${meta.thumbnail}`;
    event.target.src = fallbackUrl;
    event.target.onError = null;
  }
  
  return (
    <div className="thumbnail">
      <img 
      src={url} 
      alt={meta.name} 
      onError={changeToFallbackImage} />
      <div className="album-meta">
        <h2 className="name">{meta.name}</h2>
        <p className="date">{meta.date}</p>
      </div>
    </div>
  );
}