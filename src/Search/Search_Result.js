import React from 'react'
import noimage from '../images/noimage.png'
import back from '../images/back.png'
import './Search.css'
import '../Shop/Shop.css'
import {Search} from './Search'
import {l} from '../Language'
import {langNum} from '../MyPage'
import {ShopDetail} from '../Shop/ShopDetail'

export class Search_Result extends React.Component{
    constructor(props){
        super(props)
        this.state = {            
            shop_list: []
        }
        this.props.search_res
        this.props.type
        this.props.shopLocate
        this.props.movePage(this.state)
        this.props.before_page
    }

    backPage(){      
      this.props.movePage({Component: Search})
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
      this.props.before_page.set("Search_Result")
      this.props.movePage({shop_data: shop_data, Component: ShopDetail})
    }

    render(){
        var reslist = this.props.search_res.slice()

        var list = reslist.map(e =>{
          var tag1 = null, tag2 = null, tag3 = null
          tag1 = <span className="shop_Tag">{"#" + e.tag1}</span>
          if(e.tag2 != null) tag2 = <span className="shop_Tag">{"#" + e.tag2}</span>
          if(e.tag3 != null) tag3 = <span className="shop_Tag">{"#" + e.tag3}</span>

          return (
              <div key={`${e.id}`} className="shop_Element">
                <div className="shop_ImgField"><img src={'./images/shops/' + `${e.id}` + '.jpg'} className="shop_Image" onError={e => e.target.src = noimage} /></div>
                <div onClick={this.shopPosition.bind(this)}
                        lat={e.latitude}
                        lng={e.longitude}
                        sid={e.id}
                        sname={e.name}
                        stag1={e.tag1}
                        stag2={e.tag2}
                        stag3={e.tag3}
                        saddress1={e.address1}
                        saddress2={e.address2}
                        sweek={e.hours_weekday}
                        sholi={e.hours_holiday}
                        sreg_holi={e.regular_holiday}
                        sintro={e.intro}
                        className="shop_Info">
                  <div className="shop_Name">{e.name}</div>
                  <div className="shop_Address">{e.address1}{e.address2}</div>
                  <div className="shop_Intro">{e.intro}</div>
                  <div>
                    {tag1}{tag2}{tag3}
                  </div>
                </div>
              </div>
            )
        })      
        
        return(
            <div id='container' className="shop_List">
                <div className="backbtn">
                    <div type="button" name="back" onClick={this.backPage.bind(this)}><img src={back} alt="" className="navImage"/></div>
                </div>                
                <div className="search_MenuText">{l[langNum].sResult}</div>
                {list}
            </div>
        )
    }
}