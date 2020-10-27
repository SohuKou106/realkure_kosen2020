import React from 'react'
import classNames from 'classnames'
import request from 'superagent'
import noimage from '../images/noimage.png'
import './Shop.css'
import { TrianglesDrawMode } from 'three'
import { ShopDetail } from './ShopDetail'
import { marker } from 'leaflet'

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


  render () {
    var Shop = classNames({'shop-Current': this.state.nav[0]}, {'shop-None': !this.state.nav[0]})
    var Exhibition = classNames({'shop-Current': this.state.nav[1]}, {'shop-None': !this.state.nav[1]})

    var shop_list

    if(this.state.nav[0]){
      shop_list = this.state.shop_list.map(e => {
        return (
          <div key={`${e.id}`} className="shop_ElementS" onClick={this.shopPosition.bind(this, e)}>
            <div className="shop_ImgField"><img src={'./images/shops/' + `${e.id}` + '.jpg'} className="shop_ImageS" onError={e => e.target.src = noimage}/></div>
              <div className="shop_Name">{e.name}</div>            
          </div>
        )
      })
      shop_list =
        <div className='shop_ListS'>
          {shop_list}
        </div>
    }
    else{
      shop_list = this.state.shop_list.map(e => {
        var offHours
        var hours_weekdayData = e.hours_weekday.split('　')

        var now = new Date()
        var day = now.getDate()
        var hour = now.getHours()
        var minute = now.getMinutes()

        var start //[0:時間, 1:分]
        var end   //[0:時間, 1:分]
        //hours_weekdayDataが[0:"10/31", 1:時刻, 2:"11/1", 3:時刻]の場合
        if(hours_weekdayData.length > 1){
          var day1_day = hours_weekdayData[0].split('/')[1] //1日目の日数
          var day2_day = hours_weekdayData[3].split('/')[1] //2日目の日数

          if(day == day1_day){  //1日目なら
            var day1_hours = hours_weekdayData[1].split('-')
            start = day1_hours[0].split(':')
            end = day1_hours[1].split(':')
          }
          else if(day == day2_day){   //2日目なら
            var day2_hours = hours_weekdayData[3].split('-')
            start = day2_hours[0].split(':')
            end = day2_hours[1].split(':')
          }
          else{   //高専祭の日付じゃなかったら
            start = [23, 59]
            end = [0, 0]
          }
        }
        else{
          if(day != 31 || day != 1){
            start = [23, 59]
            end = [0, 0]
          }
          else{
            var hours = marker.week.split('-')
            start = hours[0].split(':')
            end = hours[1].split(':')
          }
        }
        if((hour < start[0] || hour > end[0]) || (hour == start[0] && minute < start[1]) || (hour == end[0] && minute > end[1])){
          offHours = <div className="shop_offHour">営業時間外</div>
        }

        return (          
          <div key={`${e.id}`} className="shop_ElementS" onClick={this.shopDetail.bind(this, e)}>
          <div className="shop_ImgField"><img src={'./images/shops/' + `${e.id}` + '.jpg'} className="shop_ImageS" onError={e => e.target.src = noimage}/></div>
            <div className="shop_Name">{e.name}</div>
            <div className="shop_Detail" onClick={this.shopDetail.bind(this, e)}>詳細を見る{">>"}</div>
            {offHours}
          </div>
        )
      })

      shop_list =
      <div className='shop_ListS'>
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