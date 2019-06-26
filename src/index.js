import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import AlbumView from './AlbumView';
import ImageView from './ImageView';
import NotFoundView from './NotFoundView';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={AlbumView} />
          <Route path="/:albumId" component={ImageView} />
          <Route component={NotFoundView} />
        </Switch>
        <Footer />
      </Router>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
