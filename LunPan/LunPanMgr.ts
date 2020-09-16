/**
 * 抽奖轮盘运动管理
 */
import { EnumLunPanState } from "./EnumLunPan";
import LunPanMoveCfg from "./LunPanMoveCfg";

export default class LunPanMgr {
    private curState:EnumLunPanState = EnumLunPanState.idle;
    /** 当前的转动速度 */
    private curSpeed:number = 0; 
    /** 转动轮盘 */
    private updateRoFunc:Function;
    /** 当前轮盘的旋转角度 */
    private curRotation:number = 0;
    /** 每一个轮盘item间距的角度 */
    private angleSpace:number = 0;
    /** 总共奖品的数量 */
    private totalNum:number = 0;
    private initSucc:boolean = false;
    /** 转动整体速率 */
    private speedScale:number = 1;
    /** 低速匀速运动时间 */
    private curMinTime:number = 0;
    /** 最高速度持续时间 */
    private curhighTime:number = 0;
    /** 目标奖品的停止转动角度 */
    private stopRotate:number = 0;
    /** 结束回调函数 */
    private endCallback:Function;
    /** 初始起的差异角度 */
    private diffRotate:number = 0;
    /** 在最高速多旋转的纠正的角度 */
    private correctRotate:number = 0;
    /** 最高速度减速到最低速度的距离 */
    private reduceDis1:number = 0;
    /** 低速度匀速运动停止的角度 */
    private reduceEndRotate:number = 0;
    
    private statusUpdate(dt:number){
        dt = this.speedScale * dt;
        switch(this.curState){
            case EnumLunPanState.idle:
                break;
            case EnumLunPanState.start:
                this.startToRoll();
                break;
            case EnumLunPanState.add:
                this.doAddSpeed(dt);
                break;
            case EnumLunPanState.high:
                this.doHighSpeed(dt)
                break;
            case EnumLunPanState.highCorrect:
                this.doHighSpeedCorrect(dt);
                break;
            case EnumLunPanState.reduce:
                this.doReduceSpeed(dt);
                break;
            case EnumLunPanState.end:
                this.doRotateEnd();
                break;
        }
    }

    private refreLunPanRotate(dt:number){
        this.curRotation += this.curSpeed *  dt;
        this.updateRoFunc && this.updateRoFunc(this.curRotation);
    }
    /**
     * 开始转动
     */
    private startToRoll(){
        this.correctRotate  = 0;
        this.curhighTime = 0;
        this.curSpeed    = 0;
        this.curState    = EnumLunPanState.add;
    }
    /***
     * 加速转动
     */
    private doAddSpeed(dt){
        this.curSpeed += LunPanMoveCfg.AddSpeed * dt;
        if(this.curSpeed >= LunPanMoveCfg.MaxSpeed){
            this.curSpeed = LunPanMoveCfg.MaxSpeed;
            this.curState = EnumLunPanState.high;
        }
        this.refreLunPanRotate(dt)
    }
    /**
     * 持续高速转动
     * @param dt 
     */
    private doHighSpeed(dt){
        this.curhighTime += dt;
        if(this.curhighTime >= LunPanMoveCfg.MaxTime){
            let curRo = this.curRotation;
            //计算出转盘的相对角度
            let endRo = (curRo + this.reduceDis1 ) % 360;
            //计算出当前转盘的相对角度与停止的角度差距，
            this.correctRotate = endRo < this.stopRotate ? (this.stopRotate - endRo) : (360 - endRo + this.stopRotate);
            this.correctRotate += curRo;
            this.curState = EnumLunPanState.highCorrect;
        }else{
            this.refreLunPanRotate(dt)
        }
        
    }
    /**
     * 纠正转态
     * 这里多旋转到转盘的相对角度与停止的角度差距，旋转完即做减速运动，保证精确到达轮盘的角度
     * @param dt 
     */
    private doHighSpeedCorrect(dt){
        this.refreLunPanRotate(dt)
        if(this.curRotation >= this.correctRotate){
            this.reduceEndRotate = this.correctRotate + this.reduceDis1;
            this.curState = EnumLunPanState.reduce;
        }
    }

    /**
     * 减速运动
     * @param targetIndex 
     */
    private doReduceSpeed(dt:number){
        this.curSpeed -= LunPanMoveCfg.ReduceSpeed * dt
        this.curSpeed < LunPanMoveCfg.MinEndSpeed && (this.curSpeed = LunPanMoveCfg.MinEndSpeed);
        if(this.curRotation >= this.reduceEndRotate){
            console.log("切换至 EnumLunPanState.uniform this.curSpeed",this.curSpeed);
            this.curState = EnumLunPanState.end;
        }else{
            this.refreLunPanRotate(dt)
        }
       
    }
    /**
     * 转动结束
     */
    private doRotateEnd(){
        console.log("_____转动结束______")
        this.endCallback && this.endCallback();
        this.endCallback = null;
        this.curState = EnumLunPanState.idle;
    }
    /**
     * 检查轮盘转态
     * @param targetIndex 
     */
    private checkStartSucc(targetIndex:number){
        if(!this.initSucc){
            console.error("LunPanMgr start faile: because lunPanMgr init no success, plz check init"); 
            return false
        }
        if(targetIndex <0){
            console.error("LunPanMgr start faile: targetIndex < 0"); 
            return false
        }
        if(targetIndex >= this.totalNum){
            console.error("LunPanMgr start faile: targetIndex >= total number"); 
            return false
        }
        return true
    }

    /**
     * 初始化轮盘系统
     * @param nodeRotate 轮盘转动
     * @param totalNum 总共奖品数量 必须大于1小于73 太小没意义
     */
    public init(updataRotateFunc:Function, totalNum:number, diffRotate:number = 0){
        if(totalNum < 2) {
            console.error("LunPanMgr init faile: totalNum must  > 1");
        }else if(totalNum > 72){
            console.error("LunPanMgr init faile: totalNum  > 72");
        }else {
            this.diffRotate  = diffRotate;
            this.updateRoFunc = updataRotateFunc;
            this.totalNum    = totalNum;
            this.angleSpace  = 360 / totalNum;
            this.initSucc    = true;
            let time1        = (LunPanMoveCfg.MaxSpeed - LunPanMoveCfg.MinEndSpeed) / LunPanMoveCfg.ReduceSpeed;
            this.reduceDis1  = LunPanMoveCfg.MaxSpeed * time1 - (LunPanMoveCfg.ReduceSpeed * Math.pow(time1, 2)) * 0.5;
        }
       
    }

    /**
     * 开始转动
     * @param targetIndex 目标奖品索引 起始索引0
     * @param endCallback 转动结束回调，用于更新动画等
     */
    public start(targetIndex:number, endCallback:Function=null){
        if(this.checkStartSucc(targetIndex)){
            this.curRotation = this.curRotation % 360;
            this.stopRotate   = 360 -  this.angleSpace * targetIndex - this.diffRotate
            this.curState     = EnumLunPanState.start;
            this.endCallback  = endCallback;
        }
    }




    public update(dt){
        this.statusUpdate(dt)
    }
    /**
     * 是否处于非转动状态
     */
    public isIdle(){
        return this.curState == EnumLunPanState.idle;
    }

    
}