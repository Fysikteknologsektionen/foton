import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import logo from './logo.svg';

class Header extends React.Component {
  render() {
    return (
      <header>
        <Router>
          <Link to="/" className="logo"><img src={logo} alt="Foton" /></Link>
        </Router>
        <p>Fysikteknologsektionens fotoförening</p>
      </header>
    );
  }
}

export default Header;