import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.scss'

// Have to export and create element to be able to test
const app = ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root') || document.createElement('div')
)

registerServiceWorker()

export default app
