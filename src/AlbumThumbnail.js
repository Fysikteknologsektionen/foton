import React from 'react';
import GalleryImg from './GalleryImg';

class AlbumThumbnail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {...this.props};
  }

  testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  }
  
  render() {
    const meta = this.state;
    const url = `/${meta.id}/${meta.thumbnail}`;
    return (
      <div className='album'>
        <GalleryImg src={url} alt={meta.name} aspect-ratio='1.5' />
        <div className='album-meta'>
          <p className='album-name'>{meta.name}</p>
          <p className='album-date'>{meta.date}</p>
        </div>
      </div>
    );
  }
}

export default AlbumThumbnail;