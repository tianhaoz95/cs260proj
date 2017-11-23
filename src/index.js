import './index.css'
import './styles/pages.min.css'

import * as firebase from 'firebase'

import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import productionConfig from './config/productionConfig'
import developmentConfig from './config/developmentConfig'

var config = null

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    config = developmentConfig
} else {
    config = productionConfig
}

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
