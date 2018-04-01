import React from 'react'
import Bulb from './images/bulb.jpeg'
import UCard from './components/UCard'
import io from 'socket.io-client'
import './css/devices.css'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      devices: [
        { aid: 0, state: false }
      ],
      duration: [
        {
          aid: 0,
          duration: 0,
          time: new Date().toJSON().substring(10, 19).replace('T', '')
        }
      ]
    }
    this.socket = io.connect('http://192.168.43.179:8080') // rpi    
  }

  componentDidMount() {
    // const devices = await fetch('http://192.168.43.140:4500/devices/')
    // socket.emit('devices', 1)
    // socket.on(devices, devices => this.setState({ devices }))
    const { socket } = this
    socket.emit('server', 'server')
    socket.on('toggle', device => {
      // console.log(device)
      // devices[device.aid]
      this.setState({ devices: { [device.aid]: { state: device.state } } })
      // console.log(this.state.devices)
    })
    socket.on('duration', dur => this.setState({
      duration: {
        [dur.aid]: {
          time: dur.time,
          duration: dur.duration
        }
      }
    }))
  }

  render() {
    // console.log(this.socket)
    const { socket } = this
    return (
      <div className="devices">
        <p className="heading">Devices</p>
        <div className="card-container">
          <UCard ttl="Bulb" sub="Bulb at hall" sce={Bulb} ate="bulb" desc={<div>Time - {this.state.duration[0].time}<br />Duration - {this.state.duration[0].duration}</div>} aid={0} act={_ => {
            socket.emit('toggle', { aid: 0, t: !this.state.devices[0].state })
          }} expanded={this.state.devices[0].state}></UCard>
          <UCard ttl="Bulb" sub="Bulb at hall" sce={Bulb} ate="bulb" desc="bulb status"></UCard>
          <UCard ttl="Bulb" sub="Bulb at hall" sce={Bulb} ate="bulb" desc="bulb status"></UCard>
        </div>  
      </div>
    );
  }
}