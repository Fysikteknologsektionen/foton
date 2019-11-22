import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ImageThumbnail from './components/ImageThumbnail';
import NotFoundView from './NotFoundView';

export default function ImageView(props) {
  
  const [album, setAlbum] = useState({
    images: []
  });
  const [isAlbumValid, setAlbumValid] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const albumId = props.match.params.albumId;
  const sortedImages = album.images.sort();

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
   * Show lightbox with specific slide
   * @param {String} n - Index of slide to show
   */
  const showSlide = useCallback((n) => {
    // Enable lightbox slides to wrap around
    n = n % sortedImages.length;
    if (n < 0) {
      n += sortedImages.length;
    }
  
    // Disable scrollbars on background elements
    document.body.style.overflowY = 'hidden';
  
    setCurrentSlide(n);
    setLightboxVisible(true);
  }, [sortedImages.length]);

  /**
   * Handle keypresses when lightbox is visible
   * @param {object} e - Event object
   */
  const handleKeyPress = useCallback((e) => {
    if (lightboxVisible) {
      if (e.code === 'ArrowRight') {
        showSlide(currentSlide + 1);
      } else if (e.code === 'ArrowLeft') {
        showSlide(currentSlide - 1);
      } else if (e.code === 'Escape') {
        hideSlide();
      }
    }
  }, [lightboxVisible, currentSlide, showSlide]);

  /**
   * Unregister eventlisteners on cleanup
   */
  const cleanupListeners = useCallback(() => {
    document.removeEventListener('keydown', handleKeyPress, true);
  }, [handleKeyPress]);

  /** 
   * Fetch image data on mount
  */
  useEffect(() => {
    fetch(`/albums/${albumId}`)
      .then(res => testForErrors(res))
      .then(data => setAlbum(data))
      .catch(error => {
        setAlbumValid(true);
        console.error(error);
      });
  }, [albumId]);

  /**
   * Register eventlisteners
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, true);
    
    // Called on unmount
    return () => cleanupListeners();
  }, [cleanupListeners, handleKeyPress]);
  
  /**
   * Called on unmount to ensure scrollbar on page change
   */
  useEffect(() => {
    return () => (document.body.style.overflowY = 'scroll');
  }, [])

  /**
   * Hide lightbox
   */
  function hideSlide() {
    document.body.style.overflowY = 'scroll';
    setLightboxVisible(false);
  }

  return (
    // Check if album is valid
    isAlbumValid ? <NotFoundView /> :
    <main>
      <div className="images-meta">
        <h1 className="name">{album.name}</h1>
        <span className="date">{album.date}</span>
        <span className="author"> | av {album.author}</span>
        <p className="description">{album.description}</p>
      </div>
      <div className="wrapper wrapper-images">
        {sortedImages.map((image, index) => (
          <ImageThumbnail 
            album={album.id} 
            image={image} 
            key={image} 
            onClick={() => {
              showSlide(index);
            }}
          />
        ))}
      </div>
      <div className="back-button">
        <Link to="/">
          &lt; Tillbaka
        </Link>
      </div>

      <div className="lightbox-wrapper" style={{ display: lightboxVisible ? 'block' : 'none' }}>
        <div className="lightbox-head">
         <a 
            href={`/files/${album.id}/${sortedImages[currentSlide]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="lightbox-button lightbox-viewfull">
              &#9974;
            </div>
          </a>
          <div className="lightbox-button lightbox-close" onClick={hideSlide}>
            &#215;
          </div>
        </div>
        <div className="lightbox-main">
          <div
            className="lightbox-button lightbox-arrow lightbox-arrow-left"
            onClick={() => {
              showSlide(currentSlide - 1);
            }}
          >
            &#10094;
          </div>
          <img 
            className="lightbox-image" 
            src={`/files/${album.id}/${sortedImages[currentSlide]}`} 
            alt={sortedImages[currentSlide]}
          />
          <div
            className="lightbox-button lightbox-arrow lightbox-arrow-right"
            onClick={() => {
              showSlide(currentSlide + 1);
            }}
          >
            &#10095;
          </div>
        </div>
      </div>
    </main>
  );
}
