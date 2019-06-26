import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import logo from './logo.svg';
import ftek from './ftek.svg';

class Header extends React.Component {
  render() {
    return (
      <header>
        <div className="logo-wrapper">
          <Router>
            <Link to="/" className="logo logo-foton"><img src={logo} alt="Foton" /></Link>
          </Router>
          <a href="https://ftek.se/" target="_blank" rel="noopener noreferrer" className="logo logo-ftek"><img src={ftek} alt="Fysikteknologsektionen" /></a>
        </div>
      </header>
    );
  }
}

export default Header;