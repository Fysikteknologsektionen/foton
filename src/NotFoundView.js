import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundView() {
  return (
    <div className="not-found">
      <h2>404, sidan kunde inte hittas! <Link to="/">Klicka här för att gå tillbaka till huvudsidan.</Link></h2>
    </div>
  )
}