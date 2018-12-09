export const Adult_Ticket_Code = 1
export const Adult_Ticket_Text = '成人票'
export const Child_Ticket_Code = 2
export const Child_Ticket_Text = '儿童票'
export const Stu_Ticket_Code = 3
export const Std_Ticket_Text = '学生票'

export const formatTicketType = function(val) {
  let map = {
    [Adult_Ticket_Code]: Adult_Ticket_Text,
    [Child_Ticket_Code]: Child_Ticket_Text,
    [Stu_Ticket_Code]: Std_Ticket_Text
  }
  return map[val]
}


export const Lonely_Child_Text = '儿童不能单独乘车，请选择同行成人'
export const Max_Passenger_Text = '每单最多添加5个人，超过5个人请分批下单'
export const No_Passenger_Text = '您还没选择乘车人，请重新选择'
