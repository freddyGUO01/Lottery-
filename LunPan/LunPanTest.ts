import LunPanMgr from "./LunPanMgr";

export default class LunPanTest {
    lunMgr:LunPanMgr;
    total:number = 9;
    start(){
        this.lunMgr = new LunPanMgr();
        this.lunMgr.init(this.updateLunPan.bind(this), this.total, 0);
        /** 设置轮盘update方法 */
        this.lunPanUpdate();
        /** 测试 */
        this.test();
    }
    /**
     * 轮盘update
     */
    lunPanUpdate(){
        let lastTime = Date.now();
        let dt:number =Date.now();
        setInterval(()=>{
            dt = parseFloat(((Date.now() - lastTime) / 1000).toFixed(3))
            // console.log(dt)
            lastTime = Date.now();
            this.lunMgr.update(dt)
        }, 1000/60);
    }


    /**
     * 更新转盘的角度
     * @param rotation 
     */
    updateLunPan(rotation:number){
        console.log("rotation:", rotation, rotation % 360);
    }

    /**
     * 测试旋转轮盘
     */
    test(){
        let index = Math.floor((9) * Math.random());
        this.lunMgr.start(index);
        console.log("______index_______", index)
        
    }


}