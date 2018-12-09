/*
@desc:火车票筛选相关的处理逻辑
@author:songchao
@date:2018-07-30
*/


/*
@desc:遍历数据，插入一些冗余字段，如把耗时，开始时间，结束时间换算一下，方便排序
@parms: trainList [Array]
@return: trainList [Array]
*/

import uniq from 'lodash/uniq';

let convertToMin = (time) => {
  let arr = time.split(':');
  return arr[0] * 60 + arr[1] * 1;
};

let sumSeat = seatInfo => {
  let seatkyes = Object.keys(seatInfo);
  let sum = 0;
  seatkyes.forEach(element => {
    let _num = seatInfo[element].num;
    switch (_num) {
      case '有':
        sum += 20;
        break;
      case '无':
        sum += 0;
        break;
      default:
        sum += (seatInfo[element].num - 0);
        break;
    }
  });
  return sum;
};
export const cleanTrainList = (trainList) => {
  let startStationSet = new Set();
  let endStationSet = new Set();
  let seatTypeSet = new Set();
  // eslint-disable-next-line
  trainList && trainList.forEach((element, index) => {
    element.reservation_selected = false;
    element.run_time_min = convertToMin(element.run_time);
    element.start_time_min = convertToMin(element.start_time);
    element.arrive_time_min = convertToMin(element.arrive_time);
    element.coupon_num = sumSeat(element.seat_info);
    element.train_index = index;
    startStationSet.add(JSON.stringify({
      name: element.from_station_name,
      code: element.from_station_code
    }));
    endStationSet.add(JSON.stringify({
      name: element.to_station_name,
      code: element.to_station_code
    }));
    let {
      seat_info
    } = element;
    seat_info.forEach(seat => {
      let item = {
        code: seat.code,
        name: seat.name
      };
      seatTypeSet.add(JSON.stringify(item));
    });
  });
  // console.log(trainList);
  // 判断是否包含高铁
  let hasHSR = trainList.some((item) => {
    return ['G', 'C', 'D'].includes(item.train_type);
  });
  return {
    hasHSR: hasHSR,
    trainList: trainList,
    fromStation: uniq([...startStationSet]).map(item => JSON.parse(item)),
    toStation: uniq([...endStationSet]).map(item => JSON.parse(item)),
    seatType: uniq([...seatTypeSet]).map(item => JSON.parse(item))
  };
};


/*
@desc:对检索结果进行排序
@parms: trainList [Array]
@parms: type [Int]  0:最早出发，1:最晚出发, 2:耗时最短
@return: trainList [Array]
*/
export const sortTrainList = (trainList, type = 0) => {
  switch (type) {
    case 0:
      trainList.sort((a, b) => {
        return a.start_time_min < b.start_time_min ? -1 : 1;
      });
      break;
    case 1:
      trainList.sort((a, b) => {
        return a.start_time_min > b.start_time_min ? -1 : 1;
      });
      break;
    case 2:
      trainList.sort((a, b) => {
        return a.run_time_min < b.run_time_min ? -1 : 1;
      });
      break;
    default:
      break;
  }
  return trainList;
};

export const sortRunStatus = (trainList) => {
  // 排完序以后把停运车次拿出来放到数组末尾去
  // 注意: 尽量不要在遍历时同时去splice(删除、新增)数组中的元素
  let stopRunTrainList = [];
  let len = trainList.length;
  for (let index = 0; index < len; index++) {
    let element = trainList[index];
    if (element.run_status == 0) {
      stopRunTrainList.push(element);
      delete trainList[index];
    }
  }
  trainList = trainList.filter((element, index) => {
    return typeof element != 'undefined';
  });
  return trainList.concat(stopRunTrainList);
};


/*
@desc:对检索结果进行按出发时间排序
@parms: trainList [Array]
@parms: startHour [String] 08:00
@parms: endHour [String] 12:00
@return: trainList[Array]
*/
export const sortByStartTime = (trainList, startHour, endHour) => {
  let startHourMin = convertToMin(startHour);
  let endHourMin = convertToMin(endHour);
  let fileterResult = [];
  fileterResult = trainList.filter(element => {
    return (element.start_time_min >= startHourMin && element.start_time_min <= endHourMin);
  });
  return fileterResult;
};

/*
@desc:有票优先
@parms: trainList [Array]
@return: trainList [Array]
*/
export const sortBySeatCount = trainList => {
  let fileterResult = [];
  fileterResult = trainList.filter(element => {
    return element.coupon_num > 0;
  });
  fileterResult = fileterResult.sort((a, b) => {
    return a.coupon_num > b.coupon_num ? -1 : 1;
  });
  // console.log(fileterResult);
  return fileterResult;
};


