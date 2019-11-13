import {MapLayer, withLeaflet} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'

class RoutingMachine extends MapLayer {
  createLeafletElement (props) {
    const {map, from, to} = this.props;
    console.log(this.props)
    var waypoints = [
      L.latLng(from[0], from[1]),
      L.latLng(to[0], to[1]),
    ]
    var leafletElement = L.Routing.control({
      waypoints: waypoints,
      router: new L.Routing.OSRMv1({
        serviceUrl: 'https://osrm.real-kure.net/route/v1'
      }),
      lineOptions: {
        addWaypoints: false
      },
      plan: new L.Routing.plan(waypoints, {
        createMarker: function (i, wp) {
          return L.marker(wp.latLng, {
            draggable: false,
            opacity: 0
          })
        }
      })
    }).addTo(map.leafletElement);
    return leafletElement.getPlan();;
  }
}

export default withLeaflet(RoutingMachine);