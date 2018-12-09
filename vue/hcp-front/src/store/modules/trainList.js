/*
@desc:车次检索列表module
@author:songchao, huangzhijingpoint
@date: 2018-08-02
*/

import * as types from '../mutation-types'
import * as bizLibs from '../../utils/businesslibs'

const state = {
  trainList: [],
  orginTrainlist: [],
  trainDate: '',
  toStationCode: 'SHH',
  fromStationCode: 'BJP',
  fromStation: '北京',
  toStation: '上海',
  fromStationList: [],
  toStationList: [],
  seatType: [],
  trainListFirstLoad: true,
  hasHSR: true,
  filterCondition: {
    trainType: 0,
    trainDateType: 0,
    hasTicket: false,
    multiFilter: {
      selectedStartStation: [],
      selectedEndStation: [],
      selectedSeatType: []
    }
  }
}

const getters = {
  trainDate: state => state.trainDate,
  trainList: state => state.trainList,
  orginTrainlist: state => state.orginTrainlist,
  toStationCode: state => state.toStationCode,
  toStation: state => state.toStation,
  fromStationCode: state => state.fromStationCode,
  fromStation: state => state.fromStation,
  fromStationList: state => state.fromStationList,
  toStationList: state => state.toStationList,
  seatType: state => state.seatType,
  hasHSR: state => state.hasHSR,
  filterCondition: state => state.filterCondition,
  trainListFirstLoad: state => state.trainListFirstLoad
};

const actions = {
  updateFirstLoadStatus({
    commit
  }, payload) {
    commit(types.UPDATE_FIRSTLOAD_STATUS, payload)
  },
  fetchTrainList({
    commit
  }, payload) {
    commit(types.FETCH_TRAIN_LIST, payload)
  },
  filterByTrainDate({ commit }, payload) {
    // abandon
    commit(types.FILTER_BY_TRAIN_DATE, payload)
  },
  filterBySeatType({ commit }, payload) {
    // abandon
    commit(types.FILTER_BY_SEAT_TYPE, payload)
  },
  filterByCouponNum({ commit }, payload) {
    // abandon
    commit(types.FILTER_BY_COUPON_NUM, payload)
  },
  changeTrainDate({ commit }, payload) {
    commit(types.CHANGE_TRAIN_DATE, payload)
  },
  changeFilterCondition({ commit }, payload) {
    commit(types.CHANGE_FILTER_CONDITION, payload)
  },
  changeStationinfo({ commit }, payload) {
    commit(types.CHANGE_STATION_INFO, payload)
  },
  multiFilterTrainList({ commit }, payload) {
    commit(types.MULTI_FILETER, payload)
  }
}

const mutations = {
  [types.FETCH_TRAIN_LIST](state, data) {
    console.log(data, '=--00-0--')
    let trainInfo = bizLibs.cleanTrainList(data.trainList)
    console.log(trainInfo, '=--traininfo')
    state.orginTrainlist = trainInfo.trainList
    state.trainList = trainInfo.trainList
    state.fromStationList = trainInfo.fromStation
    state.toStationList = trainInfo.toStation
    state.seatType = trainInfo.seatType
    state.hasHSR = trainInfo.hasHSR
  },
  [types.CHANGE_STATION_INFO](state, data) {
    state.fromStationCode = data.fromStationCode
    state.toStationCode = data.toStationCode
    state.fromStation = data.fromStation
    state.toStation = data.toStation
  },
  [types.CHANGE_TRAIN_DATE](state, data) {
    state.trainDate = data
  },
  [types.FILTER_BY_TRAIN_DATE](state, data) {
    // abandon
    state.trainList = bizLibs.sortTrainList(state.trainList, data)
  },
  [types.FILTER_BY_SEAT_TYPE](state, data) {
    // abandon
    state.trainList = bizLibs.filterByTrainType(state.orginTrainlist, data)
  },
  [types.FILTER_BY_COUPON_NUM](state, data) {
    // abandon
    state.trainList = bizLibs.sortBySeatCount(state.trainList)
  },
  [types.MULTI_FILETER](state, data) {
    // state.trainList = bizLibs.filterTrainList(state.orginTrainlist, data);
    let { trainType, trainDateType, hasTicket, multiFilter } = state.filterCondition
    state.trainList = bizLibs.filterTrainListMultiply(
      state.orginTrainlist,
      trainType,
      trainDateType,
      multiFilter,
      hasTicket
    )
  },
  [types.CHANGE_FILTER_CONDITION](state, data) {
    state.filterCondition = Object.assign({}, state.filterCondition, data);
    console.log(state.filterCondition);
  },
  [types.UPDATE_FIRSTLOAD_STATUS](state, data) {
    state.trainListFirstLoad = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
