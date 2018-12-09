/*
@desc: 预约抢票模块
@author: songchao
@date: 2018-08-06
*/

import * as types from '../mutation-types';
// import * as commonlibs from '../../utils/commonlibs';
import * as bizLibs from '../../utils/businesslibs';
import format from "date-fns/format";
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
const DEFAULT_VALUE = '推荐多选';
const DEADLINE_DEFAULT_VALUE = '推荐选择出发前一天';

export const state = {
  train_date_reservation: [], // 已选择的出发日期
  train_number: [], // 已选择的车次train_no
  train_code: [], // 已选择车次的train_code
  train_seat_type: [],
  isDatechanged: true, // 看日期是否变更，如果变更才有trainlist请求
  alternative_seat: [
    [],
    []
  ],
  deadline_date: DEADLINE_DEFAULT_VALUE,
  grap_end_time: '23:00',
  reservation_trainList: [],
  reservation_orginTrainlist: [],
  trainListShow: false, // 是否显示车次列表
  conditionShow: true, //
  train_infos: [],
  selectedTrainList: [],
  filterConditionReservation: {
    startHour: '06:00',
    endHour: '24:00',
    trainType: [1, 2, 3]
  },
  grabCreatOrderParms: {
    req_time: new Date().getTime(),
    pay_mode: 1, // 支付方式 1:预支付；2：免密支付
    grab_order_start_time: format(new Date().BJDate(), 'YYYYMMDDHHmmss'),
    grab_order_end_time: format(new Date().BJDate(), 'YYYYMMDDHHmmss'),
    passenger_phone: '',
    from_station_code: '',
    from_station_name: '',
    to_station_code: '',
    to_station_name: '',
    start_date: [],
    start_begin_time: '00:00',
    start_end_time: '24:00',
    train_infos: [],
    seat_type_names: [], // 一等座，二等座
    is_accept_standing: false, // 是否接受无座
    max_price: 0, // 最大票价
    passengers: []
  },
  grabDialog: {
    type: '',
    message: ''
  }
};

export const getters = {
  train_date_reservation: state => state.train_date_reservation,
  train_number: state => state.train_number,
  train_code: state => state.train_code,
  selectedTrainList: state => state.selectedTrainList,
  train_seat_type: state => state.train_seat_type,
  deadline_date: state => state.deadline_date,
  grap_end_time: state => state.grap_end_time,
  reservation_trainList: state => state.reservation_trainList,
  reservation_orginTrainlist: state => state.reservation_orginTrainlist,
  trainListShow: state => state.trainListShow,
  conditionShow: state => state.conditionShow,
  grabCreatOrderParms: state => state.grabCreatOrderParms,
  alternative_seat: state => state.alternative_seat,
  filterConditionReservation: state => state.filterConditionReservation,
  isDatechanged: state => state.isDatechanged,
  grabDialog: state => state.grabDialog
};

