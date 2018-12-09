// 订单列表与订单详情页中车票文案及车票title中样式
/** wiki文档连接：
 *
 * http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=149358478
 *
 * http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=150292880
 */

// 车票文案样式
/*
**1、green——出票成功5005、5022、5028、退票成功5013、改签票5008
**2、grey——已取消5002、5025、5020、已关闭5031、5024、5018、已改签5007
**3、red——出票失败5004、改签失败5009、退票失败5012、出票失败5021、5027，抢票失败5032, 5033
**4、orange——
*      抢票中5019、5026、5037
*      待支付5001、5017、5030
*      出票中5003、5023、5036、5029
*      退票受理中5011、
*      改签受理中5006、
*      改签待确认5010、5016、5034
*/
export const ticketTextCss = code => {
  let className = ''
  const greenArr = [5005, 5022, 5028, 5008, 5013]
  const greyArr = [5002, 5025, 5020, 5018, 5024, 5031, 5007]
  const redArr = [5004, 5009, 5012, 5021, 5027, 5032, 5033]
  const orangeArr = [5019, 5026, 5037, 5001, 5017, 5030, 5003, 5023, 5036, 5029, 5011, 5006, 5010, 5016, 5034]
  if (greenArr.includes(code)) {
    className = 'green'
  } else if (greyArr.includes(code)) {
    className = 'grey'
  } else if (redArr.includes(code)) {
    className = 'red'
  } else if (orangeArr.includes(code)) {
    className = 'orange'
  }
  return className
}

// 车票顶部颜色样式
export const ticketTopCss = code => {
  let className = ''
  const greyArr = [5002, 5004, 5025, 5020, 5018, 5024, 5031, 5013]
  if (greyArr.includes(code)) {
    className = 'grey'
  }
  return className
}

// 订单详情页顶部文案状态
/*
**1、green——抢票成功5019、5027、5028、5023、出票成功5005、5022、5028
**2、grey——已取消5002、5025、5020、已关闭5031、5024、5018
**3、red——抢票失败5033、5032、出票失败5004、出票失败5021、5027
**4、orange——抢票中5019、5026、5037、待支付5001、5017、5030、出票中5003、5036
**改签待确认5010、5016、5034
*/
export const orderTopStatus = code => {
  let className = ''
  const greenArr = [5029, 5027, 5028, 5023, 5005, 5022]
  const greyArr = [5002, 5025, 5020, 5018, 5024, 5031]
  const redArr = [5033, 5032, 5004, 5021, 5027]
  const orangeArr = [5001, 5017, 5030, 5019, 5026, 5037, 5010, 5016, 5034, 5003, 5036]
  if (greenArr.includes(code)) {
    className = 'green'
  } else if (greyArr.includes(code)) {
    className = 'grey'
  } else if (redArr.includes(code)) {
    className = 'red'
  } else if (orangeArr.includes(code)) {
    className = 'orange'
  }
  return className
}

// 格式化倒计时
export const formatCountDown = time => {
  let intDiff = parseInt(time, 10) // 倒计时总秒数
  let minute = Math.floor(intDiff / 60)
  let second = Math.floor(intDiff) - minute * 60
  if (minute <= 9) minute = '0' + minute
  if (second <= 9) second = '0' + second
  return minute + ':' + second
}

// 订单列表及订单详情页订单价格字段展示逻辑
/*
**1、对于普通订单与预约买票订单(先支付订单sub_type=3)展示总计
**2、预支付抢票订单（sub_type=2,order_code(5017,5019,5023,5021,5020,5018)）展示预付
**3、抢票免密订单占座成功之前不展示价格，占座成功之后(5029,5030,5024,5027,5028)展示总计
*/
export const moneyShowType = (sub_type, code) => {
  let flag = ''
  if (sub_type === 1 || sub_type === 3 || [5024, 5027, 5028, 5029, 5030].includes(code)) {
    flag = '总计'
  }
  if (sub_type === 2 && [5023, 5017, 5019, 5020].includes(code)) {
    flag = '预付'
  }
  return flag
}

// 订单列表与订单详情页倒计时为0，同时订单状态为待支付，改签待确认状态，展示倒数计时为0对话框
export const countTimeZero = code => {
  return [5001, 5010, 5016, 5034, 5017, 5030].includes(code)
}

// 订单详情页底部按钮区域展示
/*
**1、普通订单——待支付5001、改签待确认5010（高改）5016（平改）5034（低改）
**2、预支付抢票订单——待支付5017、抢票中5019
**3、免密抢票订单——抢票成功、待支付5030、抢票中5026、5037
**4、先支付后占座——（夜间收单）5036（出票中）
*/
export const orderDetailBottomBtn = code => {
  // return [5001, 5010, 5016, 5034, 5017, 5019, 5030, 5026, 5037, 5036].includes(code)
  // 5.2.30抢票按钮区分
  return [5001, 5010, 5016, 5034, 5017, 5030, 5036].includes(code)
}

export default {
  ticketTextCss,
  ticketTopCss,
  orderTopStatus,
  formatCountDown,
  moneyShowType,
  countTimeZero,
  orderDetailBottomBtn
}
