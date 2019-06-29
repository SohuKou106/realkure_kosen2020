import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CameraLogo from './images/camera.png'
import './LMap.css'

export class LMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      position: [34.244659, 132.557402]
    }
  }
  render () {
    return (
      <div id='container'>
        <Map center={this.state.position} zoom={15} minZoom={14} maxZoom={18}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
        </Map>
        <a href={'/camera'} className='navCamera'><img src={CameraLogo} alt="" className="navCameraImage"></img></a>
      </div>
    )
  }
}