import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


ReactDOM.render(<App />, document.getElementById('root'));

if (('serviceWorker' in navigator) && (window.location.pathname === '/macropecas/')) {
  console.log(window.location)
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
    .then(function(){
      console.log('ServiceWorker registered');
    });
  })
}



