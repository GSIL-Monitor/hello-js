/*
 *author:songchao
 *date:2018-07-28
 */

import * as types from '../mutation-types';
import commonlibs, * as commonLibs from '../../utils/commonlibs';
import isBefore from 'date-fns/is_before';
import format from 'date-fns/format';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

let currentDate = new Date().BJDate();
const TRAVEL_LOG_KEY = 'travel_log';
const TRAVEL_LOG_OBJECT = 'travel_log_object';
const TRAIN_DATE = 'train_date';

const state = {
  start_station: '北京',
  start_station_code: 'BJP',
  end_station: '上海',
  end_station_code: 'SHH',
  searchButtonActive: false,
  train_date: format(currentDate, 'YYYY-MM-DD'),
  go_off: format(currentDate, 'MM月DD日'), //   出发日期
  day_name: commonLibs.returnDay(currentDate.getTime()), //  出发日期提示：今天/明天/周几
  trip_type_hsr: commonLibs.localDb().get('trip_type_hsr') == 'true' ? true : false, //  高铁
  trip_type_student: false, //   学生票
  travel_log: commonLibs.localDb().get(TRAVEL_LOG_KEY) ? commonLibs.localDb().get(TRAVEL_LOG_KEY).split(',') : [],
  travel_log_object: commonLibs.localDb().get(TRAVEL_LOG_OBJECT) ? JSON.parse(commonLibs.localDb().get(TRAVEL_LOG_OBJECT)) : []
};

const mutations = {
  [types.CHANGE_START_STATION](state, data) {
    state.start_station = data.name;
    state.start_station_code = data.code;
  },
  [types.CHANGE_END_STATE](state, data) {
    state.end_station = data.name;
    state.end_station_code = data.code;
  },
  [types.CHNAGE_GO_OFF](state, data) {
    state.go_off = commonLibs.returnDate(data.go_off);
    state.day_name = commonLibs.returnDay(data.go_off);
    state.train_date = data.go_off;
    commonLibs.localDb().set(TRAIN_DATE, state.train_date);
  },
  [types.SELECT_HSR_TYPE](state, data) {
    state.trip_type_hsr = data.trip_type_hsr;
    commonLibs.localDb().set('trip_type_hsr', data.trip_type_hsr);
    if (data.trip_type_hsr) {
      state.trip_type_student = !data.trip_type_hsr;
    }
  },
  [types.SELECT_STUDENT_TYPE](state, data) {
    state.trip_type_student = data.trip_type_student;
    if (data.trip_type_student) {
      state.trip_type_hsr = !data.trip_type_student;
    }
  },
  [types.EXCHANGE_DESTINATION](state, data) {
    [state.start_station, state.end_station] = [state.end_station, state.start_station];
    [state.start_station_code, state.end_station_code] = [state.end_station_code, state.start_station_code];
  },
  [types.EMPTY_TRAVEL_LOG](state, data) {
    state.travel_log = [];
    state.travel_log_object = [];
    commonLibs.localDb().set(TRAVEL_LOG_OBJECT, '');
    commonLibs.localDb().set(TRAVEL_LOG_KEY, '');
  },
  [types.RECORD_TRAVEL_LOG](state, data) {
    let log = `${data.start_station} - ${data.end_station}`;
    let log_obj = {
      start_station: data.start_station,
      end_station: data.end_station,
      start_station_code: data.start_station_code,
      end_station_code: data.end_station_code,
      uniq_key: log
    };
    if (state.travel_log[0] == log) {
      return;
    }
    state.travel_log.unshift(log);
    state.travel_log_object.unshift(log_obj);
    state.travel_log = uniq(state.travel_log);
    state.travel_log_object = uniqBy(state.travel_log_object, 'uniq_key');
    if (state.travel_log.length > 4) {
      state.travel_log.length = 4;
      state.travel_log_object.length = 4;
    }

    // let logLength = state.travel_log.length;
    // let max_length = 4;
    // let arr_index = 3;
    // if (logLength === max_length) {
    //   state.travel_log.length = arr_index;
    //   state.travel_log_object.length = arr_index;
    // }
    // state.travel_log.unshift(log);
    // state.travel_log_object.unshift(log_obj);

    commonLibs.localDb().set(TRAVEL_LOG_KEY, state.travel_log);
    commonLibs.localDb().set(TRAVEL_LOG_OBJECT, JSON.stringify(state.travel_log_object));
  },
  [types.CHANGE_TRAVEL_LOG](state, data) {
    let {
      obj,
      index
    } = data;
    state.travel_log_object.splice(index, 1);
    state.travel_log_object.splice(0, 0, obj);
    state.travel_log.splice(index, 1);
    state.travel_log.splice(0, 0, `${obj.start_station} - ${obj.end_station}`);
    commonLibs.localDb().set(TRAVEL_LOG_OBJECT, JSON.stringify(state.travel_log_object));
    commonLibs.localDb().set(TRAVEL_LOG_KEY, state.travel_log);
  },
  [types.INIT_STATION_INFO](state, data) {
    let log_obj = commonLibs.localDb().get(TRAVEL_LOG_OBJECT) ? JSON.parse(commonLibs.localDb().get(TRAVEL_LOG_OBJECT)) : [];
    let train_date = commonLibs.localDb().get(TRAIN_DATE);
    if (log_obj.length > 0) {
      let logItem = log_obj[0];
      state.start_station = logItem.start_station;
      state.start_station_code = logItem.start_station_code;
      state.end_station = logItem.end_station;
      state.end_station_code = logItem.end_station_code;
    }
    if (train_date) {
      if (isBefore(new Date(train_date), new Date())) {
        train_date = format(new Date(), 'YYYY-MM-DD');
        commonLibs.localDb().set(TRAIN_DATE, train_date);
      }
      state.go_off = commonLibs.returnDate(train_date);
      state.day_name = commonLibs.returnDay(train_date);
      state.train_date = train_date;
    }
  }
};

