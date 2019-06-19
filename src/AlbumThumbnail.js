import React from 'react';

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
      <div className='album-wrapper'>
        <img className='image-thumbnail' src={url} alt={meta.name} />
        <div className='album-name'>
          {meta.name}
        </div>
        <div className='album-date'>
          {meta.date}
        </div>
      </div>
    );
  }
}

export default AlbumThumbnail;