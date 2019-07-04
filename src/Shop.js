import React from 'react'
import classNames from 'classnames'

export class Shop extends React.Component {
  constructor (props) {
    super(props)
    this.shopTabTapHandler = this.shopTabTapHandler.bind(this);
    this.state = {
      nav: [true, false, false, false, false],
    }
  }
  shopTabTapHandler (e) {
    const navCopy = this.state.nav.slice()
    const k = Number(e.currentTarget.getAttribute('nav-num'))
    for (var i = 0; i < 5; i++) {
      if (i === k) {
        navCopy[i] = true
      } else {
        navCopy[i] = false
      }
    }
    this.setState({nav: navCopy})
  }
  render () {
    var Restaurant = classNames({'shop-current': this.state.nav[0]}, {'shop-none': !this.state.nav[0]})
    var Cafe = classNames({'shop-current': this.state.nav[1]}, {'shop-none': !this.state.nav[1]})
    var Tavern = classNames({'shop-current': this.state.nav[2]}, {'shop-none': !this.state.nav[2]})
    var Hotel = classNames({'shop-current': this.state.nav[3]}, {'shop-none': !this.state.nav[3]})
    var Other = classNames({'shop-current': this.state.nav[4]}, {'shop-none': !this.state.nav[4]})
    const st = {
      borderRight: '2px solid #666'
    }
    return(
      <div id='container'>
        <div className='shopTab'>
          <div className={Restaurant} onClick={this.shopTabTapHandler} nav-num="0" style={st}>食事</div>
          <div className={Cafe} onClick={this.shopTabTapHandler} nav-num="1" style={st}>カフェ</div>
          <div className={Tavern} onClick={this.shopTabTapHandler} nav-num="2" style={st}>居酒屋</div>
          <div className={Hotel} onClick={this.shopTabTapHandler} nav-num="3" style={st}>宿泊</div>
          <div className={Other} onClick={this.shopTabTapHandler} nav-num="4">その他</div>
        </div>
        <div className='shopList'>
        </div>
      </div>
    )
  }
}