import React from 'react';

export default function AlbumThumbnail(props) {
  const meta = props;
  const url = `/${meta.id}/${meta.thumbnail}`;
  return (
    <div className='thumbnail thumbnail-album'>
      <img src={url} alt={meta.name} />
      <div className='album-meta'>
        <p className='album-name'>{meta.name}</p>
        <p className='album-date'>{meta.date}</p>
      </div>
    </div>
  );
}