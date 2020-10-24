import React from 'react'
import back from './images/back.png'
import noimage from './images/noimage.png'
import './Shop/Shop.css'

export class SubjectPage extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
        this.props.before_page
        this.props.shop_data
    }

    backPage(e){
        this.props.before_page.backPage()
    }

    render(){
        var shopData = this.props.shop_data

        return(
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
                </div>
            </div>
        )
    }
}