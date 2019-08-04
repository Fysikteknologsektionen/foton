import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/ECarlsson/foton" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://github.com/ECarlsson/foton/blob/master/readme.md#api" target="_blank" rel="noopener noreferrer">API</a>
      </div>
      <div>&copy; {(new Date()).getFullYear()} Fysikteknologsektionen</div>
    </footer>
  );
}