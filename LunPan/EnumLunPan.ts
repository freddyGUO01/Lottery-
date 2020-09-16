/**
 * 抽奖轮盘运动状态
 */
export enum EnumLunPanState {
    /** 平常停止状态 */
    idle,
    /** 开始转动 */
    start,
    /** 加速到最高速度 */
    add,
    /** 保持高速状态 */
    high,
    /*** 高速纠正状态 */
    highCorrect,
    /** 减速状态1 */
    reduce,
    /** 转动完毕 */
    end,
}