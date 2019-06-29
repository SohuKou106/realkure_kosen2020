import React from 'react'
import CameraLogo from './images/camera.png'
import { AFrameRenderer, Marker } from 'react-web-ar'
import './Camera.css'

export class Camera extends React.Component {
  render () {
    return (
      <div id="cam">
        <AFrameRenderer vr-mode-ui="enabled:false;" arToolKit={{ sourceType: 'webcam', debugUIEnabled: false }}>
          <Marker parameters={{ preset: "pattern", type: 'pattern', url: 'pattern-marker.patt' }}>
            <a-box color="red" position="0 0 0" scale="0.3 0.6 0.3">
              <a-animation
                attribute="rotation"
                to="360 360 0"
                dur="2000"
                easing="linear"
                repeat="indefinite"
              />
              
            </a-box>
          </Marker>
        </AFrameRenderer>
        <a href={'/'} className='navCamera'><img src={CameraLogo} alt="" className="navCameraImage"></img></a>
      </div>
    )
  }
}