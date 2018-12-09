// 添加乘客相关
import * as types from '../mutation-types'

// state
const state = {
  scheduleLoading: false, // 加载状态
  scheduleData: [], // 经停信息
  scheduleNetErr: false, // 网络错误
}
// getters
const getters = {
  scheduleLoading: state => state.scheduleLoading,
  scheduleData: state => state.scheduleData,
  scheduleNetErr: state => state.scheduleNetErr,
}

// action
const actions = {
  updateScheduleLoading({
    commit
  }, payload) {
    commit(types.UPDATE_SCHEDULE_LOADING, payload)
  },
  updateScheduleData({
    commit
  }, payload) {
    commit(types.UPDATE_SCHEDULE_DATA, payload)
  },
  updateScheduleNetErr({
    commit
  }, payload) {
    commit(types.UPDATE_SCHEDULE_NETERR, payload)
  },
}

// mutations
const mutations = {
  [types.UPDATE_SCHEDULE_LOADING](state, {
    loading
  }) {
    state.scheduleLoading = loading
  },
  [types.UPDATE_SCHEDULE_DATA](state, data) {
    state.scheduleData = data
  },
  [types.UPDATE_SCHEDULE_NETERR](state, {
    netErr
  }) {
    state.scheduleNetErr = netErr
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
