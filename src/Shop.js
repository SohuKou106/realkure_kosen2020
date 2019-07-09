import React from 'react'
import classNames from 'classnames'
import request from 'superagent'

export class Shop extends React.Component {
  constructor (props) {
    super(props)
    this.shopTabTapHandler = this.shopTabTapHandler.bind(this);
    this.state = {
      nav: [true, false, false, false, false],
      shop_list: []
    }
  }
  componentWillMount () {
    request
      .get('/api/restaurant')
      .accept('application/json')
      .end((err, res) => {
        if (err) return
        this.setState({shop_list: res.body.content})
      })
  }
  shopTabTapHandler (e) {
    const navCopy = this.state.nav.slice()
    const k = Number(e.currentTarget.getAttribute('nav-num'))
    for (var i = 0; i < 5; i++) {
      if (i === k) {
        navCopy[i] = true
      } else {
        navCopy[i] = false
      }
    }
    this.setState({nav: navCopy})
    switch (k) {
      case 0:
        request
          .get('/api/restaurant')
          .accept('application/json')
          .end((err, res) => {
            if (err) return
            this.setState({shop_list: res.body.content})
          })
        break;
      case 1:
        request
          .get('/api/cafe')
          .accept('application/json')
          .end((err, res) => {
            if (err) return
            this.setState({shop_list: res.body.content})
          })
        break;
      case 2:
        request
          .get('/api/tavern')
          .accept('application/json')
          .end((err, res) => {
            if (err) return
            this.setState({shop_list: res.body.content})
          })
        break;
      default:
        request
          .get('/api/restaurant')
          .accept('application/json')
          .end((err, res) => {
            if (err) return
            this.setState({shop_list: res.body.content})
          })
        break;
    }
  }
  render () {
    var Restaurant = classNames({'shop-current': this.state.nav[0]}, {'shop-none': !this.state.nav[0]})
    var Cafe = classNames({'shop-current': this.state.nav[1]}, {'shop-none': !this.state.nav[1]})
    var Tavern = classNames({'shop-current': this.state.nav[2]}, {'shop-none': !this.state.nav[2]})
    var Hotel = classNames({'shop-current': this.state.nav[3]}, {'shop-none': !this.state.nav[3]})
    var Other = classNames({'shop-current': this.state.nav[4]}, {'shop-none': !this.state.nav[4]})
    const styles = {
      shop_nav: {
        borderRight: '2px solid #CCCCCC'
      },
      list: {
        backgroundColor: '#FFFFFF',
        padding: '10px 0',
        margin: '5px',
        boxShadow: '2px 2px #CCCCCC',
        display: 'flex',
        flexDirection: 'row'
      },
      shopImage: {
        width: '20vw',
        margin: '12px'
      },
      shopInfo: {
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
        margin: '3px'
      },
      shopName: {
        color: 'darkorange',
        fontSize: '5vw',
        textAlign: 'left'
      },
      shopAddress: {
        fontSize: '3vw',
        textAlign: 'left'
      }
    }
    const shop_list = this.state.shop_list.map(e => {
      var imgUrl = 'noimage.png'
      return (
        <div key={`${e.id}`} style={styles.list}>
          <img src={imgUrl} style={styles.shopImage} />
          <div style={styles.shopInfo}>
            <div style={styles.shopName}>{e.name}</div>
            <div style={styles.shopAddress}>{e.address1}{e.address2}</div>
          </div>
        </div>
      )
    })
    return(
      <div id='container'>
        <div className='shopTab'>
          <div className={Restaurant} onClick={this.shopTabTapHandler} nav-num="0" style={styles.shop_nav}>食事</div>
          <div className={Cafe} onClick={this.shopTabTapHandler} nav-num="1" style={styles.shop_nav}>カフェ</div>
          <div className={Tavern} onClick={this.shopTabTapHandler} nav-num="2" style={styles.shop_nav}>居酒屋</div>
          <div className={Hotel} onClick={this.shopTabTapHandler} nav-num="3" style={styles.shop_nav}>宿泊</div>
          <div className={Other} onClick={this.shopTabTapHandler} nav-num="4">その他</div>
        </div>
        <div className='shopList'>
          {shop_list}
        </div>
      </div>
    )
  }
}