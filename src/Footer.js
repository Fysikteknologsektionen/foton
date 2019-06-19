import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <p>
          <a href="https://github.com/ECarlsson/foton" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a> | <a href="https://github.com/ECarlsson/foton/blob/master/readme.md#api" target="_blank" rel="noopener noreferrer">API</a>
        </p>
        <p>© {(new Date()).getFullYear()} Fysikteknologsektionen</p>
      </footer>
    );
  }
}

export default Footer;