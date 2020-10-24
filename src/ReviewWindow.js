import React from 'react'
import axios from 'axios'
import './ReviewWindow.css'
import {langNum} from './MyPage'
import {l} from './Language'
import close from './images/close.png'
import { marker } from 'leaflet'

export class ReviewWindow extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            writingReview: false,
            review_title: null,
            review_text: null,
            postButton: <button className='cancelButton' onClick={this.submitReview.bind(this)} disabled>送信</button>,
            review_list: null,
        }
        this.props.shopid
        this.props.showReview
        this.textChanged = this.textChanged.bind(this)
    }

    
    componentWillMount(){
        this.updateReviewState()
    }

    closeWindow(e){
        this.props.showReview()
    }

    showWriteReviewWindow(e){
        this.setState({writingReview: true})
    }

    submitReview(e){
        const ROOT_ENDPOINT = "http://localhost:3011";//'http://192.168.3.6:3011'; //'localhost:3001';
        const title = this.state.review_title
        const text = this.state.review_text
        axios.post(ROOT_ENDPOINT + "/review/create",
        {
            shopid: this.props.shopid,
            title: title,
            text: text
        }).then(() => {
            console.log("post success!")
            this.updateReviewState()
        })
        this.setState({writingReview: false})    
    }

    updateReviewState() {
        const ROOT_ENDPOINT = "http://localhost:3011"; //'http://192.168.3.6:3011';
        axios.get(ROOT_ENDPOINT + "/review")        
        .then((results) => {
            console.log(results.data)
            this.getReviewDataHandler(results.data)            
        })
        .catch((error) => {
            console.log("通信に失敗しました！！！！！！！！ごめん！！！！！！！！！")
        })        
    }

    getReviewDataHandler(data){
        var nowReview = data.filter(data => {
            return data.shopid === this.props.shopid;
        })
        //console.log(nowReview)
        this.setState({review_list: nowReview})
    }

    cancelWriteReview(e){
        var btn = <button className='cancelButton' onClick={this.submitReview.bind(this)} disabled>送信</button>
        this.setState({writingReview: false, review_title: null, review_text: null, postButton: btn})
    }

    textChanged(e){
        const textType = e.target.id
        var btn

        if(textType=="titleText"){
            if(e.target.value && this.state.review_text){
                btn = <button className='cancelButton' onClick={this.submitReview.bind(this)}>送信</button>            
            }
            else {
                btn = <button className='cancelButton' onClick={this.submitReview.bind(this)} disabled>送信</button>
            }
            this.setState({review_title: e.target.value, postButton: btn})    
        }  
        if(textType=="reviewText"){
            if(e.target.value && this.state.review_title){
                btn = <button className='cancelButton' onClick={this.submitReview.bind(this)}>送信</button>            
            }
            else {
                btn = <button className='cancelButton' onClick={this.submitReview.bind(this)} disabled>送信</button>
            }
            this.setState({review_text: e.target.value, postButton: btn}) 
        }        
    }

    render(){
        const styles = {
            buttons:{
                display: "flex",
                flexDirection: "row",
            },
            reviewArea:{
                backgroundColor: '#FFFFFF',
                padding: '0px 0',
                margin: '5px 30px',
                boxShadow: '2px 2px #CCCCCC',
            }
        }

        var reviewArea

        //console.log("state : " + this.state.review_list)
        if(this.state.review_list){
            if(this.state.review_list.length > 0){
                //console.log("review > 0")
                var reviews = this.state.review_list.slice()
                //console.log("reviews : " + reviews)
                reviewArea = reviews.map((review, index) => {
                    return(
                        <div key={review.id} style={styles.reviewArea}>
                            <div>{review.title}</div>
                            <div>{review.text}</div>
                        </div>
                    )                    
                })
            }
            else{
                //console.log("review = 0")
                reviewArea = <div>レビューが投稿されていません。</div>
            }            
        }
        else{
            //console.log("review = 0")
            reviewArea = <div>レビューが投稿されていません。</div>            
        }
        //console.log(reviewArea)
        var writingArea

        if(this.state.writingReview){
            writingArea =             
            <div className="w_footer">
                <input type="text" id="titleText" placeholder="タイトル" className="w_titleBox" onChange={this.textChanged}/>
                <textarea type="text" id="reviewText" placeholder="レビュー" className="w_textBox" onChange={this.textChanged}/>
                <div style={styles.buttons}>
                    {this.state.postButton}
                    <button className='cancelButton' onClick={this.cancelWriteReview.bind(this)}>やめる</button>
                </div>                
            </div>
        }
        else{
            writingArea =
            <div className="r_footer">
                <button className='writeReviewButton' onClick={this.showWriteReviewWindow.bind(this)}>レヴューを書く</button>
            </div>
        }

        return (
            <div className="reviewWindow">
                <div className="r_header">
                    <div className="reviewText" margin="0 auto">{l[langNum].showReview}</div>
                    <div type="button" name="close" onClick={this.closeWindow.bind(this)}><img src={close} alt="" className="r_closeButton"/></div>                    
                </div>
                <div className="r_container">
                    {reviewArea}
                </div>               
                {writingArea}
            </div>
        )
    }
}