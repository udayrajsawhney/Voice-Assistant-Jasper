import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './css/index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

render(<MuiThemeProvider>
    <App />
</MuiThemeProvider>, document.getElementById('root'))
registerServiceWorker()