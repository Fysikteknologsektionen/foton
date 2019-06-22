import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import AlbumList from './AlbumList';
import AlbumDetails from './AlbumDetails';
import Header from './Header';
import Footer from './Footer';
import Page404 from './Page404';

function App() {
    return (
        <React.Fragment>
            <Header />
            <Router>
                <Switch>
                    <Route exact path="/" component={AlbumList} />
                    <Route path="/album/:albumId/" component={AlbumDetails} />
                    <Route path="/album/:albumId/:imageId/" component={ImageDetails} />
                    <Route component={Page404} />
                </Switch>
            </Router>
            <Footer />
        </React.Fragment>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
