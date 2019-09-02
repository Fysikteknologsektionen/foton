import React from 'react';

export default function AlbumThumbnail(props) {
  const meta = props;
  const image = meta.thumbnail;
  const url = `/gallery/files/${meta.id}/thumbnails/${image}`;

  function changeToFallbackImage(event) {
    const fallbackUrl = `/gallery/files/${meta.id}/${image}`;
    event.target.onError = null;
    event.target.src = fallbackUrl;
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