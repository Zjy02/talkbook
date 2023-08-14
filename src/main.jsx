import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router
} from "react-router-dom";
// 移动端适配
import 'lib-flexible'
import App from './App'
const root =  document.getElementById('root')
// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  root
)