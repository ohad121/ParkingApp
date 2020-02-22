import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import App from './components/App';

export default (
    <HashRouter history={history}>
     <div>
      <Route path='/' component={App} />
     </div>
    </HashRouter>
);
