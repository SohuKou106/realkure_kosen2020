import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import './App.css';
import MainLogo from './images/logo.png'
import MapLogo from './images/map.png'
import ShopLogo from './images/shop.png'
import MyPageLogo from './images/mypage.png'
import classNames from 'classnames'
import {LMap} from './LMap'
import {Shop} from './Shop'
import {Camera} from './Camera'

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/camera' component={Camera} />
      </Switch>
    </div>
  </Router>
)

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.bindFunc = this.func.bind(this)
    this.sbindFunc = this.sfunc.bind(this)
    this.bindShopLocate = this.shopLocate.bind(this)
    this.state = {
      nav: 0, navBool: [true, false, false],
      Component: LMap,
      shoplat: null,
      shoplng: null,
      sightseeing: 0
    }
  }
  func (nav) {
    const navCopy = this.state.navBool.slice()
    for (var i = 0; i < 3; i++) {
      if (i == nav) {
        navCopy[i] = true
      } else {
        navCopy[i] = false
      }
    }
    switch (nav) {
      case 0: this.setState({nav: nav, navBool: navCopy, Component: LMap}); break
      case 1: this.setState({nav: nav, navBool: navCopy, Component: Shop}); break
      case 2: this.setState({nav: nav, navBool: navCopy, Component: MyPage}); break
      default: this.setState({nav: nav, navBool: navCopy, Component: LMap}); break
    }
  }
  sfunc (n) {
    this.setState({sightseeing: n, nav: 0, navBool: [true, false, false], Component: LMap})
  }
  shopLocate (lat, lng) {
    this.setState({shoplat: lat, shoplng: lng, Component: LMap, nav: 0, sightseeing: 0})
    this.bindFunc(0)
  }
  render () {
    const {Component} = this.state
    return (
      <div className="App">
        <Header />
        <Component shoplat={this.state.shoplat}
            shoplng={this.state.shoplng}
            shopLocate={this.bindShopLocate}
            sfunc={this.sbindFunc}
            sightseeing={this.state.sightseeing}/>
        <Footer func={this.bindFunc} nav={this.state.navBool}/>
      </div>
    )
  }
}

class Header extends React.Component {
  render () {
    return (
      <header className="App-header">
        <img src={MainLogo} alt="" className="header-logo"></img>
      </header>
    )
  }
}

class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.navTapHandler = this.navTapHandler.bind(this);
  }
  navTapHandler (e) {
    const k = Number(e.currentTarget.getAttribute('nav-num'))
    this.props.func(k)
  }
  render () {
    var navMap = classNames({'current': this.props.nav[0]}, {'none': !this.props.nav[0]})
    var navShop = classNames({'current': this.props.nav[1]}, {'none': !this.props.nav[1]})
    var navMyPage = classNames({'current': this.props.nav[2]}, {'none': !this.props.nav[2]})
    return (
      <footer className="App-footer">
        <div className={navMap} onClick={this.navTapHandler} nav-num="0"><img src={MapLogo} alt="" className="navImage"></img></div>
        <div className={navShop} onClick={this.navTapHandler} nav-num="1"><img src={ShopLogo} alt="" className="navImage"></img></div>
        <div className={navMyPage} onClick={this.navTapHandler} nav-num="2"><img src={MyPageLogo} alt="" className="navImage"></img></div>
      </footer>
    )
  }
}

class MyPage extends React.Component {
  constructor (props) {
    super(props)
    this.sightseeingHandler = this.sightseeingHandler.bind(this);
  }
  sightseeingHandler (n) {
    this.props.sfunc(n)
  }
  render () {
    return (
      <div id='container'>
        <button className='sightseeingBtn' onClick={() => this.sightseeingHandler(1)}>呉市の歴史を巡るコース</button>
        <button className='sightseeingBtn' onClick={() => this.sightseeingHandler(2)}>居酒屋○次会コース（中通り内回り）</button>
        <button className='sightseeingBtn' onClick={() => this.sightseeingHandler(5)}>夜のカフェバー巡りコース</button>
      </div>
    )
  }
}

export default App;