// 所有调用到的接口地址

const url = {
  // common
  fetchCityList: '//static.galileo.xiaojukeji.com/static/tms/other/hcp-citylist0.1.js',
  // 获取火车票webapp公用配置
  fetchCommonConfig: '/common/config',
  // 获取站点数据
  fetchStationListUrl: '/train/stationList',

  /* ------------------------------- 订票主流程 ------------------------------- */
  // 直达查询
  fetchTrainList: '/train/nonStopSearch',
  // 列车时刻表
  fetchSchedule: '/train/schedule',
  // 查询常用联系人
  fetchContactList: '/user/contactList',
  // 添加常用联系人
  addContact: '/user/addContact',
  // 删除常用联系人
  delContact: '/user/delContact',
  // 12306登录
  login12306: '/user/login',
  // 12306登出
  logout12306: '/user/logout',
  // 联系人菜单配置
  contactOption: '/user/contactOption',
  countryList: '/user/countryList',
  fetchCountryList: '//train-static.didiglobal.com/static/resource/country.txt',
  // 获取价格详情，余票查询页面只能获取到卧铺的上铺价格，需要在车次详情页面改写成下铺价格
  fetchPriceDetail: 'train/priceDetail',

  /* ------------------------------- 订单相关 ------------------------------- */
  // 首页汽泡
  listBubble: '/order/listBubble',
  closeBubble: '/order/closeBubble',
  // 用户订单
  fetchListOrder: '/order/listOrder',
  // 订单详情
  fetchOrderDetail: '/order/detail',
  // 取消订单
  cancelOrder: '/order/userCancelOrder',
  // 占座（订单创建）
  holdSeat: '/order/holdSeat',
  // 轮询订单状态
  fetchOrderStatus: '/order/state',
  // 获取支付id
  fetchPayId: '/order/pay',
  // 退票
  returnTicket: '/order/refund',
  // 抢票
  grabTicketPost: '/grab/grabCreatOrder',
  // 抢票次数轮询
  fetchGrabCounts: 'grab/realtimeInfo',
  // 取消抢票
  cancalGrabTicket: '/grab/cancelOrder',
  // 取消（预付订单）先支付
  CancelPrepayOrder: '/order/userCancelPrepayOrder',
  // 获取优惠券
  getCoupon: 'order/couponInfo',

  // 免密签约状态查询接口
  // querySignStatus: 'http://10.94.66.31:9050/web_wallet/passenger/webWithholdSignInfo',
  querySignStatus: '//pay.diditaxi.com.cn/web_wallet/passenger/webWithholdSignInfo',

  /* ------------------------------- 改签相关 ------------------------------- */
  // 请求改签（占座）
  changeTicket: '/order/change',
  // 用户确认改签
  changeTicketConfirm: '/order/changeUserConfirm',
  // 取消改签
  cancelChange: '/order/cancelChange',

  /* ------------------------------- banner广告 ------------------------------- */
  fetchBannerAD: '//res.xiaojukeji.com/resapi/activity/get'
  // fetchBannerAD: '//10.179.132.198:9080/resapi/activity/get'
}

export const jumpUrl = {
  // 跳转获取支付宝／微信的openid
  // fetchOpenId: 'http://common.rdtest.didichuxing.com/rd/webapp/platform/oauth2/openid',
  fetchOpenId: '//common.diditaxi.com.cn/webapp/platform/oauth2/openid',
  // 跳转拉起免密组件 noPasswordPaySign
  noPwPaySign: ' http://pay.diditaxi.com.cn/h5views/fpwd_com.html'
  // noPwPaySign: ' https://pay.diditaxi.com.cn/h5views/fpwd_com.html',
  // noPwPaySign: 'http://10.94.101.12:6062/h5views/fpwd_com.html'
}
export default url
