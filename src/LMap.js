import React from 'react'
import { Map, Marker, Popup, TileLayer, Rectangle } from 'react-leaflet'
import './leaflet.css'
import './LMap.css'
import './leaflet-routing-machine.css'
import noimage from './images/noimage.png'
import request from 'superagent'
import {ShopDetail} from './Shop/ShopDetail'
import {SubjectPage} from './SubjectPage'
import {shop, exhibition, vender, P, M, E, C, A,
        second_norm, first_PE, second_PE, library, plaza,
        openSpace, shop_Head, head, info, mobilePoint} from './Marker'

//import '@babel/polyfill';

//Leaflet.Icon.Default.imagePath =
  //"//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/images/";

export class LMap extends React.Component { 
  constructor (props) {
    super(props)
    this.state = {
      position: [34.232009, 132.602588], zoom:19, mobile_lat: null, mobile_lng: null,
      rectangle: [[34.228199, 132.605666], [34.235941, 132.597804]],
      shop_list: [],
      checked: [true, true, true, true, true],
      menuShow: false,
      favChanged: false,
      root: null,
      reviewShow: false,            
    }
    this.props.shop_data
    this.props.favId
    this.props.mapStatus
    this.props.reviewShopId
    this.props.movePage(this.state)
    this.props.before_page
    this.getCurrentPosition = this.getCurrentPosition.bind(this)
    this.mobilePosition = this.mobilePosition.bind(this)
  }  

  //App.jsで実装するHome画面から画面そのものであるComponentを切り替えることでページ切り替えを実現
  //それぞれの画面の初期化などは，各スクリプトのcomponentWillMountで行っている
  componentWillMount () {
    if (navigator.geolocation) {
      this.getCurrentPosition();
      setInterval(this.getCurrentPosition, 5000)
    }

    this.setState({position: this.props.mapStatus.center, 
                   zoom: this.props.mapStatus.zoom,
                   checked: this.props.mapStatus.checked})
        
    request
      .get('/api/data')
      .accept('application/json')
      .end((err, res) => {
        if (err) return
        this.setState({shop_list: res.body.content})
    })
  }

  componentWillUnmount () {
    clearInterval(this.getCurrentPosition) 
  }

  getCurrentPosition () {
    //Safariはhttps接続でないと，位置情報を取得できない
    //latとlngがnullのままなので，マーカーが表示されない
    navigator.geolocation.getCurrentPosition(
      this.mobilePosition
    )
  }

  mobilePosition (position) {
    var data = position.coords
    lat = data.latitude
    lng = data.longitude
    this.setState({mobile_lat: lat, mobile_lng: lng}) 
  }

  //ポップアップのお気に入りボタンが押されたら呼び出される
  favChange(state){
    this.setState(state)
  }

  //ポップアップの画像がタップされた時に詳細ページに移動
  moveShopDetail(marker){
    console.log("move ShopDetail")
    console.log(marker)
    const shop_data = {
      lat: marker.lat,
      lng: marker.lng,
      id: marker.id,
      name: marker.name,
      address1: marker.address1,
      address2: marker.address2,
      intro: marker.intro,
      tag1: marker.tag1,
      tag2: marker.tag2,
      tag3: marker.tag3,
      week: marker.week,
      holi: marker.holi,
      reg_holi: marker.reg_holi
    }
    this.props.mapStatus.set(this.state.position, this.state.zoom, this.state.checked)
    this.props.before_page.set("LMap")
    this.props.movePage({shop_data: shop_data, Component: ShopDetail})
  }

  moveSubPage(data){
    this.props.mapStatus.set(this.state.position, this.state.zoom, this.state.checked)
    this.props.before_page.set("LMap")
    this.props.movePage({shop_data: data, Component: SubjectPage})
  }

  zoomEnd(e){ 
    var zoom = e.target.getZoom()
    this.setState({zoom: zoom})
  }

