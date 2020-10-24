import React from 'react'
import classNames from 'classnames'
import './Shop/Shop.css'

export class Schedule extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            nav : [true, false],
            day : 0
        }
    }

    tabTapHandler(e){
        const navCopy = this.state.nav.slice()
        const k = Number(e.currentTarget.getAttribute('nav-num'))
        var day = 0
        for (var i = 0; i < 2; i++){
            if(i === k) {
                navCopy[i] = true
                day = i
            }
            else{
                navCopy[i] = false
            }                        
        }

        this.setState({nav: navCopy, day: day})

        //スケジュール画像を更新
    }

    render(){
        var Day1 = classNames({'shop-Current': this.state.nav[0]}, {'shop-None': !this.state.nav[0]})
        var Day2 = classNames({'shop-Current': this.state.nav[1]}, {'shop-None': !this.state.nav[1]})
        const day = this.state.day + 1

        var pic = './images/' + day + '.png'

        return(
            <div id='container'>
                <div className='shop_Tab'>
                    <div className={Day1} onClick={this.tabTapHandler.bind(this)} nav-num="0">1日目（土）</div>
                    <div className={Day2} onClick={this.tabTapHandler.bind(this)} nav-num="1">2日目（日）</div>
                </div>
                <div className='shop_List'>
                    <img src={pic} className='schedule'/>
                </div>
            </div>
        )
    }
}