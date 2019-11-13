import React from 'react'
import { Map, Marker, Popup, TileLayer, Rectangle } from 'react-leaflet'
import './leaflet.css'
import CameraLogo from './images/camera.png'
import './LMap.css'
import './leaflet-routing-machine.css'
import Routing from './RoutingMachine'
import Routing2 from './RoutingMachine2'
import noimage from './images/noimage.png'
//import '@babel/polyfill';

export class LMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      position: [34.244659, 132.557402], mobile_lat: null, mobile_lng: null,
      rectangle: [[34.194218, 132.495934], [34.265231, 132.651786]],
      route1: [
        [34.244798, 132.557611],
        [34.242135,	132.55538],
        [34.241212, 132.555849],
        [34.241557, 132.557417],
        [34.240356, 132.563925],
        [34.23694, 132.560114],
        [34.23242, 132.56245],
        [34.226287,	132.551026],
        [34.243057, 132.560435],
        [34.243225, 132.558662]
      ],
      route2: [
        [34.244798, 132.557611],
        [34.24346, 132.564575],
        [34.244911, 132.562928],
        [34.24624, 132.565571],
        [34.245107, 132.565012],
        [34.24397, 132.564987],
        [34.243609, 132.564175],
        [34.24346, 132.564575]
      ],
      route5: [
        [34.244798, 132.557611],
        [34.244657, 132.568804],
        [34.244015, 132.563857],
        [34.243609, 132.564175],
        [34.245759, 132.564613],
        [34.244779, 132.564183],
        [34.244657, 132.568804]
      ]
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
    var Marker1, Marker2, shopRouting
    if (this.state.mobile_lat != null && this.state.mobile_lng != null) {
      Marker1 = <Marker position={[this.state.mobile_lat, this.state.mobile_lng]} icon={mobilePoint}></Marker>
      if (this.props.shoplat != null && this.props.shoplng != null) {
        shopRouting = <Routing map={this.refs.map} from={[this.state.mobile_lat, this.state.mobile_lng]} to={[this.props.shoplat, this.props.shoplng]} sid={this.props.shopId}></Routing>
        const styles = {
          shopImage: {
            margin: '9px',
            width: '20vw',
            height: '20vw',
          },
          shopName: {
            color: 'darkorange',
            fontSize: '5vw',
            textAlign: 'left'
          },
          shopAddress: {
            fontSize: '3vw',
            textAlign: 'left'
          },
          shopIntro: {
            fontSize: '4vw',
            textAlign: 'left',
            margin: '2px'
          }
        }
        Marker2 = <Marker position={[this.props.shoplat, this.props.shoplng]}>
            <Popup>
              <table>
                <tbody>
                <tr>
                  <td>
                    <img src={'./images/stores/' + `${this.props.sid}` + '.jpg'} style={styles.shopImage} onError={e => e.target.src = noimage} />
                  </td>
                  <td>
                    <div style={styles.shopName}>{this.props.sname}</div>
                    <div style={styles.shopAddress}>{this.props.saddress1}{this.props.saddress2}</div>
                    <div style={styles.shopIntro}>{this.props.sintro}</div>
                  </td>
                </tr>
                </tbody>
              </table>
            </Popup>
          </Marker>
      }
      switch (this.props.sightseeing) {
        case 1:
          shopRouting = <Routing2 map={this.refs.map} data={this.state.route1} />
          break
        case 2:
          shopRouting = <Routing2 map={this.refs.map} data={this.state.route2} />
          break
        case 5:
          shopRouting = <Routing2 map={this.refs.map} data={this.state.route5} />
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
          {Marker1}
          {Marker2}
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