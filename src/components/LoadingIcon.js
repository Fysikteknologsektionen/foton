import React from 'react';
import spinner from './loading.gif';

export default function LoadingIcon() {
  
  return (
    <img 
      className="loading-spinner"
      src={spinner} 
      alt="Loading" 
    />
  );
}