export const mutations = {
  [types.FETCH_TRAIN_LIST_GRAB](state, data) {
    let trainInfo = bizLibs.cleanTrainList(data.trainList);
    state.reservation_orginTrainlist = trainInfo.trainList;
    // 停运车次排序
    state.reservation_trainList = bizLibs.sortRunStatus(trainInfo.trainList);
  },
  [types.UPDATE_TRAINLIST_RESERVATION](state, data) {
    state.reservation_orginTrainlist[data.train_index].reservation_selected = !state.reservation_orginTrainlist[data.train_index].reservation_selected;
    state.selectedTrainList = bizLibs.getSelectedTrainList(state.selectedTrainList, state.reservation_orginTrainlist[data.train_index]);
  },
  [types.CHANGE_TRAIN_DATE_RESERVATION](state, data) {
    state.train_date_reservation = data;
  },
  [types.CHANGE_TRAIN_NUMBER_RESERVATION](state, data) {
    state.train_number = [];
    state.train_code = [];
    state.train_infos = [];
    state
      .selectedTrainList
      .forEach(train => {
        if (train.reservation_selected) {
          state.train_number.push(train.train_no);
          state.train_code.push(train.train_code);
          state
            .train_infos
            .push({
              train_no: train.train_no,
              train_code: train.train_code,
              train_type: train.train_type
            });
        }
      });
    console.log('state.train_number', state.train_number);
    console.log('state.train_code', state.train_code);
    state.grabCreatOrderParms = Object.assign({}, state.grabCreatOrderParms, {
      train_infos: state.train_infos
    });
  },
  [types.CLEAR_NUM_AND_SEAT](state, data) {
    state.train_number = [];
    state.train_code = [];
    state.train_seat_type = [];
    state.train_infos = [];
    state.selectedTrainList = [];
    state.grabCreatOrderParms = Object.assign({}, state.grabCreatOrderParms, {
      seat_type_names: []
    });
  },
  [types.CHANGE_TRAIN_SEAYTYPE_RESERVATION](state, data) {
    state.train_seat_type = data;
  },
  [types.CHANGE_DEADLINE_RESERVATION](state, data) {
    state.deadline_date = data[0];
    state.grap_end_time = data[1];
    state.grabCreatOrderParms.grab_order_end_time = format(`${state.deadline_date} ${state.grap_end_time}`, 'YYYYMMDDHHmmss')
  },
  [types.CHANGE_TRAINLIST_SHOW](state, data) {
    state.trainListShow = data;
    state.conditionShow = !data;
  },
  [types.CHANGE_TRAIN_CONDITION_SHOW](state, data) {
    state.conditionShow = data;
  },
  [types.UPDATE_GRAP_REQUEST_PARMS](state, data) {
    state.grabCreatOrderParms = Object.assign({}, state.grabCreatOrderParms, data);
  },
  [types.CHANGE_FILTER_CONDITION_VESERVATION](state, data) {
    state.filterConditionReservation = Object.assign({}, state.filterConditionReservation, data);
    console.log('state.filterConditionReservation', state.filterConditionReservation);
  },
  [types.FILTER_TRAIN_LIST_RESERVATION](state, data) {
    state.reservation_trainList = bizLibs.filterTrainListReservation(state.reservation_orginTrainlist, state.filterConditionReservation)
  },
  [types.FILTER_SEAT_FROM_TRAINLIST](state, data) {
    const HSR = ['G', 'D', 'C'];
    let seat_arr = [
      [],
      []
    ];
    let addSeat = (seat_info, index) => {
      seat_info.forEach(seat => {
        seat_arr[index].push({
          name: seat.name,
          price: seat.price,
          code: seat.code,
          active: ''
        });
      });
    }
    state.selectedTrainList.forEach(train => {
      if (train.reservation_selected) {
        let {
          seat_info,
          train_type
        } = train;

        if (HSR.includes(train_type)) {
          addSeat(seat_info, 0);
        } else if (!HSR.includes(train_type)) {
          addSeat(seat_info, 1);
        }
      }
    });
    state.alternative_seat = [
      uniqBy(seat_arr[0], 'name'),
      uniqBy(seat_arr[1], 'name')
    ];
  },
  [types.UPDATE_RESERVATION_SEAT](state, data) {
    state.alternative_seat = data;
  },
  [types.CHANGE_RESERVATION_SEAT](state, data) {
    state.alternative_seat = [
      [],
      []
    ];
    if (['G', 'C', 'D'].includes(data.train_type)) {
      data.seatInfo.forEach(seat => {
        state.alternative_seat[0].push({
          name: seat.name,
          price: seat.price,
          code: seat.code,
          active: data.selected_seat.includes(seat.name) ? 'active' : ''
        });
      });
    } else {
      data.seatInfo.forEach(seat => {
        state.alternative_seat[1].push({
          name: seat.name,
          price: seat.price,
          code: seat.code,
          active: data.selected_seat.includes(seat.name) ? 'active' : ''
        });
      });
    }
  },
  [types.RESTORE_SEAT_STATUS](state, data) {
    state.alternative_seat.forEach(arr => {
      arr.forEach(element => {
        if (state.grabCreatOrderParms.seat_type_names.includes(element.name)) {
          element.active = 'active';
        }
      });
    });
  },
  [types.CHANGE_SEAT_SELECTED_STATUS](state, data) {
    let active = state.alternative_seat[data[0]][data[1]].active;
    if (active == 'active') {
      state.alternative_seat[data[0]][data[1]].active = '';
    } else {
      state.alternative_seat[data[0]][data[1]].active = 'active';
    }
    console.log('state.alternative_seat', state.alternative_seat);
  },
  [types.EXCHANGE_GRAB_DESTINATION](state, data) {
    [state.grabCreatOrderParms.from_station_code, state.grabCreatOrderParms.to_station_code] = [state.grabCreatOrderParms.to_station_code, state.grabCreatOrderParms.from_station_code];
    [state.grabCreatOrderParms.from_station_name, state.grabCreatOrderParms.to_station_name] = [state.grabCreatOrderParms.to_station_name, state.grabCreatOrderParms.from_station_name];

    state.train_code = [];
    state.grabCreatOrderParms.train_infos = [];
    state.grabCreatOrderParms.seat_type_names = [];
    state.grabCreatOrderParms.max_price = 0;
    state.isDatechanged = true;
  },
  [types.CHANGE_GRAB_TRAIN_INFO](state, data) {
    state.train_number = data.train_number;
    state.train_code = data.train_code;
  },
  [types.CHANGE_IS_DATECHANGED](state, data) {
    state.isDatechanged = data;
  },
  [types.CHANGE_GRAB_DIALOG](state, {
    type,
    message
  }) {
    state.grabDialog = {
      type,
      message
    }
  },
  [types.UPDATE_RES_ORI_TRAIN_LIST](state, data) {
    state.reservation_orginTrainlist = data
  },
  [types.UPDATE_SELECT_TRAIN_LIST](state, data) {
    state.selectedTrainList = data
  }
};