  dragEnd(e){
    var center = e.target.getCenter()
    this.setState({position: center})
  }

  checkNowOpen(week){
    var offHours
    var hours_weekdayData = week.split('　')

    var now = new Date()
    var day = now.getDate()
    var hour = now.getHours()
    var minute = now.getMinutes()

    console.log(hour + ":" + minute)
    var start //[0:時間, 1:分]
    var end   //[0:時間, 1:分]
    //hours_weekdayDataが[0:"10/31", 1:時刻, 2:"11/1", 3:時刻]の場合
    if(hours_weekdayData.length == 4){
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
    else if(hours_weekdayData.length == 2){
       if(day == hours_weekdayData[0].split('/')[1]){
         var day_hours = hours_weekdayData[1].split('-')
         start = day_hours[0].split(':')
         end = day_hours[1].split(':')
       }
       else{
         start = [23, 59]
         end = [0, 0]
       }
    }
    else{
      if(day != 31 && day != 1){
        start = [23, 59]
        end = [0, 0]
      }
      else{
        var hours = week.split('-')
        start = hours[0].split(':')
        end = hours[1].split(':')
      }
    }
    console.log(start[0] + ":" + start[1] + "~" + end[0] + ":" + end[1])
    if((hour < start[0] || hour > end[0]) || (hour == start[0] && minute < start[1]) || (hour == end[0] && minute > end[1])){
      offHours = <div className="shop_offHour">営業時間外</div>
    }
    return offHours
  }

  render () {
    //現在地
    var MobileMarker

    if(this.state.mobile_lat != null && this.state.mobile_lng != null){
      MobileMarker = <Marker position={[this.state.mobile_lat, this.state.mobile_lng]} icon={mobilePoint}></Marker>
    }

    //デフォルトで表示されてるマーカー
    var markers_shop = new Array()
    var markers_ex = new Array()
    var other = new Array()
    var ven = new Array()
    var p = new Array()
    var dataM, dataE, dataC, dataA    

    var shoplist = this.state.shop_list.slice()

    shoplist.forEach(function(shop,index) {
      var m = {
        title: shop.name,
        lat: shop.latitude,
        lng: shop.longitude,
        img: './images/shops/' + `${shop.id}` + '.jpg',
        name: shop.name,
        address1: shop.address1,
        address2: shop.address2,
        intro: shop.intro,
        id: shop.id,
        tag1: shop.tag1,
        tag2: shop.tag2,
        tag3: shop.tag3,
        week: shop.hours_weekday,
        holi: shop.hours_holiday,
        reg_holi: shop.regular_holiday,
      }

      switch(shop.genre){
        case "模擬店":
          markers_shop.push(m)
          break
        case "展示":
          markers_ex.push(m)
          break
        case "その他":
          other.push(m)
          break
        case "自販機":
          ven.push(m)
          break
        case "駐車場":
          p.push(m)
          break
        case "M":
          dataM = m
          break
        case "E":
          dataE = m          
          break
        case "C":          
          dataC = m          
          break
        case "A":          
          dataA = m
          break
      }
    })

    var marker_M = null, marker_E = null, marker_C = null, marker_A = null
    var marker_p = [], marker_ven = [], marker_other = []

    if(dataM != null){
      marker_M = <Marker position={[dataM.lat, dataM.lng]} icon={M}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataM.name}</div>
                      <img src={dataM.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataM)} onError={e => e.target.src = noimage} />            
                      <div onClick={() => this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>
                  </Popup>
                </Marker>
      marker_E = <Marker position={[dataE.lat, dataE.lng]} icon={E}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataE.name}</div>
                      <img src={dataE.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataE)} onError={e => e.target.src = noimage} />            
                      <div onClick={this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>          
                  </Popup>
                </Marker>    
      marker_C = <Marker position={[dataC.lat, dataC.lng]} icon={C}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataC.name}</div>
                      <img src={dataC.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataC)} onError={e => e.target.src = noimage} />            
                      <div onClick={this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>          
                  </Popup>
                </Marker>
      marker_A = <Marker position={[dataA.lat, dataA.lng]} icon={A}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataA.name}</div>
                      <img src={dataA.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataA)} onError={e => e.target.src = noimage} />            
                      <div onClick={this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>          
                  </Popup>
                </Marker>
      
      if(this.state.zoom >= 18){
        if(p.length > 0){
          marker_p = p.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]} icon={P}/>
          ))
        }
        if(ven.length > 0){
          marker_ven = ven.map((marker, index) => {
            return <Marker key={index} position={[marker.lat, marker.lng]} icon={vender}/>
          })
        }
        if(other.length > 0){
          marker_other = other.map((marker, index)=>{
            var icon                       
            switch(marker.name){
              case "オープンスペース":
                icon = openSpace
                break
              case "みんなの広場":
                icon = plaza
                break
              case "本部":
                icon = head
                break
              case "info":
                icon = info
                break
              case "第2普通科棟":
                icon = second_norm
                break
              case "第1体育館":
                icon = first_PE
                break
              case "第2体育館":
                icon = second_PE
                break
              case "模擬店本部":
                icon = shop_Head
                break
              case "図書館棟":
                icon = library
                break
            }
            return(
              <Marker key={index} position={[marker.lat, marker.lng]} icon={icon}>
                <Popup>          
                  <div className='popup_ImgField'>
                    <div className='popup_Name'>{marker.name}</div>
                    <img src={marker.img} className='popup_Image' onError={e => e.target.src = noimage} />            
                  </div>          
                </Popup>
              </Marker>
            )
          })
        }
      }
    }
                 
    //Shopタブ，検索結果，お気に入りリストでお店の項目をタップしたときにLMapに遷移して表示するポップアップ
    var shopClickedPopup

    //ShopDetailから遷移した場合
    if(this.props.shop_data.id != null){
      console.log(this.props.shop_data)
      if(this.props.shop_data.lat != null && this.props.shop_data.lng != null){        
        if(this.props.shop_data.genre === "模擬店"){
          shopClickedPopup =    
          <Popup position={[this.props.shop_data.lat, this.props.shop_data.lng]}>          
            <div className='popup_ImgField'>
              <div className='popup_Name'>{this.props.shop_data.name}</div>
              <img src={'./images/shops/' + `${this.props.shop_data.id}` + '.jpg'} className='popup_Image' onError={e => e.target.src = noimage} />              
            </div>          
          </Popup>
        }
        else{
          var offHours = this.checkNowOpen(this.props.shop_data.week)
          shopClickedPopup =
          <Popup position={[this.props.shop_data.lat, this.props.shop_data.lng]}>          
            <div className='popup_ImgField'>
              <div className='popup_Name'>{this.props.shop_data.name}</div>
              <img src={'./images/shops/' + `${this.props.shop_data.id}` + '.jpg'} className='popup_Image' onClick={() => this.moveShopDetail(this.props.shop_data)} onError={e => e.target.src = noimage} />              
              <div onClick={() => this.moveShopDetail(this.props.shop_data)} className="map_RootButton">詳細を見る{'>>'}</div>              
              <div onClick={() => this.moveShopDetail(this.props.shop_data)}>{offHours}</div>
            </div>
          </Popup>
        }      
      }
    }

    return (
      <div id='container'>
        <Map ref='map'
             onzoomend={this.zoomEnd.bind(this)}
             ondragend={this.dragEnd.bind(this)}
             center={this.props.mapStatus.center} zoom={this.props.mapStatus.zoom} minZoom={18} maxZoom={20} maxBounds={this.state.rectangle}>
          <TileLayer
            url="tiles_kosen/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://www.thunderforest.com/outdoors/&quot;>Gravitystorm</a> / map data <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>"
          />
          {MobileMarker}
          {markers_shop.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]} icon={shop}>
             <Popup>          
              <div className='popup_ImgField'>
                <div className='popup_Name'>{marker.name}</div>
                <img src={marker.img} className='popup_Image' onError={e => e.target.src = noimage} />            
              </div>          
            </Popup>
          </Marker>
          ))}         

          {markers_ex.map((marker, index) => {
            var offHours = this.checkNowOpen(marker.week)
            return(
              <Marker key={index} position={[marker.lat, marker.lng]} icon={exhibition}>
                <Popup>          
                  <div className='popup_ImgField'>
                    <div className='popup_Name'>{marker.name}</div>
                    <img src={marker.img} className='popup_Image' onClick={() => this.moveShopDetail(marker)} onError={e => e.target.src = noimage} />            
                    <div onClick={() => this.moveShopDetail(marker)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    <div onClick={() => this.moveShopDetail(marker)}>{offHours}</div>
                  </div>          
                </Popup>
              </Marker>
              )
            } 
          )}
          {shopClickedPopup}
          {marker_M}{marker_E}{marker_C}{marker_A}
          {marker_p}{marker_ven}{marker_other}        
        </Map> 
        <Clock/>
      </div>
    )
  }
}

