// 添加乘客相关
import * as types from '../mutation-types'
import { getJP } from '@/utils/pinyin.js';

// state
const state = {
  contactList: [], // 当前用户常用联系人
  passengers: [], // 当前已添加的乘客信息
  passengerPhone: '', // 联系方式,
  contact: {
    name: '',
    number: ''
  },
  countryList: [], // 国家地区列表
}
// getters
const getters = {
  passengers: state => state.passengers,
  contactList: state => state.contactList,
  passengerPhone: state => state.passengerPhone,
  contact: state => state.contact,
  countryList: state => state.countryList
}

// action
const actions = {
  updatePassengers({
    commit
  }, payload) {
    commit(types.UPDATE_PASSENGERS, payload)
  },
  updateContact({
    commit
  }, payload) {
    commit(types.UPDATE_CONTACT, payload)
  },
  updateContactInfo({
    commit
  }, payload) {
    commit(types.UPDATE_CONTACT_INFO, payload);
  },
  updatePhone({
    commit
  }, payload) {
    commit(types.UPDATE_PHONE, payload)
  },
  updateCountryList({
    commit
  }, payload) {
    commit(types.UPDATE_COUNTRY_LIST, payload)
  }
}

// mutations
const mutations = {
  [types.UPDATE_PASSENGERS](state, {
    passengers
  }) {
    state.passengers = passengers
  },
  [types.UPDATE_CONTACT](state, data) {
    state.contactList = data
  },
  [types.UPDATE_PHONE](state, {
    passengerPhone
  }) {
    state.passengerPhone = passengerPhone
  },
  [types.UPDATE_CONTACT_INFO](state, data) {
    state.contact = Object.assign({}, state.contact, data)
  },
  [types.UPDATE_COUNTRY_LIST](state, data) {
    // 处理汉字拼音首字母
    // eslint-disable-next-line
    data && data.forEach(item => {
      item.countries.forEach(country => {
        country.jp = getJP(country.name)
      })
    })
    state.countryList = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
