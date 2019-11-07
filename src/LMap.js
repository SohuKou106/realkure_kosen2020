import React from 'react'
import { Map, Marker, Popup, TileLayer, Rectangle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CameraLogo from './images/camera.png'
import './LMap.css'
import './leaflet-routing-machine.css'
import Routing from './RoutingMachine'
//import '@babel/polyfill';

export class LMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      position: [34.244659, 132.557402], mobile_lat: null, mobile_lng: null,
      rectangle: [[34.194218, 132.495934], [34.265231, 132.651786]]
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
      Merker = <Marker position={[this.state.mobile_lat, this.state.mobile_lng]} icon={mobilePoint}></Marker>
      if (this.props.shoplat != null && this.props.shoplng != null) {
        shopRouting = <Routing map={this.refs.map} from={[this.state.mobile_lat, this.state.mobile_lng]} to={[this.props.shoplat, this.props.shoplng]}></Routing>
      }
      switch (this.props.sightseeing) {
        case 1:
          shopRouting = <div>
              <Routing map={this.refs.map} from={[34.244798, 132.557611]} to={[34.242135,	132.55538]} />
              <Routing map={this.refs.map} from={[34.242135, 132.55538]} to={[34.241212, 132.555849]} />
              <Routing map={this.refs.map} from={[34.241212, 132.555849]} to={[34.241557, 132.557417]} />
              <Routing map={this.refs.map} from={[34.241557, 132.557417]} to={[34.240356, 132.563925]} />
              <Routing map={this.refs.map} from={[34.240356, 132.563925]} to={[34.23694, 132.560114]} />
              <Routing map={this.refs.map} from={[34.23694, 132.560114]} to={[34.23242,	132.56245]} />
              <Routing map={this.refs.map} from={[34.23242,	132.56245]} to={[34.226287,	132.551026]} />
              <Routing map={this.refs.map} from={[34.226287, 132.551026]} to={[34.243057, 132.560435]} />
              <Routing map={this.refs.map} from={[34.243057, 132.560435]} to={[34.243225, 132.558662]} />
            </div>
          break
        case 2:
          shopRouting = <div>
              <Routing map={this.refs.map} from={[34.244798, 132.557611]} to={[34.24346, 132.564575]} />
              <Routing map={this.refs.map} from={[34.24346, 132.564575]} to={[34.244911, 132.562928]} />
              <Routing map={this.refs.map} from={[34.244911, 132.562928]} to={[34.24624, 132.565571]} />
              <Routing map={this.refs.map} from={[34.24624, 132.565571]} to={[34.245107, 132.565012]} />
              <Routing map={this.refs.map} from={[34.245107, 132.565012]} to={[34.24397, 132.564987]} />
              <Routing map={this.refs.map} from={[34.24397, 132.564987]} to={[34.243609, 132.564175]} />
              <Routing map={this.refs.map} from={[34.243609, 132.564175]} to={[34.24346, 132.564575]} />
            </div>
          break
        case 5:
          shopRouting = <div>
              <Routing map={this.refs.map} from={[34.244798, 132.557611]} to={[34.244657, 132.568804]} />
              <Routing map={this.refs.map} from={[34.244657, 132.568804]} to={[34.244015, 132.563857]} />
              <Routing map={this.refs.map} from={[34.244015, 132.563857]} to={[34.243609, 132.564175]} />
              <Routing map={this.refs.map} from={[34.243609, 132.564175]} to={[34.245759, 132.564613]} />
              <Routing map={this.refs.map} from={[34.245759, 132.564613]} to={[34.244779, 132.564183]} />
              <Routing map={this.refs.map} from={[34.244779, 132.564183]} to={[34.244657, 132.568804]} />
            </div>
          break
      }
    }

    return (
      <div id='container'>
        <Map ref='map' center={this.state.position} zoom={15} minZoom={14} maxZoom={18} maxBounds={this.state.rectangle}>
          <TileLayer
            url="tiles/{z}/{x}/{y}.png"
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

export const mobilePoint = new L.Icon({
  iconUrl: require('./assets/mobileIcon.png'),
  iconRetinaUrl: require('./assets/mobileIcon.png'),
  iconAnchor: [10, 10],
  popupAnchor: [0, 10],
  iconSize: [20, 20],
  shadowUrl: './assets/marker-shadow.png',
  shadowSize: [20, 20],
  shadowAnchor: [10, 20],
})