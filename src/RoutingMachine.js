import {MapLayer, withLeaflet} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'

class RoutingMachine extends MapLayer {
  createLeafletElement (props) {
    const {map, from, to} = this.props;
    console.log(this.props)
    var leafletElement = L.Routing.control({
        waypoints: [
            L.latLng(from[0], from[1]),
            L.latLng(to[0], to[1]),
        ]
    }).addTo(map.leafletElement);
    return leafletElement.getPlan();;
  }
}

export default withLeaflet(RoutingMachine);