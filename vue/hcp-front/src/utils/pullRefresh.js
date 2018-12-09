// 下拉刷新相关配置
export const computedScrollWrapperHeight = () => {
  const sw = document.querySelector('.scroll-wrapper')
  let swHeight = 0
  if (sw) {
    const { offsetTop } = sw // 距离顶部的距离
    const { innerHeight } = window // 视窗高度
    swHeight = innerHeight - offsetTop
  }
  return swHeight
}

export const pullDownRefresh = {
  stop: 40, // 回弹停留的位置
  threshold: 60, // 下拉刷新动作的下拉距离阈值
  stopTime: 200, // 刷新成功的文案显示时间
  txt: '更新成功' // 刷新成功的文案
}
