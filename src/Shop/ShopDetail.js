import React from 'react'
import back from '../images/back.png'
import noimage from '../images/noimage.png'
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

    //経路表示ボタンが押されたら呼び出される
    //*********
    //「マップで確認」ボタンに変更？
    //*********
    moveLMap(e){
        var shop_data = this.props.shop_data
        console.log(shop_data)
        this.props.shopLocate(shop_data)
    }    

    render(){
        var shopData = this.props.shop_data
        return (
            <div id='container' className='shop_List'>
                <div className='backbtn'>
                    <div type='button' name='back' onClick={this.backPage.bind(this)}><img src={back} alt='' className='navImage'/></div>
                </div>
                <div>
                    <div className='shopD_imgField'>
                        <img className='shopD_Image' src={'./images/shops/' + `${shopData.sid}` + '.jpg'} onError={e => e.target.src = noimage} />
                        <div className='shopD_ImageGrad'></div>
                        <div className='shopD_NameText'>{shopData.sname}</div>
                    </div>
                    <div>
                        <div className='shopD_Intro'>{shopData.sintro}</div>                        
                    </div>
                    <div>
                        <table className='shopD_Table'>
                            <tr>
                                <td>営業時間（平日）</td>
                                <td>{shopData.sweek}</td>
                            </tr>
                        </table>
                    </div>
                    <div className='shopD_Buttons'>
                        <button onClick={this.moveLMap.bind(this, {coordinates:{lat:this.props.shop_data.lat, lng:this.props.shop_data.lng}, id:this.props.shop_data.sid})} className='shopD_MapButton'>地図で確認</button>
                    </div>
                </div>
            </div>
        )
    }
}