/**
 * 抽奖轮盘的运动参数
 */
export default class LunPanMoveCfg {
     /**
     * 加速度
     */
    static get AddSpeed(){
        return 800;
    }
    /**
     * 最高速度
     */
    static get MaxSpeed(){
        return 1000;
    }
    /**
     * 最高速度持续多久
     */
    static get MaxTime(){
        return 0.2;
    }
    /**
     * 减速度1
     */
    static get ReduceSpeed(){
        return 400;
    }
    /**
     * 低于多少速度直接停止
     */
    static get MinEndSpeed(){
        return 60;
    }
    
}