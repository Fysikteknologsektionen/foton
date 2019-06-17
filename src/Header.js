import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <header>
        <Router>
          <Link to="/" className="logo"><div></div></Link>
        </Router>
        <p>Fysikteknologsektionens fotoförening</p>
      </header>
    );
  }
}

export default Header;