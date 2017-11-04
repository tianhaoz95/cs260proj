import './index.css'
import './styles/pages.min.css'

import * as firebase from 'firebase'

import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

var config = {
  apiKey: "AIzaSyCilF3wuHVm2OIydrURFDxJnEE-uy0u-cU",
  authDomain: "cs260proj.firebaseapp.com",
  databaseURL: "https://cs260proj.firebaseio.com",
  projectId: "cs260proj",
  storageBucket: "cs260proj.appspot.com",
  messagingSenderId: "911039256627"
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
