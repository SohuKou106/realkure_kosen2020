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

        var img
        var table

        switch(shopData.name){
            case "機械工学科棟":
                img = './images/page_M.png'
                table = 
                <table>
                    <tr>
                        <td>１</td>
                        <td>高齢化対策（介護用アシスト機器）</td>
                    </tr>
                    <tr>
                        <td>２</td>
                        <td>不思議発見（不思議な風車）</td>
                    </tr>
                    <tr>
                        <td>３</td>
                        <td>3連+Rのトランスミッションのモデル</td>
                    </tr>
                    <tr>
                        <td>４</td>
                        <td>学科紹介</td>
                    </tr>
                    <tr>
                        <td>５</td>
                        <td>ボトルフリップ実演</td>
                    </tr>
                    <tr>
                        <td>６</td>
                        <td><div>PC制御装置の体験</div><div>(UFOキャッチャー・もぐらたたき)</div></td>
                    </tr>
                    <tr>
                        <td>７</td>
                        <td><div>レーザー加工機・マシニングセンタ</div><div>CNC旋盤・ワイヤ放電加工機の実演</div></td>
                    </tr>
                    <tr>
                        <td>８</td>
                        <td>3Dプリンタ・スキャナーの展示</td>
                    </tr>
                </table>
                break
            case "電気情報工学科棟":
                img = './images/page_E.png'
                table = 
                <table>
                    <tr>
                        <td>１</td>
                        <td>シーケンス制御で遊ぼう</td>
                    </tr>
                    <tr>
                        <td>２</td>
                        <td>エレ・マグワールドへようこそ</td>
                    </tr>
                    <tr>
                        <td>３</td>
                        <td>生体信号を使ったロボット制御</td>
                    </tr>
                    <tr>
                        <td>４</td>
                        <td>ロボット操縦体験</td>
                    </tr>
                    <tr>
                        <td>５</td>
                        <td>LED Cube展示</td>
                    </tr>
                    <tr>
                        <td>６</td>
                        <td>電子工作体験</td>
                    </tr>
                    <tr>
                        <td>７</td>
                        <td>ソーラーパネルで「かき氷」</td>
                    </tr>
                </table>
                break
            case "環境都市工学科棟":
                img = './images/page_C.png'
                table = 
                <table>
                    <tr>
                        <td>１</td>
                        <td><div>観察実験！水素水による</div><div>植物色素の還元変化を観察しよう！</div></td>
                    </tr>
                    <tr>
                        <td>２</td>
                        <td>微生物で絵を描こう！</td>
                    </tr>
                    <tr>
                        <td>３</td>
                        <td>水の流れの不思議を体験しよう！</td>
                    </tr>
                    <tr>
                        <td>４</td>
                        <td>コンクリで工作をしよう！</td>
                    </tr>
                    <tr>
                        <td>５</td>
                        <td><div>水環境保全のための</div><div>バイオテクノロジーを知ろう！</div></td>
                    </tr>
                    <tr>
                        <td>６</td>
                        <td>パネル・教科書・レポート・製図の展示</td>
                    </tr>
                </table>
                break
            case "建築学科棟":
                img = './images/page_A.png'
                table = 
                <table>
                    <tr>
                        <td>１</td>
                        <td>学生作品(図面・模型)の展示</td>
                    </tr>
                    <tr>
                        <td>２</td>
                        <td>デザイナーズチェアの展示</td>
                    </tr>
                </table>
                break
        }

        return(
            <div id='container' className='shop_List'>
                <div className='backbtn'>
                    <div type='button' name='back' onClick={this.backPage.bind(this)}><img src={back} alt='' className='navImage'/></div>
                </div>
                <div>
                    <div className='shopD_imgField'>
                        <img className='subject_Image' src={img} onError={e => e.target.src = noimage} />
                    </div>
                    <div className='subPage_Table'>{table}</div>
                </div>
            </div>
        )
    }
}