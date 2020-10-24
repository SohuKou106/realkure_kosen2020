import React from 'react'
import classNames from 'classnames'
import request from 'superagent'
import noimage from '../images/noimage.png'
import './Shop.css'
import {langNum} from '../MyPage'
import {Search} from '../Search/Search'
import {l} from '../Language'
import search from '../images/search.png'
import { TrianglesDrawMode } from 'three'
import { ShopDetail } from './ShopDetail'

export class Shop extends React.Component {
  constructor (props) {
    super(props)
    this.shopPosition = this.shopPosition.bind(this)
    this.shopTabTapHandler = this.shopTabTapHandler.bind(this)    
    this.state = {
      nav: [true, false],
      shop_list: []
    }
    this.props.movePage(this.state)
    this.props.before_page   
  }
  componentWillMount () {
    if(this.props.before_page.page == "Shop"){
      request
      .get('/api/exhibition')
      .accept('application/json')
      .end((err, res) => {
        if (err) return
        this.setState({shop_list: res.body.content, nav:[false, true]})
      })
    }
    else{
      request
      .get('/api/shop')
      .accept('application/json')
      .end((err, res) => {
        if (err) return
        this.setState({shop_list: res.body.content})
      })
    }

  }
  
  shopPosition (e) {
    const shop_data = {
      lat: e.latitude,
      lng: e.longitude,
      genre: e.genre,
      sid: e.id,
      sname: e.name,
      stag1: e.tag1,
      stag2: e.tag2,
      stag3: e.tag3,
      saddress1: e.address1,
      saddress2: e.address2,
      sweek: e.hours_weekday,
      sholi: e.hours_holiday,
      sreg_holi: e.regular_holiday,
      sintro: e.intro
    }
    this.props.shopLocate(shop_data)
  }

  shopDetail (e) {
    const shop_data = {
      lat: e.latitude,
      lng: e.longitude,
      genre: e.genre,
      sid: e.id,
      sname: e.name,
      stag1: e.tag1,
      stag2: e.tag2,
      stag3: e.tag3,
      saddress1: e.address1,
      saddress2: e.address2,
      sweek: e.hours_weekday,
      sholi: e.hours_holiday,
      sreg_holi: e.regular_holiday,
      sintro: e.intro
    }
    this.props.before_page.set("Shop")
    this.props.movePage({shop_data: shop_data, Component: ShopDetail})
  }

  shopTabTapHandler (e) {
    const navCopy = this.state.nav.slice()
    const k = Number(e.currentTarget.getAttribute('nav-num'))
    for (var i = 0; i < 2; i++) {
      if (i === k) {
        navCopy[i] = true
      } else {
        navCopy[i] = false
      }
    }
    this.setState({nav: navCopy, shop_list: []})
    switch (k) {
      case 0:
        request
          .get('/api/shop')
          .accept('application/json')
          .end((err, res) => {
            if (err) return
            this.setState({shop_list: res.body.content})
          })
        break;
      case 1:
        request
          .get('/api/exhibition')
          .accept('application/json')
          .end((err, res) => {
            if (err) return
            this.setState({shop_list: res.body.content})
          })
        break;      
      default:
        request
          .get('/api/shop')
          .accept('application/json')
          .end((err, res) => {
            if (err) return
            this.setState({shop_list: res.body.content})
          })
        break;
    }
  }

  movePage (){
    this.props.before_page.set("Shop")
    this.props.movePage({Component: Search})
  }

  render () {
    console.log(this.state.nav)
    var Shop = classNames({'shop-Current': this.state.nav[0]}, {'shop-None': !this.state.nav[0]})
    var Exhibition = classNames({'shop-Current': this.state.nav[1]}, {'shop-None': !this.state.nav[1]})

    /*
    var navNum = 0
    if(this.state.nav[0]) navNum = 0
    else navNum = 1
    */

    var shop_list

    if(this.state.nav[0]){
      console.log("shop")
      shop_list = this.state.shop_list.map(e => {
        return (
          <div key={`${e.id}`} className="shop_ElementS" onClick={this.shopPosition.bind(this, e)}>
            <div className="shop_ImgField"><img src={'./images/shops/' + `${e.id}` + '.jpg'} className="shop_ImageS" onError={e => e.target.src = noimage}/></div>
            <div className="shop_Info">
              <div className="shop_NameS">{e.name}</div>
            </div>
          </div>
        )
      })
      shop_list =
        <div className='shop_ListS'>
          {shop_list}
        </div>
    }
    else{
      console.log("ex")
      shop_list = this.state.shop_list.map(e => {
        return (          
          <div key={`${e.id}`} className="shop_Element" onClick={this.shopDetail.bind(this, e)}>
            <div className="shop_ImgField"><img src={'./images/shops/' + `${e.id}` + '.jpg'} className="shop_Image" onError={e => e.target.src = noimage}/></div>
            <div className="shop_Info">
              <div className="shop_Name">{e.name}</div>
              <div className="shop_Intro">{e.intro}</div>
            </div>          
          </div>          
        )
      })

      shop_list =
      <div className='shop_List'>
        {shop_list}
      </div>
    }
    return(
      <div id='container'>        
        <div className='shop_Tab'>
          <div className={Shop} onClick={this.shopTabTapHandler} nav-num="0">模擬店</div>
          <div className={Exhibition} onClick={this.shopTabTapHandler} nav-num="1">展示</div>
        </div>        
        {shop_list}        
      </div>
    )
  }
}