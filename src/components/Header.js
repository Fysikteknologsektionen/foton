import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import ftek from './ftek.svg';

export default function Header() {
  
  return (
    <header>
      <div className="logo-wrapper">
        <Link to="/" className="logo logo-foton">
          <img src={logo} alt="Foton" />
        </Link>
        <a
          href="https://ftek.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="logo logo-ftek"
        >
          <img src={ftek} alt="Fysikteknologsektionen" />
        </a>
      </div>
    </header>
  );
}