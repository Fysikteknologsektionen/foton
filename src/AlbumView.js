import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AlbumThumbnail from "./components/AlbumThumbnail";

export default function AlbumView() {
  const [state, setState] = useState({ 
    albums: []
  });

  function testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };

  useEffect(() => {
    fetch('/albums')
      .then(res => testForErrors(res))
      .then(data => setState({ albums: data }));
  });

  const sortedAlbums = state.albums.sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <main>
      <div className="wrapper wrapper-albums">
        {sortedAlbums.map(album => (
          <Link to={`/${album.id}`}>
            <AlbumThumbnail {...album} key={album.id} />
          </Link>
        ))}
      </div>
    </main>
  );
}