import React from 'react'
import request from 'superagent'
import noimage from '../images/noimage.png' 
import back from '../images/back.png'
import './Search.css'
import '../Shop/Shop.css'
import {Search_Radio} from './Search_Radio'
import {l} from '../Language'
import {langNum} from '../MyPage'
import {ShopDetail} from '../Shop/ShopDetail'
import {Search_Result} from './Search_Result'

export class Search extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            radioChecked: false,
            shop_list: [],
            res:[],
            searchTextButton : <button className="search_TextSearchBtn" disabled>{l[langNum].search}</button>,
            searchText: null,
        }
        this.props.movePage(this.state)
        this.props.before_page
    }

    //最初に非同期通信を行う時は，componentDidMountにした方が良い
    //(componentWillMountだと，render()が呼び出される前に通信が完了するとは限らないため)
    componentDidMount (){   
      request
      .get('/api/data')
      .accept('application/json')
      .end((err, res) => {
        if (err) return
        this.setState({shop_list: res.body.content})
      })
    }

    backPage (e){
      this.props.before_page.backPage()
      //this.props.movePage({Component: this.props.before_page.page})
    }

    textChanged(e){
      var btn
      if(e.target.value){
        btn = <button className="search_TextSearchBtn" onClick={this.searchWithText.bind(this)}>{l[langNum].search}</button>
      }
      else{
        btn = <button className="search_TextSearchBtn" disabled>{l[langNum].search}</button>
      }
      this.setState({searchTextButton: btn, searchText: e.target.value})
    }

    searchWithText(e) {
      var searchText = this.state.searchText
      console.log(searchText)
      var shop_list = this.state.shop_list.slice()
      var search_res = shop_list.filter(shop => {
        if(shop.name.indexOf(searchText) != -1){
          return shop
        }
      })
      /*var b = []
      b.push(shop_list[6])
      b.push(shop_list[7])
      b.push(shop_list[8])
      b.push(shop_list[9])
      b.push(shop_list[10])*/
      this.props.movePage({Component: Search_Result, search_res: search_res, type:"Text"})
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
      this.props.before_page.set("Search")
      this.props.movePage({shop_data: shop_data, Component: ShopDetail})
    }

    render(){
        var searchTextButton = this.state.searchTextButton

        var searchRadioBox = <Search_Radio movePage={this.props.movePage.bind(this)} shop_list={this.state.shop_list}/>

        var shoplist = this.state.shop_list.slice()
        var recshopList
        //非同期通信が完了していない場合おすすめリストは表示しないようにする
        if(shoplist.length > 0){
          var recList = []
          
          recList.push(shoplist[0])
          recList.push(shoplist[1])
          recList.push(shoplist[2])
          recList.push(shoplist[3])
          recList.push(shoplist[4])
  
          recshopList = recList.map(e => {
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
        }
        
        return (            
            <div id='container' className="shop_List">
                <div className="backbtn">
                  <div type="button" name="back" onClick={this.backPage.bind(this)}><img src={back} alt="" className="navImage"/></div>
                </div>
                <div className="search_MenuText">{l[langNum].sByText}</div>
                <div className="search_Form">
                  <input type="text" id="search_Text" placeholder={l[langNum].search} className="search_TextBox" onKeyUp={this.textChanged.bind(this)}/>
                  {searchTextButton}
                </div>
                <div className="search_MenuText">{l[langNum].sByHash}</div>
                {searchRadioBox}
                <div className="search_MenuText">{l[langNum].sByRec}</div>
                {recshopList}
            </div>
        )
    }
}