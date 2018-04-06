import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import AppBar from 'material-ui/AppBar'
import Devices from './pages/Devices'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: true }
    }

    render() {
        return (<div className="section">
            <Drawer open={this.state.open}>
                {/*<div className="menu-header">🛠 Dashboard</div>*/}
                <div className="menu-items">
                    <MenuItem>Devices</MenuItem>
                    <MenuItem>User Profile</MenuItem>
                    <MenuItem>Power ManageMent</MenuItem>
                    <MenuItem>Log Out</MenuItem>
                </div>           
            </Drawer>
            <AppBar
                title="Smart Home Automation"
                className="app-bar"
            />
            <div className="content">
                <Devices />
            </div>
        </div>)
    }
}