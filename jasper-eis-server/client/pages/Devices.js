import React from 'react'
import Bulb from '../images/bulb.jpg'
import UCard from '../components/UCard'
import io from 'socket.io-client'
import '../css/devices.css'

export default class Devices extends React.Component {
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
      ],
      durtab: [
        {
          aid: 0,
          tab: []
        }
      ]
    }
    this.socket = io.connect('http://192.168.43.178:8080') // rpi
    this.database = io.connect('http://localhost:4500', {
      reconnection: true,
      reconnectionDelay: 10000,
      reconnectionDelayMax : 5000
    }) // for db
  }

  componentDidMount() {
    // const devices = await fetch('http://192.168.43.140:4500/devices/')
    // socket.emit('devices', 1)
    // socket.on(devices, devices => this.setState({ devices }))
    const { socket, database } = this
    socket.emit('server', 'server')
    database.emit('iwant', 'iwant')
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
    database.on('durdat', dat => {
      // console.log('hdhd');
      console.log(dat)
      this.setState({ durtab: { [dat.aid]: { tab: dat.tab } } })
    })
  }

  render() {
    // console.log(this.socket)
    const { socket, database } = this
    return (
      <div className="devices">
        <p className="heading">Appliances</p>
        <div className="card-container">
          <UCard sce={Bulb} ate="bulb" desc={<div>Time - {this.state.duration[0].time}<br />Duration - {this.state.duration[0].duration}</div>} aid={0} act={_ => {
            socket.emit('toggle', { aid: 0, t: !this.state.devices[0].state })
          }} expanded={this.state.devices[0].state}
            reqData={_ => database.emit('durreq', { aid: 0 })}
            tabp={this.state.durtab[0].tab}
          ></UCard>
          <UCard sce={Bulb} ate="bulb" desc="bulb status"></UCard>
          <UCard sce={Bulb} ate="bulb" desc="bulb status"></UCard>
        </div>  
      </div>
    );
  }
}