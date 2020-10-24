import React from 'react'
import {langNum} from './MyPage'
import {l} from './Language'
import './SideBar.css'
import { RGBADepthPacking } from 'three'

export class SideBar extends React.Component{
    constructor(props){
        super(props)
        this.bindCheckBoxChangedHandler = this.checkBoxChangedHandler.bind(this)
        this.state = {

        }
        this.props.state
        this.props.updateCheck(this.state);
    }

    checkBoxChangedHandler(e){
        var num = Number(e.currentTarget.getAttribute("box-num"))
        var checked_Copy = this.props.checked.slice()
        for (var i = 0; i< 5; i++){
            if(i == num){
                checked_Copy[i] = !checked_Copy[i]
            }
            else{
                checked_Copy[i] = checked_Copy[i]
            }
        }
        this.props.updateCheck(checked_Copy)
    }

    render(){
        const styles = {
            list : {
                display: 'flex',
                flexDirection: 'column',
                background : 'rgba(200,200,200,0.5)',
                boxshadow: '2px 2px #555555'
            },
            button : {
                width: '10px',
                heigth: '30px',

            },
            checkBox : {
                fontSize : '40px',
                margin : '20px'
            }
        }

        return(
            <div id='sideBar' className='navSideBar'>
                <div style={styles.list}>
                    <label><input type='checkbox' checked={this.props.checked[0]} style = {styles.checkBox} onClick={this.bindCheckBoxChangedHandler} box-num="0" />{l[langNum].restaurant}</label>
                    <label><input type='checkbox' checked={this.props.checked[1]} style = {styles.checkBox} onClick={this.bindCheckBoxChangedHandler} box-num="1"/>{l[langNum].cafe}</label>
                    <label><input type='checkbox' checked={this.props.checked[2]} style = {styles.checkBox} onClick={this.bindCheckBoxChangedHandler} box-num="2"/>{l[langNum].bar}</label>
                    <label><input type='checkbox' checked={this.props.checked[3]} style = {styles.checkBox} onClick={this.bindCheckBoxChangedHandler} box-num="3"/>{l[langNum].hotel}</label>
                    <label><input type='checkbox' checked={this.props.checked[4]} style = {styles.checkBox} onClick={this.bindCheckBoxChangedHandler} box-num="4"/>{l[langNum].other}</label>                    
                </div>
            </div>
        )
    }
}