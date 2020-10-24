import React from 'react'
import './Favorite.css'

export class FavButton extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
        this.bindfavClicked = this.favClicked.bind(this)
        this.props.favChange(this.state)
        this.props.datas
        this.props.shopId
        this.props.favId
    }

    //**** ボタンクリック時 **** 
    favClicked (e) {
        var id = this.props.favId.fId
        var selectid = e.currentTarget.getAttribute('btn-id')   //クリックされたお店の名前を取得
        const check = id.filter(value =>  value == selectid)    //お気に入りリストにすでにないかチェック (=== : 型を考慮した等価演算子)
        //お気に入りに登録
        if(check.length <= 0){          //被りがなかったら
            id.push(e.currentTarget.getAttribute('btn-id'))
        }
        //お気に入りから削除
        else {
            id.map((id_, index) => {
                if(id_ == selectid){                    
                    id.splice(index, 1)
                }
            })
        }
        this.props.favId.set(id)
        this.props.favChange({favChanged: true})
    }

    render(){
        var shopId = this.props.shopId
        var button 
        var id = this.props.favId.fId
        
        const dupCheck = id.filter(value => value == shopId)    //お気に入りリストにすでにないかチェック (=== : 型を考慮した等価演算子)
        if(dupCheck.length <= 0) {          //被りがなかったら           
            button = <button className="fav_AddButton"
                             onClick={this.bindfavClicked}
                             btn-id={shopId}>お気に入り</button>  
        }
        else {           
            button = <button className="fav_RemoveButton"
                             onClick={this.bindfavClicked}
                             btn-id={shopId}>お気に入り解除</button>
        }

        return (            
            button
        )        
    }
}