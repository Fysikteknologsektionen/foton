import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlbumThumbnail from './components/AlbumThumbnail';
import NotFoundView from './NotFoundView';
import LoadingIcon from './components/LoadingIcon';

export default function AlbumView() {

  const [isWaitingToRender, setWaitingToRender] = useState(true);
  const [hasEncounteredError, setEncounteredError] = useState(false);
  const [albums, setAlbums] = useState([]);

  /**
   * Test fetch response header for errors
   * @param {object} res 
   */
  function testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };
  
  /** 
   * Fetch image data on mount
   */
  useEffect(() => {
    fetch('/albums')
    .then(res => testForErrors(res))
    .then(data => {
      setAlbums(data);
      setWaitingToRender(false);
    })
    .catch(error => {
      setEncounteredError(true);
      console.error(error);
    });
  }, []);

  /**
   * Scroll to top of window on mount
   */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  /**
   * Sort albums by date
   */
  const sortedAlbums = albums.sort((a, b) => {
    if (a.date < b.date) return 1;
    else if (a.date > b.date) return -1;
    else return 0;
  });
  
  return (
    hasEncounteredError ? <NotFoundView /> :
      isWaitingToRender ? <LoadingIcon /> :
      <main>
        <div className="wrapper wrapper-albums">
          {sortedAlbums.map(album => (
            <Link to={`/album/${album.id}`} key={album.id}>
              <AlbumThumbnail {...album} key={album.id} />
            </Link>
          ))}
        </div>
      </main>
  );
}
