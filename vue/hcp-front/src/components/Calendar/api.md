Props              | Type     | Default            | Required | Usage                                      | Description
------------------ | -------- | ------------------ | -------- | ------------------------------------------ | ------------------------------------
defaultSeletedDays | Array    |                    |          | ['2018-01-01', '2019-02-02']               | 默认选中的日期
startTime          | String   | '2018-07-23' 默认当天  | No       |                                            | 日历开始时间，YYYY-MM-DD
endTime            | String   | '2018-09-20'默认60天后 | No       |                                            | 日历结束时间-MM-DD
holiday            | Array    |                    | No       | `{'2018-01-01': '元旦', '2019-02-02': '春节'}` |
disabledTime       | Array    |                    | No       |                                            | 用法同holiday
badge              | Array    |                    | No       |                                            | 用法同holiday
multiple           | Boolean  | false              | No       |                                            | 是否多选，默认为false
multipleMax        | Number   | 4                  | No       |                                            | 多选模式下,最多可选个数
onPress            | Function |                    | No       | `callback(value)`                          | 配合multiple时，callback的value为当前选中的所有日期
