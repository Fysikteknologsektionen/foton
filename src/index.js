import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import AlbumView from './AlbumView';
import ImagesView from './ImagesView';
import NotFoundView from './NotFoundView';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [albums, setAlbums] = useState([]);

  function testForErrors(res) {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };
  
  useEffect(() => {
    fetch('/albums')
    .then(res => testForErrors(res))
    .then(data => setAlbums(data))
    .catch(error => {
      console.error(error);
    })
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" render={(props) => (
           <AlbumView {...props} albums={albums} />
          )}  />
          <Route path="/album/:albumId" render={(props) => (
            <ImagesView {...props} albums={albums} />
          )} />
          <Route component={NotFoundView} />
        </Switch>
        <Footer />
      </Router>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
