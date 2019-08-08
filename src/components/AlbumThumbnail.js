import React from 'react';

export default function AlbumThumbnail(props) {
  const meta = props;
  const image = meta.thumbnail;
  const thumbnail = `${image.substring(0, image.lastIndexOf('.'))}_thumbnail${image.substring(image.lastIndexOf("."))}`;
  const url = `/gallery/files/${meta.id}/thumbnails/${thumbnail}`;

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