/*
@desc:根据车型筛选
@parms: trainList [Array]
@parms: type [Int]   0: 全部车型，1:特快/直达，2: 高铁 , 3: 其他
@return: trainList [Array]
*/
export const filterByTrainType = (trainList, type = 0) => {
  const TZ = ['T', 'Z'];
  const HSR = ['G', 'D', 'C'];
  let fileterResult = trainList;
  switch (type) {
    case 1:
      fileterResult = trainList.filter((element) => {
        return TZ.includes(element.train_type);
      });
      break;
    case 2:
      fileterResult = trainList.filter((element) => {
        return HSR.includes(element.train_type);
      });
      break;
    case 3:
      fileterResult = trainList.filter((element) => {
        return !HSR.concat(TZ).includes(element.train_type);
      });
      break;
    case 4:
      fileterResult = [];
      fileterResult = fileterResult.concat(trainList.filter((element) => {
        return HSR.includes(element.train_type);
      }), trainList.filter((element) => {
        return TZ.includes(element.train_type);
      }), trainList.filter((element) => {
        return !HSR.concat(TZ).includes(element.train_type);
      }));
      break;
    default:
      break;
  }
  return fileterResult;
};

/*
@desc:对检索结果进行筛选,综合筛选
@parms: trainList [Array]
@parms: start_station_code [String]
@parms: end_station_code [String]
@parms: seat_type_code [String]
@return: trainList [Array]
*/
export const filterTrainList = (trainList, multiFilter) => {
  let fileterResult = [];
  let startStationCode = multiFilter.selectedStartStation.map(element => element.code);
  let endStationCode = multiFilter.selectedEndStation.map(element => element.code);
  let seatTypeCode = multiFilter.selectedSeatType.map(element => element.code);
  fileterResult = trainList.filter(element => {
    return (startStationCode.length > 0 ? startStationCode.includes(element.from_station_code) : element) && (endStationCode.length > 0 ? endStationCode.includes(element.to_station_code) : element);
  });

  let lastResult = [];
  if (seatTypeCode.length > 0) {
    fileterResult.forEach(element => {
      let {
        seat_info
      } = element;
      for (let i = 0; i < seat_info.length; i++) {
        let key = seat_info[i].code;
        for (let j = 0; j < seatTypeCode.length; j++) {
          if (key == seatTypeCode[j] && seat_info[i].num != '无') {
            lastResult.push(element);
            break;
          }
        }
      }
    });
  }
  return lastResult.length > 0 ? lastResult : fileterResult;
};

/*
@desc:综合排序，筛选条件为和的关系，选择其中一个条件后另外一个筛选条件是在之前的筛选结果之上筛选
@parms: trainList [Array]
@parms: trainType [Int]
@parms: trainDateType [Int]
@parms: multiFilter [Object]
@parms: hasTicket [Boolean]
@result: trainList after filter [Array]
*/
export const filterTrainListMultiply = (trainList, trainType = 0, trainDateType = 0, multiFilter = {}, hasTicket = false) => {
  if (hasTicket) {
    trainList = sortBySeatCount(trainList);
  }
  trainList = filterTrainList(trainList, multiFilter);
  trainList = filterByTrainType(trainList, trainType);
  if (trainType != 4) {
    trainList = sortTrainList(trainList, trainDateType);
  }
  trainList = sortRunStatus(trainList);
  return trainList;
};

export const filterTrainListReservation = (trainList, filterCondition) => {
  let {
    startHour,
    endHour,
    trainType
  } = filterCondition;
  if (trainType.length === 3 || trainType.length === 0) {
    trainList = filterByTrainType(trainList, 0);
  } else {
    let temp = [];
    trainType.forEach(type => {
      temp = filterByTrainType(trainList, parseInt(type, 10)).concat(temp);
    });
    trainList = temp;
  }
  trainList = sortByStartTime(trainList, startHour, endHour);
  trainList = sortRunStatus(trainList);
  return trainList;
};


/*
@desc:抢票被选中车次列表
@parms: [Array] trainList  选中的车次列表集合
@parms: [Object] train
@return: [Array] trainList 选中的车次列表集合
*/
export const getSelectedTrainList = (trainList, train) => {
  let len = trainList.length;
  let hitCount = 0;
  for (let i = 0; i < len; i++) {
    let element = trainList[i];
    if (element.train_code == train.train_code) {
      if (!train.reservation_selected) {
        trainList.splice(i, 1);
      }
      hitCount++;
      break;
    }
  }
  if (hitCount === 0) {
    trainList.push(train)
  }
  return trainList;
}

export const getTrainInfo = (trainList, train) => {
  let len = trainList.length;
  for (let i = 0; i < len; i++) {
    let element = trainList[i];
    if (element.train_code == train.train_code) {
      return i;
    }
  }
  return -1;
}

export default {
  cleanTrainList,
  sortTrainList,
  filterTrainList,
  filterByTrainType,
  sortByStartTime,
  sortBySeatCount,
  filterTrainListMultiply,
  filterTrainListReservation,
  getSelectedTrainList,
  getTrainInfo,
  sortRunStatus
};
