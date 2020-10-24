import React from 'react'
import '../Shop/Shop.css'
import './Favorite.css'
import request from 'superagent'
import noimage from '../images/noimage.png'
import back from '../images/back.png'
import { MyPage } from '../MyPage'
import { ShopDetail } from '../Shop/ShopDetail'

export class FavList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          shop_data: []
        }
        this.props.favId
    }

    componentWillMount(){
      request
      .get('/api/data')
      .accept('application/json')
      .end((err, res) => {
        if (err) return
        this.setState({shop_data: res.body.content})
      })
    }

    backPage(){
      this.props.movePage({Component: MyPage})
    }

    shopPosition (e) {
      const shop_data = {
        lat: Number(e.currentTarget.getAttribute('lat')),
        lng: Number(e.currentTarget.getAttribute('lng')),
        sid: Number(e.currentTarget.getAttribute('sid')),
        sname: e.currentTarget.getAttribute('sname'),
        saddress1: e.currentTarget.getAttribute('saddress1'),
        saddress2: e.currentTarget.getAttribute('saddress2'),
        sintro: e.currentTarget.getAttribute('sintro'),
        stag1: e.currentTarget.getAttribute('stag1'),
        stag2: e.currentTarget.getAttribute('stag2'),
        stag3: e.currentTarget.getAttribute('stag3'),
        sweek: e.currentTarget.getAttribute('sweek'),
        sholi: e.currentTarget.getAttribute('sholi'),
        sreg_holi: e.currentTarget.getAttribute('sreg_holi'),
      } 
      this.props.before_page.set("FavList")
      this.props.movePage({shop_data: shop_data, Component: ShopDetail})
    }

    render(){
      var all_Shops = this.state.shop_data.slice()  //全てのお店データ
      var faved_Shops = new Array()
      if(all_Shops.length > 0){
        for(var i = 0; i < this.props.favId.fId.length; i++){
          for(var j = 0; j < all_Shops.length; j++){
            if(all_Shops[j].id == this.props.favId.fId[i]){
              faved_Shops.push(all_Shops[j])
            }            
          }
        }
      }

      const shop_list = faved_Shops.map(shop => {
          return(
            <div key={`${shop.id}`} className="shop_Element">
            <div className="shop_ImgField"><img src={'./images/shops/' + `${shop.id}` + '.jpg'} className="shop_Image" onError={e => e.target.src = noimage} /></div>
            <div onClick={this.shopPosition.bind(this)}
                    lat={shop.latitude}
                    lng={shop.longitude}
                    sid={shop.id}
                    sname={shop.name}
                    saddress1={shop.address1}
                    saddress2={shop.address2}
                    sintro={shop.intro}
                    stag1={shop.tag1}
                    stag2={shop.tag2}
                    stag3={shop.tag3}
                    sweek={shop.hours_weekday}
                    sholi={shop.hours_holiday}
                    sreg_holi={shop.regular_holiday}
                    className="shop_Info">
              <div className="shop_Name">{shop.name}</div>
              <div className="shop_Address">{shop.address1}{shop.address2}</div>
              <div className="shop_Intro">{shop.intro}</div>
            </div>          
          </div>
          )        
      })
      var noFavText

      if(this.props.favId.fId.length === 0){
        noFavText = <div>お気に入りに登録していません。</div>
      }
      
      return(
          <div id='container'>
            <div className="backbtn">
              <div type="button" name="back" onClick={this.backPage.bind(this)}><img src={back} alt="" className="navImage"/></div>
            </div>     
            {noFavText}
            <div className='shop_List'>
              {shop_list}
            </div>
          </div>
        )            
    }
}