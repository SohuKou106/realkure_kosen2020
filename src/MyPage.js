import React from 'react'
import './App.css';
import {l} from './Language'
import request from 'superagent'
import { FavList } from './Favorite/FavList'
import { History} from './History'
import { Side } from 'three';

export var langNum = 0

export class MyPage extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
          radioCheck: [true, false]
      }
      this.props.movePage(this.state)
      //this.sightseeingHandler = this.sightseeingHandler.bind(this);
    }

    componentWillMount(){
        var radio = this.state.radioCheck
        for(var i = 0; i < radio.length ; i++){
            if(i == langNum){
                radio[i] = true
            }
            else{
                radio[i] = false
            }
        }
        this.setState({radioCheck:radio})
    }

    movePage (n) {
        switch(n){
            case 1:
                this.props.movePage({Component: FavList})
                break;
            case 2:
                this.props.movePage({Component: History})
                break;
        }        
    }

    render () {
        const styles = {
            translateRadio: {
              margin: '10px',
              fontSize: '3vw',
            }
          }
            
        return (
            <div id='container'>
                <button className='sightseeingBtn' onClick={() => this.movePage(1)}>{l[langNum].check}</button>
                <button className='sightseeingBtn' onClick={() => this.movePage(2)}>{l[langNum].history}</button>
            </div>
        )
    }
}