const getters = {
  start_station: state => state.start_station,
  start_station_code: state => state.start_station_code,
  end_station: state => state.end_station,
  end_station_code: state => state.end_station_code,
  go_off: state => state.go_off,
  day_name: state => state.day_name,
  trip_type_hsr: state => state.trip_type_hsr,
  trip_type_student: state => state.trip_type_student,
  travel_log: state => state.travel_log,
  travel_log_object: state => state.travel_log_object,
  train_date: state => state.train_date,
  searchButtonActive: state => state.searchButtonActive
};


/*
changeStartStation:变更出发车站
changeEndStation:变更到达车站
changeGoOff:变更出发日期
selectHsrType:勾选高铁票
selectStudentType:勾选学生票
exchangeDestination:出发站与到达站互换
fetchTravelLog:获取历史记录
emptyTravelLog:清空历史记录
setDestination:设置出发站与到达站
recordTravelLog:记录搜索日志
*/
const actions = {
  changeStartStation({
    commit
  }, payload) {
    commit(types.CHANGE_START_STATION, payload);
  },
  changeEndStation({
    commit
  }, payload) {
    commit(types.CHANGE_END_STATE, payload);
  },
  changeGoOff({
    commit
  }, payload) {
    commit(types.CHNAGE_GO_OFF, payload);
  },
  selectHsrType({
    commit
  }, payload) {
    commit(types.SELECT_HSR_TYPE, payload);
  },
  selectStudentType({
    commit
  }, payload) {
    commit(types.SELECT_STUDENT_TYPE, payload);
  },
  exchangeDestination({
    commit
  }, payload) {
    commit(types.EXCHANGE_DESTINATION, payload);
  },
  fetchTravelLog({
    commit
  }, payload) {
    commit(types.FETCH_TRAVEL_LOG, payload);
  },
  emptyTravelLog({
    commit
  }, payload) {
    commit(types.EMPTY_TRAVEL_LOG, payload);
  },
  setDestination({
    commit
  }, payload) {
    let {
      obj,
      index
    } = payload;
    let startStation = {
      name: obj.start_station,
      code: obj.start_station_code
    };
    let endStation = {
      name: obj.end_station,
      code: obj.end_station_code
    };
    commit(types.CHANGE_START_STATION, startStation);
    commit(types.CHANGE_END_STATE, endStation);
    // commit(types.CHANGE_TRAVEL_LOG, payload);
  },
  recordTravelLog({
    commit
  }, payload) {
    commit(types.RECORD_TRAVEL_LOG, payload);
  },
  initStationInfo({
    commit
  }, payload) {
    commit(types.INIT_STATION_INFO, payload);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
