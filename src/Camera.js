import React from 'react'
import CameraBack from './images/icon-back.png'
import { AFrameRenderer, Marker } from 'react-web-ar'
import './Camera.css'

export class Camera extends React.Component {
  render () {
    return (
      <div id="cam">
        <AFrameRenderer vr-mode-ui="enabled:false;" arToolKit={{ sourceType: 'webcam', debugUIEnabled: false }}>
          <Marker parameters={{ preset: "pattern", type: 'pattern', url: 'pattern-marker.patt' }}>
            <a-entity gltf-model="src: url(./models/1kureshi_banzai.gltf);"
                  animation-mixer="loop: pingpong;"
                  position="0 0.1 0"
                  scale="0.25 0.25 0.25"
                  shadow="receive: false"></a-entity>
            <a-plane position="0 0 0"
                 rotation="-90 0 0"
                 width="2" height="2"
                 color="#fff"
                 shadow="receive: true"></a-plane>
             <a-entity light="type: directional; color: #fff; castShadow:true;"
                  position="-10 10 10"></a-entity>
          </Marker>
        </AFrameRenderer>
        <a href={'/'} className='navCamera'><img src={CameraBack} alt="" className="navCameraImage"></img></a>
      </div>
    )
  }
}