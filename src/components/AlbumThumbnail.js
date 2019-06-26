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
        <p className="album-name">{meta.name}</p>
        <p className="album-date">{meta.date}</p>
      </div>
    </div>
  );
}