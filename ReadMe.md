###简介
- 只将轮盘的旋转运动功能独立出来，轮盘的UI自行设计及布局
###设计思路
- 轮盘整个状态简单概括为从静止加速到最高速度，再从最高速度减速到最低速度
- 计算出最高速度到停止速度的距离，再计算出当前转盘的相对角度与停止的角度差距
- 在增加一个高速运动 纠正转态，目的多旋转到转盘的相对角度与停止的角度差距，旋转完即做减速运动，保证精确到达轮盘的目标停止角度
###使用列子
- LunPanTest.ts为测试轮盘代码