import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CameraLogo from './images/camera.png'
import './LMap.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import Routing from './RoutingMachine'
//import '@babel/polyfill';

export class LMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      position: [34.244659, 132.557402], mobile_lat: null, mobile_lng: null
    }
    this.getCurrentPosition = this.getCurrentPosition.bind(this)
    this.mobilePosition = this.mobilePosition.bind(this)
  }

  componentWillMount () {
    if (navigator.geolocation) {
      this.getCurrentPosition();
      setInterval(this.getCurrentPosition, 5000)
    }
    console.log(this.props.shoplat, this.props.shoplng)
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
    //lat = 34.231288
    //lng = 132.603037
    this.setState({mobile_lat: lat, mobile_lng: lng}) 
  }

  render () {
    var Merker, shopRouting
    if (this.state.mobile_lat != null && this.state.mobile_lng != null) {
      Merker = <Marker position={[this.state.mobile_lat, this.state.mobile_lng]}></Marker>
      if (this.props.shoplat != null && this.props.shoplng != null) {
        shopRouting = <Routing map={this.refs.map} from={[this.state.mobile_lat, this.state.mobile_lng]} to={[this.props.shoplat, this.props.shoplng]}></Routing>
      }
    }
    return (
      <div id='container'>
        <Map ref='map' center={this.state.position} zoom={15} minZoom={14} maxZoom={18}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {Merker}
          {shopRouting}
        </Map>
        <a href={'/camera'} className='navCamera'><img src={CameraLogo} alt="" className="navCameraImage"></img></a>
      </div>
    )
  }
}