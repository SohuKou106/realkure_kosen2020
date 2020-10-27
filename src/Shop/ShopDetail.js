import React from 'react'
import back from '../images/back.png'
import noimage from '../images/noimage.png'
import { shop } from '../Marker'
import './Shop.css'

export class ShopDetail extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
        this.props.before_page
        this.props.shop_data
        this.props.shopLocate
    }

    backPage(e){
        this.props.before_page.backPage()
    }

    moveLMap(e){
        var shop_data = this.props.shop_data
        this.props.shopLocate(shop_data)
    }    

    render(){
        var shopData = this.props.shop_data
        return (
            <div id='container'>
                <div className='backbtn'>
                    <div type='button' name='back' onClick={this.backPage.bind(this)}><img src={back} alt='' className='navImage'/></div>
                </div>
                <div className='shopD_NameText'>{shopData.sname}</div>
                <div className='shopD_List'>
                    <div className='shopD_imgField'>
                        <img className='shopD_Image' src={'./images/shops/' + `${shopData.sid}` + '.jpg'} onError={e => e.target.src = noimage} />
                    </div>
                    <div className='shopD_Intro'>{shopData.sintro}</div>
                    <div className='shopD_PlaceTimeText'>場所</div>
                    <div className='shopD_PlaceTime'>{shopData.saddress1}</div>
                    <div className='shopD_PlaceTimeText'>営業時間</div>
                    <div className='shopD_PlaceTime'>{shopData.sweek}</div>
                    <div>
                        <button onClick={this.moveLMap.bind(this, {coordinates:{lat:this.props.shop_data.lat, lng:this.props.shop_data.lng}, id:this.props.shop_data.sid})} className='shopD_MapButton'>地図で確認</button>
                    </div>
                </div>
            </div>                
        )
    }
}