import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import AlbumView from './AlbumView';
import ImagesView from './ImagesView';
import NotFoundView from './NotFoundView';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  
  return (
    <React.Fragment>
      <Router basename="/">
        <Header />
        <Switch>
          <Route exact path="/" component={AlbumView} />
          <Route path="/album/:albumId" component={ImagesView} />
          <Route component={NotFoundView} />
        </Switch>
        <Footer />
      </Router>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
