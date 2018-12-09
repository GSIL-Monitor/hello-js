import * as types from '../mutation-types'
import { getJP } from '@/utils/pinyin.js'

// state
const state = {
  pollingInterval: 2,
  logged: false,
  headerStatus: false,
  omegaKey: '',
  omegaParams: {},
  omegaName: {},
  headerRightText: '',

  servicePhone: '', // 客服电话
  searchHotCity: [], // 热门城市
  cityList: [], // 城市列表
  searchServiceText: '',
  preSaleTime: {
    normal: null,
    grab: null
  }, // 正常购票、抢票的日期天数，从config接口取
  holiday: {},
  ticketNumThreshold: {
    max: 50,
    min: 0
  }, // 有票／具体票数／无票的显示阀值，从config接口取，本地设兜底值
  webView: 'browser', // 当前浏览器环境
  isWeChat: false, // 是否微信内
  isAliPay: false, // 是否支付宝内
  isDidi: false, // 是否滴滴主app内
  account12306: '', // 12306账号名
  isLogin12306: false, // 是否已登陆12306账号,
  refundNoticeStatus: false, // 退票须知Dialog显示状态
  trainSeatGroup: [],
  localCity: '', // 定位城市
  notServiceTime: false // 是否在服务时间段
}
// getters
const getters = {
  pollingInterval: state => state.pollingInterval,
  headerStatus: state => state.headerStatus,
  omegaKey: state => state.omegaKey,
  omegaParams: state => state.omegaParams,
  omegaName: state => state.omegaName,

  searchHotCity: state => state.searchHotCity,
  cityList: state => state.cityList,
  servicePhone: state => state.servicePhone,
  searchServiceText: state => state.searchServiceText,
  preSaleTime: state => state.preSaleTime,
  holiday: state => state.holiday,
  ticketNumThreshold: state => state.ticketNumThreshold,
  webView: state => state.webView,
  isWeChat: state => state.isWeChat,
  isAliPay: state => state.isAliPay,
  logged: state => state.logged,
  account12306: state => state.account12306,
  isLogin12306: state => state.isLogin12306,
  openid: state => state.openid,
  refundNoticeStatus: state => state.refundNoticeStatus,
  trainSeatGroup: state => state.trainSeatGroup,
  localCity: state => state.localCity,
  notServiceTime: state => state.notServiceTime
}

// action
const actions = {
  changeLogStatus({ commit }, payload) {
    commit(types.CHANGE_LOG_STATUS, payload)
  },
  changeHeader({ commit }, payload) {
    commit(types.CHANGE_HEADER, payload)
  },
  updateHotCity({ commit }, payload) {
    commit(types.UPDATE_HOT_CITY, payload)
  },
  updateCityList({ commit }, payload) {
    commit(types.UPDATE_CITY_LIST, payload)
  },
  updateServicePhone({ commit }, payload) {
    commit(types.UPDATE_SERVICE_PHONE, payload)
  },
  updateServiceData({ commit }, payload) {
    commit(types.UPDATE_SERVICE_DATA, payload)
  },
  updateHoliday({ commit }, payload) {
    commit(types.UPDATE_HOLIDAY, payload)
  },
  updatePreSaleTime({ commit }, payload) {
    commit(types.UPDATE_PRE_SALE_TIME, payload)
  },
  update12306({ commit }, payload) {
    commit(types.UPDATE_12306, payload)
  },
  updateTicketNumThreshold({ commit }, payload) {
    commit(types.UPDATE_THRESHOLD, payload)
  },
  detectWebView({ commit }, payload) {
    commit(types.UPDATE_WEBVIEW, payload)
  },
  updateRefundNoticeStatus({ commit }, payload) {
    commit(types.UPDATE_REFUND_NOTICE_STATUS, payload)
  },
  updateTrainSeatGroup({ commit }, payload) {
    commit(types.UPDATE_TRAIN_SEAT_GROUP, payload)
  },
  updateLocalCity({ commit }, payload) {
    commit(types.UPDATE_LOCAL_CITY, payload)
  },
  updateServiceStatus({ commit }, payload) {
    commit(types.UPDATE_SERVICE_STATUS, payload)
  },
  updatePollingInterval({ commit }, payload) {
    commit(types.UPDATE_POLLING_INTERVAL, payload)
  }
}

// mutations
const mutations = {
  [types.UPDATE_POLLING_INTERVAL](state, data) {
    state.pollingInterval = data
  },
  [types.CHANGE_LOG_STATUS](state, data) {
    state.logged = data
  },
  [types.CHANGE_HEADER](state, data) {
    data = data || {}
    state.headerStatus = data.headerStatus || false
    // state.omegaKey = data.omegaKey || ''
    // state.omegaParams = data.omegaParams || {}
    // state.omegaName = data.omegaName || ''
  },
  [types.UPDATE_CITY_LIST](state, { cityList }) {
    // 处理汉字拼音首字母
    // eslint-disable-next-line
    cityList &&
      cityList.forEach(item => {
        item.stations.forEach(station => {
          station.jp = getJP(station.name)
        })
      })
    state.cityList = cityList
  },
  [types.UPDATE_HOT_CITY](state, { searchHotCity }) {
    state.searchHotCity = searchHotCity
  },
  [types.UPDATE_SERVICE_PHONE](state, { servicePhone }) {
    state.servicePhone = servicePhone
  },
  [types.UPDATE_SERVICE_DATA](state, { service_time_text }) {
    state.searchServiceText = service_time_text
  },
  [types.UPDATE_HOLIDAY](state, { holiday }) {
    state.holiday = holiday
  },
  [types.UPDATE_PRE_SALE_TIME](state, { preSaleTime }) {
    state.preSaleTime = preSaleTime
  },
  [types.UPDATE_12306](state, { account12306, isLogin12306 }) {
    state.account12306 = account12306
    state.isLogin12306 = isLogin12306
  },
  [types.UPDATE_THRESHOLD](state, data) {
    state.ticketNumThreshold = data
  },
  [types.UPDATE_WEBVIEW](state, { webView }) {
    state.webView = webView
    switch (webView) {
      case 'WeChat':
        state.isWeChat = true
        break
      case 'Alipay':
        state.isAliPay = true
        break
      case 'DIDI':
        state.isDidi = true
        break
      default:
      // do nothing
    }
  },
  [types.UPDATE_REFUND_NOTICE_STATUS](state, { refundNoticeStatus }) {
    state.refundNoticeStatus = refundNoticeStatus
  },
  [types.UPDATE_TRAIN_SEAT_GROUP](state, { trainSeatGroup }) {
    let obj = {}
    trainSeatGroup.forEach(item => {
      let seatInfo = {}
      item.chose_seat_info.forEach(seat => {
        seatInfo[seat.train_seat_type] = seat.chose_seat_group
      })
      obj[item.train_type] = seatInfo
    })
    state.trainSeatGroup = obj
  },
  [types.UPDATE_LOCAL_CITY](state, { localCity }) {
    state.localCity = localCity
  },
  [types.UPDATE_SERVICE_STATUS](state, { notServiceTime }) {
    state.notServiceTime = notServiceTime
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
