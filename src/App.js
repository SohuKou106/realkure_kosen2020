import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import Cookies from 'js-cookie'
import './App.css';
import MainLogo from './images/newlogo_.png'
import MapLogo from './images/map.png'
import ShopLogo from './images/shop.png'
import MyPageLogo from './images/mypage.png'
import classNames from 'classnames'
import {LMap} from './LMap'
import {Shop} from './Shop/Shop'
import {Schedule} from './Schedule'
import {BeforePage, LMapStatus, ShopData} from './Utilities'
import ReactGA from 'react-ga';

//URLの状態によってホームかカメラかを分ける
const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </div>
  </Router>
)

//**************************
//メイン画面
//**************************
class Home extends React.Component {
  constructor (props) {
    super(props)
    this.bindFunc = this.func.bind(this)
    this.sbindFunc = this.sfunc.bind(this)
    this.bindShopLocate = this.shopLocate.bind(this)
    this.state = {
      nav: 0, navBool: [true, false, false],
      Component: LMap,
      shop_data: {
        lat: null,
        lng: null,
        genre: null,
        sid: null,
        sname: null,
        saddress1: null,
        saddress2: null,
        sintro: null,
        stag1: null,
        stag2: null,
        stag3: null,
        sweek: null,
        sholi: null,
        sreg_holi: null,     
      },
      sightseeing: 0,
      checked: [true, true, true, true, true],
      mapStatus: new LMapStatus([34.232009, 132.602588], 19, [true, true, true, true, true]),
      before_page : new BeforePage(null, this.movePage.bind(this)),
      search_res: [],
    }
  }

  componentDidMount(){
    const {pathname} = this.props.location;
    ReactGA.set({page:pathname});
    ReactGA.pageview(pathname);
  }

  //**** タブ（フッター）クリック時 ****
  func (nav) {
    const navCopy = this.state.navBool.slice()
    //-1:お店の情報をタップしてLMapを表示する場合（ポップアップを自動で表示させる）
    if(nav === -1){
      navCopy[0] = true; navCopy[1] = false; navCopy[2] = false;
    }
    else{
      for (var i = 0; i < 3; i++) {
        if (i == nav) {
          navCopy[i] = true
        } else {
          navCopy[i] = false
        }
      }
    }
    switch (nav) {
      case -1: this.setState({nav: 0, navBool: navCopy, Component: LMap}); break
      case 0: this.setState({shop_data:{lat:null, lng:null, genre:null, sid:null, sname:null,
                             saddress1: null, saddress2:null, sintro:null,
                             stag1: null, stag2: null, stag3: null, sweek: null,
                             sholi: null, sreg_holi: null,},
                            nav: nav, navBool: navCopy, Component: LMap}); break     
      case 1: this.setState({nav: nav, navBool: navCopy, Component: Shop}); break
      case 2: this.setState({nav: nav, navBool: navCopy, Component: Schedule}); break
      default: this.setState({nav: nav, navBool: navCopy, Component: LMap}); break
    }
  }

  //**** 観光ルート表示時 ****
  sfunc (n) {
    this.setState({sightseeing: n, nav: 0, navBool: [true, false, false], Component: LMap})
  }

  //**** お店の位置を地図上に表示 ****
  shopLocate(shop_data){
    this.setState({shop_data: shop_data, Component: LMap, nav: 0, sightseeing: 0})    
    this.bindFunc(-1)
  }

  //ページ遷移
  movePage (state) {
    this.setState(state)
  }



  render () {  
    const {Component} = this.state
    return (
      <div className="App">
        <Header />
         <Component            
            shop_data={this.state.shop_data}
            shopLocate={this.bindShopLocate}
            sfunc={this.sbindFunc}
            sightseeing={this.state.sightseeing}
            shopLocate={this.shopLocate.bind(this)}
            checked={this.state.checked}
            favId={this.state.favId}
            mapStatus={this.state.mapStatus}
            before_page={this.state.before_page}
            movePage={this.movePage.bind(this)}
            search_res={this.state.search_res}/>
        <Footer func={this.bindFunc} nav={this.state.navBool}/>
      </div>
    )    
  }
}

//**************************
//ヘッダー
//**************************
class Header extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render () {
    return (
        <header className="App-header">
          <img src={MainLogo} alt="" className="header-logo"></img>
        </header>
    )
  }
}

//**************************
//フッター
//**************************
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
    var navMap = classNames({"current": this.props.nav[0]}, {"none": !this.props.nav[0]})
    var navShop = classNames({"current": this.props.nav[1]}, {"none": !this.props.nav[1]})
    var navMyPage = classNames({"current": this.props.nav[2]}, {"none": !this.props.nav[2]})
    return (
      <footer className="App-footer">
        <div className={navMap} onClick={this.navTapHandler} nav-num="0"><img src={MapLogo} alt="" className="navImage"></img></div>
        <div className={navShop} onClick={this.navTapHandler} nav-num="1"><img src={ShopLogo} alt="" className="navImage"></img></div>
        <div className={navMyPage} onClick={this.navTapHandler} nav-num="2"><img src={MyPageLogo} alt="" className="navImage"></img></div>
      </footer>
    )
  }
}

export default App;