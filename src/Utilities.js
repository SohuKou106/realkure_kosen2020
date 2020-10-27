import {LMap} from './LMap'
import {Shop} from './Shop/Shop'

//*******複数のページからアクセスできるページに移動する前に前の画面を保存しておく*******
export class BeforePage{    
    constructor(page, movePage){
        this.page = page
        this.movePage = movePage
    }

    set(page_name){        
        this.page = page_name
    }

    backPage(){
        switch(this.page){
            case "LMap": this.movePage({shop_data:{lat:null, lng:null, sid:null, sname:null,
                                        saddress1: null, saddress2:null, sintro:null,
                                        stag1: null, stag2: null, stag3: null, sweek: null,
                                        sholi: null, sreg_holi: null,},
                                        Component: LMap}); break;
            case "Shop": this.movePage({Component: Shop}); break;
        }
    }
}

//*******LMapの中心，拡大情報を記憶しておく*******
export class LMapStatus{
    constructor(center, zoom, checked){
        this.center = center
        this.zoom = zoom
        this.checked = checked
    }
    set(center, zoom, checked){
        this.center = center
        this.zoom = zoom
        this.checked = checked        
    }
}

//*******読み込んだお店の情報を保存*******
export class ShopData{
    constructor(shop_data){
        this.shop_data = shop_data
    }
    set(shop_data){
        this.shop_data = shop_data
    }
}