class Clock extends React.Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render(){
    var now = new Date()
    var day = now.getDate()
    var hour = now.getHours()
    var minute = now.getMinutes()

    var event = "-"

    //1日目
    if(day === 31){
      switch(hour){
        case 10:
          if(minute >= 15){
            event = "秘密の花園"
          }
          else{
            event = "インフォメーション"
          }
          break
        case 11:
          if(minute >= 15){
            event = "LIVE"
          }
          else{
            event = "模擬店PR"
          }
          break
        case 12:
          if(minute <= 15){
            event = "LIVE"
          }
          else if(minute >= 50){
            event = "BINGO"
          }
          else{
            event = "模擬店PR"
          }
          break
        case 13:
          if(minute <= 50){
            event = "BINGO"
          }
          break
        case 14:
          if(minute >= 10 && minute <= 40){
            event = "ネタ合戦2020"
          }
          else if(minute >= 50){
            event = "高専カラオケ"
          }
          break
        case 15:
          if(minute <= 50){
            event = "高専カラオケ"
          }
          break
        case 16:
          if(minute >= 0 && minute <= 45){
            event = "ミス高専コンテスト"
          }
          break
        case 17:
          if(minute >= 15){
            event = "Dance Party"
          }
          break
        case 18:
          event = "Dance Party"
          break
        default:
          event = "-"
          break
      }
    }
    //2日目
    if(day === 1){
      switch(hour){
        case 10:
          if(minute >= 30){
            event = "LIVE"
          }
          else{
            event = "インフォメーション"
          }
          break
        case 11:
          event = "LIVE"
          break
        case 12:
          if(minute <= 30){
            event = "LIVE"
          }
          else if(minute >= 45){
            event = "笑わせたら100万!?イロモネア"
          }
          break
        case 13:
          if(minute <= 15){
            event = "笑わせたら100万!?イロモネア"
          }
          else if(minute >= 30){
            event = "呉高専マッチョ選手権"
          }
          break
        case 14:
          if(minute >= 45){
            event = "BINGO"
          }
          break
        case 15:
          if(minute <= 45){
            event = "BINGO"
          }
          break
        case 16:
          if(minute >= 30){
            event = "フィーリングカップル"
          }
          break
        case 17:
          if(minute <= 30){
            event = "フィーリングカップル"
          }
          else if(minute >= 45){
            event = "最高の贈り物"
          }
          break
        case 18:
          if(minute <= 30){
            event = "最高の贈り物"
          }
          else{
            event = "Ending"
          }
          break
        default:
          event = "-"
          break
      }
    }

    return(
      <div className='event_Window'>
        <div className='event_Title'>ステージ情報</div>
        <div className='event_Text'>{event}</div>
      </div>
    )
  }
}