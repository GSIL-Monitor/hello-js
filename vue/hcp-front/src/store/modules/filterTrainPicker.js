/*
@desc:车次综合筛选条件组件
@author:songchao
@date: 2018-07-30
*/

import * as types from '../mutation-types'

// state
const state = {
  showFilterPicker: false,
  showTrainTypePicker: false,
  showTravelTimePicker: false,
  StartStation: [],
  EndStation: [],
  SeatType: [],
  selectedStartStation: [],
  selectedEndStation: [],
  selectedSeatType: []
}
// getters
const getters = {
  showFilterPicker: state => state.showFilterPicker,
  showTrainTypePicker: state => state.showTrainTypePicker,
  showTravelTimePicker: state => state.showTravelTimePicker,
  StartStation: state => state.StartStation,
  EndStation: state => state.EndStation,
  SeatType: state => state.SeatType,
  selectedStartStation: state => state.selectedStartStation,
  selectedEndStation: state => state.selectedEndStation,
  selectedSeatType: state => state.selectedSeatType
}

// action
const actions = {
  changeFilterPickerStatus({
    commit
  }, payload) {
    commit(types.CHANGE_FILTERTRAINPICKER_STATUS, payload);
  },
  changeTrainTypePickerStatus({
    commit
  }, payload) {
    commit(types.CHANGE_TRAINTYPEPICKER_STATUS, payload);
  },
  changeTravelTimePickerStatus({
    commit
  }, payload) {
    commit(types.CHANGE_TRAVELTIMEPICKER_STATUS, payload);
  },
  setStartStation({
    commit
  }, payload) {
    commit(types.SET_STARTSTATION, payload);
  },
  setEndStation({
    commit
  }, payload) {
    commit(types.SET_ENDSTATION, payload);
  },
  setSeatType({
    commit
  }, payload) {
    commit(types.SET_SEATTYPE, payload);
  },
  setSelectedStartStation({
    commit
  }, payload) {
    commit(types.SET_SELECTEDSTARTSTATION, payload);
  },
  setSelectedEndStation({
    commit
  }, payload) {
    commit(types.SET_SELECTEDENDSTATION, payload);
  },
  setSelectedSeatType({
    commit
  }, payload) {
    commit(types.SET_SELECTEDSEATTYPE, payload);
  }
}

// mutations
const mutations = {
  [types.CHANGE_FILTERTRAINPICKER_STATUS](state, data) {
    state.showFilterPicker = data;
  },
  [types.CHANGE_TRAINTYPEPICKER_STATUS](state, data) {
    state.showTrainTypePicker = data;
    // console.log(state.showTrainTypePicker);
  },
  [types.CHANGE_TRAVELTIMEPICKER_STATUS](state, data) {
    state.showTravelTimePicker = data;
    // console.log(state.showTravelTimePicker);
  },
  [types.SET_STARTSTATION](state, data) {
    state.StartStation = data;
  },
  [types.SET_ENDSTATION](state, data) {
    state.EndStation = data;
  },
  [types.SET_SEATTYPE](state, data) {
    state.SeatType = data;
  },
  [types.SET_SELECTEDSTARTSTATION](state, data) {
    state.selectedStartStation = [];
    data.forEach(element => {
      if (element.active) {
        state.selectedStartStation.push(element);
      }
    });
    // console.log(state.selectedStartStation);
  },
  [types.SET_SELECTEDENDSTATION](state, data) {
    state.selectedEndStation = [];
    data.forEach(element => {
      if (element.active) {
        state.selectedEndStation.push(element);
      }
    });
    // console.log(state.selectedEndStation);
  },
  [types.SET_SELECTEDSEATTYPE](state, data) {
    state.selectedSeatType = [];
    data.forEach(element => {
      if (element.active) {
        state.selectedSeatType.push(element);
      }
    });
    // console.log(state.selectedSeatType);
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
