/*
desc:common libs
author:songchao huangzhijingpoint
date:2018-07-30
*/
/*
@description:返回今天是周几，近两天返回明天/后天，其他返回周几
@parms date [String] 目标日期 '2018-09-10'
@return [String] 返回周几
*/
import differenceInDays from 'date-fns/difference_in_days'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import format from 'date-fns/format'

Date.prototype.BJDate = function(opts) {
  let obj
  switch (true) {
    case typeof opts == 'undefined':
      obj = getBJDate()
      break;
    // ts: 1453094034000
    case typeof opts == 'number' && opts.toString().length == 13:
      obj = getBJDate(opts)
      break;
    // datestring: 2018-09-02 / 2018/02/03
    case typeof opts == 'string':
      obj = getBJDate(new Date(opts).getTime())
      break;
    // new Date()
    default:
      obj = getBJDate(opts.getTime())
      break;
  }
  return obj
}

export const returnDay = (date) => {
  let currentDate = new Date().BJDate()
  let targetDate = new Date().BJDate(date)
  let targetday = new Date().BJDate(date).getDay();
  var diff = differenceInCalendarDays(targetDate, currentDate);
  const _str = '今明后';
  const dayString = '日一二三四五六';
  if (diff >= 0 && diff < 3) {
    return `${_str.charAt(diff)}天`;
  }
  return `周${dayString.charAt(targetday)}`;
};

// local-Ts to Beijing-Ts
export const getBJDate = (ts) => {
  let timezone = 8 // 目标时区时间，东八区
  // 由于部分地区存在夏令时，所以不能直接new Date().getTimezoneOffset，而是需要根据传入的时间判断
  let offset_GMT = ts ? new Date(ts).getTimezoneOffset() : new Date().getTimezoneOffset()// 本地区该时间点和格林威治时间的时间差，单位分钟
  let nowDateTs = ts || new Date().getTime() // 本地时间距离1970年1月1日午夜（GMT）之间的毫秒数
  let perMinMillSeconds = 60 * 1000 // 每分钟的毫秒数
  // 先将时间转换为格林威治时间，再转换为东八时间
  let targetDate = new Date(nowDateTs + offset_GMT * perMinMillSeconds + timezone * 60 * perMinMillSeconds)
  return targetDate
}

export const formatBJ = (data, opts) => {
  // format支持的输入太多样了，所以不像Date.protytype.BJDate一样对输入类型枚举，以防有没考虑到的边界case
  // 例如20180202在format中是合法的，而作为new Date输入则非法
  // 仅当输入为ts格式时，进行处理，确保format输入为ts时，输出对应北京时间的字面量（免受系统时区影响）
  if (typeof data == 'number' && data.toString().length == 13) {
    return format(getBJDate(data), opts)
  }
  if (Object.prototype.toString.call(data).slice(8, -1) == 'date') {
    return format(getBJDate(data.getTime()), opts)
  }
  return format(data, opts)
}

// 20181201123000 => 2018-12-01 11:23:00
export const formatTimeStr = (num) => {
  let str = '' + num
  let year = str.slice(0, 4),
    mon = str.slice(4, 6),
    day = str.slice(6, 8),
    hour = str.slice(8, 10),
    min = str.slice(10, 12),
    sec = str.slice(12, 14)
  return `${year}-${mon}-${day} ${hour}:${min}:${sec}`
}

/*
@description:格式化日期
@parms fmt [String] 日期格式
@parms date [Date] 需要格式化的日期
@return [String] 格式化后的日期
*/
export const formatterDate = (date = new Date(), fmt = 'yyyy-MM-dd') => {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};

/*
@desc:返回几月几日
@parms dateString [String] 需要格式化的日期
@return [String] 格式化后的日期
*/
export const returnDate = (dateString) => {
  let date = new Date().BJDate(dateString)
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};


/*
@desc:返回几小时几分
@params HMString [String] 09:56
@return [string] '9时56分'
*/
export const returnHourMin = (HMString) => {
  if (HMString) {
    let str = HMString.split(':')
    return `${Number(str[0])}时${str[1]}分`
  }
  return ''
}

/*
@desc:根据出发日期+列车运行时间，返回列车到达日期
@params startDate [String] 2018-09-20
@params runTime [String] 04:20
@return [Date]
*/

// export const calEndDate = (startDate, startTime, runTime) => {
//   let start = new Date(startDate + ' ' + startTime).valueOf()
//   let runTimeArr = runTime.split(':')
//   let runTimeHour = runTimeArr[0]
//   let runTimeMin = runTimeArr[1]
//   let milliSeconds = (60 * 60 * runTimeHour + 60 * runTimeMin) * 1000
//   let endTime = start + milliSeconds
//   return new Date(endTime)
// }

/*
@desc:根据服务端返回票数量信息，返回需要显示的文本
*/
export const noTicketText = '无票'
export const hasTicketText = '有票'
export const formatTicketNumText = (data) => {
  let result = "";
  let hasTicket = '有'
  let noTicket = '无'
  let showNum = /\d/
  if (showNum.test(data)) {
    result = data + "张";
  } else if (data.includes(hasTicket)) {
    result = hasTicketText;
  } else {
    result = noTicketText;
  }
  return result;
}

/*
@desc:localStorage的操作
@parms:key [String]
@parms:value [String]
*/
export const localDb = (key, value) => {
  return {
    get(key) {
      return localStorage.getItem(key);
    },
    set(key, value) {
      localStorage.setItem(key, value);
      return value;
    },
    remove(key) {
      localStorage.removeItem(key);
      return {
        key: value
      };
    }
  };
};


export default {
  returnDay,
  formatterDate,
  returnDate,
  localDb
};
