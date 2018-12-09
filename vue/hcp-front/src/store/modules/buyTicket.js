import * as types from '../mutation-types'

// state
const state = {
  dialogShow: false,
  dialogType: '',
  dialogMessage: '',
  orderId: null,
  seatStatus: '',
  orderDetail: {},
  coupon: 0
}
// getters
const getters = {
  dialogShow: state => state.dialogShow,
  dialogType: state => state.dialogType,
  dialogMessage: state => state.dialogMessage,
  orderId: state => state.orderId,
  seatStatus: state => state.seatStatus,
  orderDetail: state => state.orderDetail,
  coupon: state => state.coupon
}

// action
const actions = {
  changeDialog({ commit }, payload) {
    commit(types.CHANGE_DIALOG, payload)
  },
  updateOrderId({ commit }, payload) {
    commit(types.UPDATE_ORDER_ID, payload)
  },
  updateSeatStatus({ commit }, payload) {
    commit(types.UPDATE_SEAT_STATUS, payload)
  },
  updateOrderDetail({ commit }, payload) {
    commit(types.UPDATE_ORDER_DATEIL, payload)
  },
  updateCoupon({ commit }, payload) {
    commit(types.UPDATE_COUPON, payload)
  }
}

// mutations
const mutations = {
  [types.CHANGE_DIALOG](state, { type, show, message }) {
    state.dialogType = type
    state.dialogShow = show
    state.dialogMessage = message
  },
  [types.UPDATE_ORDER_ID](state, { orderId }) {
    state.orderId = orderId
  },
  [types.UPDATE_SEAT_STATUS](state, { seatStatus }) {
    state.seatStatus = seatStatus
  },
  [types.UPDATE_ORDER_DATEIL](state, { orderDetail }) {
    state.orderDetail = orderDetail
  },
  [types.UPDATE_COUPON](state, { coupon }) {
    state.coupon = +coupon
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
