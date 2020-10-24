import React from 'react'
import { Map, Marker, Popup, TileLayer, Rectangle } from 'react-leaflet'
import './leaflet.css'
import './LMap.css'
import './ReviewWindow.css'
import './leaflet-routing-machine.css'
import Routing from './RoutingMachine'
import Routing2 from './RoutingMachine2'
import noimage from './images/noimage.png'
import request from 'superagent'
import {FavButton} from './Favorite/FavButton'
import {l} from './Language'
import {langNum} from './MyPage'
import {Search} from './Search/Search'
import {ShopDetail} from './Shop/ShopDetail'
import {SubjectPage} from './SubjectPage'

//残り
//・「現在開催中のイベント」の完成
//・ShopDetailの修正
//・SubjectPageの修正

//import '@babel/polyfill';

//Leaflet.Icon.Default.imagePath =
  //"//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/images/";

export class LMap extends React.Component { 
  constructor (props) {
    super(props)
    this.state = {
      position: [34.232009, 132.602588], zoom:18, mobile_lat: null, mobile_lng: null,
      rectangle: [[34.228199, 132.605666], [34.235941, 132.597804]],
      //position: [34.244659, 132.557402], zoom: 19, mobile_lat: null, mobile_lng: null,
      //rectangle: [[34.194218, 132.495934], [34.268731, 132.651786]],
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
    this.bindmenuClicked = this.menuClicked.bind(this)
    this.bindshowRoot = this.showRoot.bind(this)    
  }  

  //App.jsで実装するHome画面から画面そのものであるComponentを切り替えることでページ切り替えを実現
  //それぞれの画面の初期化などは，各スクリプトのcomponentWillMountで行っている
  componentWillMount () {
    if (navigator.geolocation) {
      //this.getCurrentPosition();
      setInterval(this.getCurrentPosition, 5000000000000)//5000
    }
    var lat = 34.231288
    var lng = 132.603037
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
    lat = 34.231288
    lng = 132.603037
    this.setState({mobile_lat: lat, mobile_lng: lng}) 
  }

  //サイドバー表示ボタンが押されたら呼び出される
  menuClicked () {
    if(this.state.menuShow == false){
      this.setState({menuShow:true})
    }
    else{
      this.setState({menuShow:false})
    }
  }

  //サイドバーのチェックボタンが変更されたら呼び出される
  updateCheck(checked_Copy){
    if(checked_Copy.length > 0){
      this.props.mapStatus.set(this.state.position, this.state.zoom, checked_Copy)
      this.setState({checked:checked_Copy})
    }    
  }

  //ポップアップのお気に入りボタンが押されたら呼び出される
  favChange(state){
    this.setState(state)
  }

  //ポップアップの経路表示ボタンが押されたら呼び出される
  showRoot(marker){
    var shopRouting = 
      <Routing map={this.refs.map}
               //from={[this.state.mobile_lat, this.state.mobile_lng]}
               from={[34.244798, 132.557611]}
               to={[marker.coordinates.lat, marker.coordinates.lng]}
               sid={marker.id}>
      </Routing>
      this.setState({root: shopRouting})
  }

  //ポップアップのレビュー表示ボタンが押されたら呼び出される
  showReview(id){
    //console.log("show Review, id : " + id)
    var reviewShow = this.state.reviewShow
    this.setState({reviewShow: !reviewShow, reviewShopId: id})
  }

  //ポップアップの画像がタップされた時に詳細ページに移動
  moveShopDetail(marker){
    const shop_data = {
      lat: marker.coordinates.lat,
      lng: marker.coordinates.lng,
      sid: marker.id,
      sname: marker.name,
      saddress1: marker.address1,
      saddress2: marker.address2,
      sintro: marker.intro,
      stag1: marker.tag1,
      stag2: marker.tag2,
      stag3: marker.tag3,
      sweek: marker.week,
      sholi: marker.holi,
      sreg_holi: marker.reg_holi
    }
    this.props.mapStatus.set(this.state.position, this.state.zoom, this.state.checked)
    this.props.before_page.set("LMap")
    this.props.movePage({shop_data: shop_data, Component: ShopDetail})
  }

  moveSubPage(data){
    this.props.before_page.set("LMap")
    this.props.movePage({shop_data: data, Component: SubjectPage})
  }

  mapClicked(){    
    if(this.state.reviewShow) this.setState({reviewShow: false})
  }

  zoomEnd(e){ 
    var zoom = e.target.getZoom()
    this.setState({zoom: zoom})
    console.log("zoom Ended, zoom : " + zoom)
  }

  dragEnd(e){
    var center = e.target.getCenter()
    this.setState({position: center})
    console.log("drag Ended, position : " + center)
  }

  movePage (){
    this.props.mapStatus.set(this.state.position, this.state.zoom, this.state.checked)
    this.props.before_page.set("LMap")
    this.props.movePage({Component: Search})
  }

  render () {
    //デフォルトで表示されてるマーカー
    var markers_shop = new Array()
    var markers_ex = new Array()
    var dataM, dataE, dataC, dataA    

    var shoplist = this.state.shop_list.slice()
    console.log(shoplist)

    shoplist.forEach(function(shop,index) {
      var m = {
        title: shop.name,
        coordinates:{
          lat: shop.latitude,
          lng: shop.longitude
        },
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
        case "M":
          dataM = m
          console.log(dataM)
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

    if(dataM != null){
      marker_M = <Marker position={dataM.coordinates} icon={M}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataM.name}</div>
                      <img src={dataM.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataM)} onError={e => e.target.src = noimage} />            
                      <div onClick={this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>
                  </Popup>
                </Marker>

      marker_E = <Marker position={dataE.coordinates} icon={E}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataE.name}</div>
                      <img src={dataE.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataE)} onError={e => e.target.src = noimage} />            
                      <div onClick={this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>          
                  </Popup>
                </Marker>
    
      marker_C = <Marker position={dataC.coordinates} icon={C}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataC.name}</div>
                      <img src={dataC.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataC)} onError={e => e.target.src = noimage} />            
                      <div onClick={this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>          
                  </Popup>
                </Marker>

      marker_A = <Marker position={dataA.coordinates} icon={A}>
                  <Popup>          
                    <div className='popup_ImgField'>
                      <div className='popup_Name'>{dataA.name}</div>
                      <img src={dataA.img} className='popup_Image' onClick={this.moveSubPage.bind(this, dataA)} onError={e => e.target.src = noimage} />            
                      <div onClick={this.moveSubPage.bind(this, dataM)} className='map_RootButton'>詳細を見る{'>>'}</div>
                    </div>          
                  </Popup>
                </Marker>
     }

    var nowEvent


    //Shopタブ，検索結果，お気に入りリストでお店の項目をタップしたときにLMapに遷移して表示するポップアップ
    var shopClickedPopup

    if(this.props.shop_data != null){
      if(this.props.shop_data.lat != null && this.props.shop_data.lng != null){
        if(this.props.shop_data.stag2 != null){
          if(this.props.shop_data.stag3 != null){
            var tag = "#" + this.props.shop_data.stag1 + "  #" + this.props.shop_data.stag2 + "  #" + this.props.shop_data.stag3    
          }
          else{
            var tag = "#" + this.props.shop_data.stag1 + "  #" + this.props.shop_data.stag2
          }  
        }
        else{
          var tag = "#" + this.props.shop_data.stag1 
        }
        
        if(this.props.shop_data.genre === "模擬店"){
          shopClickedPopup =    
          <Popup position={[this.props.shop_data.lat, this.props.shop_data.lng]}>          
            <div className='popup_ImgField'>
              <div className='popup_Name'>{this.props.shop_data.sname}</div>
              <img src={'./images/shops/' + `${this.props.shop_data.sid}` + '.jpg'} className='popup_Image' onError={e => e.target.src = noimage} />              
            </div>          
          </Popup>
        }
        else{
          shopClickedPopup =    
          <Popup position={[this.props.shop_data.lat, this.props.shop_data.lng]}>          
            <div className='popup_ImgField'>
              <div className='popup_Name'>{this.props.shop_data.sname}</div>
              <img src={'./images/shops/' + `${this.props.shop_data.sid}` + '.jpg'} className='popup_Image' onError={e => e.target.src = noimage} />              
              <div onClick={this.showRoot.bind(this, {coordinates:{lat:this.props.shop_data.lat, lng:this.props.shop_data.lng}, id:this.props.shop_data.sid})} className="map_RootButton">詳細を見る{'>>'}</div>              
            </div>          
          </Popup>
        }      
      }
    }

    return (
      <div id='container'>
        <Map ref='map'
             onclick={this.mapClicked.bind(this)}
             onzoomend={this.zoomEnd.bind(this)}
             ondragend={this.dragEnd.bind(this)}
             center={this.props.mapStatus.center} zoom={this.props.mapStatus.zoom} minZoom={17} maxZoom={20} maxBounds={this.state.rectangle}>
          <TileLayer
            url="tiles_kosen/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://www.thunderforest.com/outdoors/&quot;>Gravitystorm</a> / map data <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>"
          />
          {markers_shop.map((marker, index) => (
            <Marker key={index} position={marker.coordinates} icon={shop}>
             <Popup>          
              <div className='popup_ImgField'>
                <div className='popup_Name'>{marker.name}</div>
                <img src={marker.img} className='popup_Image' onClick={this.moveShopDetail.bind(this, marker)} onError={e => e.target.src = noimage} />            
              </div>          
            </Popup>
          </Marker>
          ))}         

          {markers_ex.map((marker, index) => (
            <Marker key={index} position={marker.coordinates} icon={exhibition}>
              <Popup>          
                <div className='popup_ImgField'>
                  <div className='popup_Name'>{marker.name}</div>
                  <img src={marker.img} className='popup_Image' onClick={this.moveShopDetail.bind(this, marker)} onError={e => e.target.src = noimage} />            
                  <div onClick={this.moveShopDetail.bind(this, marker)} className='map_RootButton'>詳細を見る{'>>'}</div>
                </div>          
              </Popup>
            </Marker>
          ))}
          {shopClickedPopup}
          {marker_M}{marker_E}{marker_C}{marker_A}          
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
    if(day === 23){
      switch(hour){
        case 10:
          if(minute >= 15){
            event = "秘密の花園"
          }
          break
        case 11:
          if(minute >= 15){
            event = "LIVE"
          }          
          break
        case 12:
          if(minute <= 15){
            event = "LIVE"
          }
          else if(minute >= 50){
            event = "BINGO"
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
          event = "高専カラオケ"
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
          break
        default:
          event = "高専カラオケ"
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



export const mobilePoint = new L.Icon({
  iconUrl: require('./assets/mobileIcon.png'),
  iconRetinaUrl: require('./assets/mobileIcon.png'),
  iconAnchor: [10, 10],
  popupAnchor: [0, 10],
  iconSize: [20, 20],
  shadowUrl: require('./assets/marker-shadow.png'),
  shadowSize: [30, 30],
  shadowAnchor: [10, 15],
})

export const shop = new L.Icon({
  iconUrl: require('./assets/marker_Shop.png'),
  iconRetinaUrl: require('./assets/marker_Shop.png'),
  iconAnchor: [10, 10],
  popupAnchor: [0, 10],
  iconSize: [20, 30],
  shadowUrl: require('./assets/marker-shadow.png'),
  shadowSize: [30, 30],
  shadowAnchor: [10, 15],
})

export const exhibition = new L.Icon({
  iconUrl: require('./assets/marker_Ex.png'),
  iconRetinaUrl: require('./assets/marker_Ex.png'),
  iconAnchor: [10, 10],
  popupAnchor: [0, 10],
  iconSize: [20, 30],
  shadowUrl: require('./assets/marker-shadow.png'),
  shadowSize: [30, 30],
  shadowAnchor: [10, 15],
})

export const M = new L.Icon({
  iconUrl: require('./assets/marker_M.png'),
  iconRetinaUrl: require('./assets/marker_M.png'),
  iconAnchor: [45, 15],
  popupAnchor: [0, 0],
  iconSize: [90, 30],
})
export const E = new L.Icon({
  iconUrl: require('./assets/marker_E.png'),
  iconRetinaUrl: require('./assets/marker_E.png'),
  iconAnchor: [45, 15],
  popupAnchor: [0, 0],
  iconSize: [90, 30],
})

export const C = new L.Icon({
  iconUrl: require('./assets/marker_C.png'),
  iconRetinaUrl: require('./assets/marker_C.png'),
  iconAnchor: [45, 15],
  popupAnchor: [0, 0],
  iconSize: [90, 30],
})

export const A = new L.Icon({
  iconUrl: require('./assets/marker_A.png'),
  iconRetinaUrl: require('./assets/marker_A.png'),
  iconAnchor: [45, 15],
  popupAnchor: [0, 0],
  iconSize: [90, 30],
})
