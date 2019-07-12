import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CameraLogo from './images/camera.png'
import './LMap.css'
import '@babel/polyfill';

export class LMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      position: [34.244659, 132.557402], mobile_lat: 0, mobile_lng: 0
    }
    this.getCurrentPosition = this.getCurrentPosition.bind(this)
    this.mobilePosition = this.mobilePosition.bind(this)
  }

  componentWillMount () {
    if (navigator.geolocation) {
      this.getCurrentPosition();
      setInterval(this.getCurrentPosition, 5000)
    }
  }

  componentWillUnmount () {
    clearInterval(this.getCurrentPosition)
    
  }

  getCurrentPosition () {
    navigator.geolocation.getCurrentPosition(
      this.mobilePosition
    )
  }

  mobilePosition (position) {
    var data = position.coords
    var lat = data.latitude
    var lng = data.longitude
    this.setState({mobile_lat: lat, mobile_lng: lng}) 
  }

  render () {
    return (
      <div id='container'>
        <Map center={this.state.position} zoom={15} minZoom={14} maxZoom={18}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[this.state.mobile_lat, this.state.mobile_lng]}></Marker>
        </Map>
        <a href={'/camera'} className='navCamera'><img src={CameraLogo} alt="" className="navCameraImage"></img></a>
      </div>
    )
  }
}