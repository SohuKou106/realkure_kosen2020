import {MapLayer, withLeaflet} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'

class RoutingMachine2 extends MapLayer {
  createLeafletElement (props) {
    const {map, data} = this.props;
    console.log(this.props)
    var waypoints = []
    for (var i in data) {
      waypoints.push(L.latLng(data[i][0], data[i][1]))
    }
    var leafletElement = L.Routing.control({
        waypoints: waypoints,
        router: new L.Routing.OSRMv1({
          serviceUrl: 'https://osrm.real-kure.net/route/v1',
        }),
        lineOptions: {
          addWaypoints: false
        },
        plan: new L.Routing.plan(waypoints, {
          createMarker: function (i, wp) {
            return L.marker(wp.latLng, {
              draggable: false
            })
          }
        })
    }).addTo(map.leafletElement);
    return leafletElement.getPlan();;
  }
}

export default withLeaflet(RoutingMachine2);