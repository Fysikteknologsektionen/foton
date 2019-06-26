import React from 'react';

export default function Footer() {
  return (
    <footer>
      <p>
        <a href="https://github.com/ECarlsson/foton" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://github.com/ECarlsson/foton/blob/master/readme.md#api" target="_blank" rel="noopener noreferrer">API</a>
      </p>
      <p>&copy; {(new Date()).getFullYear()} Fysikteknologsektionen</p>
    </footer>
  );
}