export const actions = {
  fetchReservationTrainlist({
    commit
  }, payload) {
    commit(types.FETCH_TRAIN_LIST_GRAB, payload);
  },
  updateReservationTrainList({
    commit
  }, payload) {
    commit(types.UPDATE_TRAINLIST_RESERVATION, payload);
    commit(types.CHANGE_TRAIN_NUMBER_RESERVATION, payload);
    // commit(types.FILTER_SEAT_FROM_TRAINLIST, payload);
  },
  changeTrainDateReservation({
    commit
  }, payload) {
    commit(types.CHANGE_TRAIN_DATE_RESERVATION, payload);
  },
  filterSeatFromTrainList({
    commit
  }, payload) {
    commit(types.FILTER_SEAT_FROM_TRAINLIST, payload);
  },
  changeTrainNumberReservation({
    commit
  }, payload) {
    commit(types.CHANGE_TRAIN_NUMBER_RESERVATION, payload);
  },
  restoreSeatStatus({
    commit
  }, payload) {
    commit(types.RESTORE_SEAT_STATUS, payload);
  },
  clearNumAndSeat({
    commit
  }, payload) {
    commit(types.CLEAR_NUM_AND_SEAT, payload);
  },
  changeTrainSeattypeReservation({
    commit
  }, payload) {
    commit(types.CHANGE_TRAIN_SEAYTYPE_RESERVATION, payload);
  },
  changeDeadlineReservation({
    commit
  }, payload) {
    commit(types.CHANGE_DEADLINE_RESERVATION, payload);
  },
  changeTrainListShow({
    commit
  }, payload) {
    commit(types.CHANGE_TRAINLIST_SHOW, payload);
  },
  changeTrainConditionShow({
    commit
  }, payload) {
    commit(types.CHANGE_TRAIN_CONDITION_SHOW, payload);
  },
  changeRequestParms({
    commit
  }, payload) {
    commit(types.UPDATE_GRAP_REQUEST_PARMS, payload);
  },
  fetchFilterTrainList({
    commit
  }, payload) {
    commit(types.FILTER_TRAIN_LIST_RESERVATION, payload);
  },
  updateFilterCondition({
    commit
  }, payload) {
    commit(types.CHANGE_FILTER_CONDITION_VESERVATION, payload);
  },
  changeSeatSelectedStatus({
    commit
  }, payload) {
    commit(types.CHANGE_SEAT_SELECTED_STATUS, payload);
  },
  exchangeGrabDestination({
    commit
  }, payload) {
    commit(types.EXCHANGE_GRAB_DESTINATION, payload);
  },
  changeGrabTrainInfo({
    commit
  }, payload) {
    commit(types.CHANGE_GRAB_TRAIN_INFO, payload);
  },
  changeIsDateChanged({
    commit
  }, payload) {
    commit(types.CHANGE_IS_DATECHANGED, payload);
  },
  changeGrabDialog({
    commit
  }, payload) {
    commit(types.CHANGE_GRAB_DIALOG, payload)
  },
  changeReservationSeat({
    commit
  }, payload) {
    commit(types.CHANGE_RESERVATION_SEAT, payload);
  },
  updateReservationSeat({
    commit
  }, payload) {
    commit(types.UPDATE_RESERVATION_SEAT, payload);
  },
  updateReservationOrginTrainlist({
    commit
  }, payload) {
    commit(types.UPDATE_RES_ORI_TRAIN_LIST, payload)
  },
  updateSelectedTrainList({
    commit
  }, data) {
    commit(types.UPDATE_SELECT_TRAIN_LIST, data)
    data.forEach(item => {
      commit(types.CHANGE_TRAIN_NUMBER_RESERVATION, item)
    })
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
