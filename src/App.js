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
    this.state = {
      nav: 0,
      Component: LMap
    }
  }
  func (nav) {
    switch (nav) {
      case 0: this.setState({Component: LMap}); break
      case 1: this.setState({Component: Shop}); break
      case 2: this.setState({Component: MyPage}); break
      default: this.setState({Component: LMap}); break
    }
  }
  render () {
    const {Component} = this.state
    return (
      <div className="App">
        <Header />
        <Component />
        <Footer func={this.bindFunc}/>
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
    this.state = {
      nav: [true, false, false],
    }
  }
  navTapHandler (e) {
    const navCopy = this.state.nav.slice()
    const k = Number(e.currentTarget.getAttribute('nav-num'))
    for (var i = 0; i < 3; i++) {
      if (i === k) {
        navCopy[i] = true
        this.props.func(i);
      } else {
        navCopy[i] = false
      }
    }
    this.setState({nav: navCopy})
  }
  render () {
    var navMap = classNames({'current': this.state.nav[0]}, {'none': !this.state.nav[0]})
    var navShop = classNames({'current': this.state.nav[1]}, {'none': !this.state.nav[1]})
    var navMyPage = classNames({'current': this.state.nav[2]}, {'none': !this.state.nav[2]})
    return (
      <footer className="App-footer">
        <div className={navMap} onClick={this.navTapHandler} nav-num="0"><img src={MapLogo} alt="" className="navImage"></img></div>
        <div className={navShop} onClick={this.navTapHandler} nav-num="1"><img src={ShopLogo} alt="" className="navImage"></img></div>
        <div className={navMyPage} onClick={this.navTapHandler} nav-num="2"><img src={MyPageLogo} alt="" className="navImage"></img></div>
      </footer>
    )
  }
}

const Shop = () => (
  <div id='container'></div>
)

const MyPage = () => (
  <div id='container'></div>
)

export default App;