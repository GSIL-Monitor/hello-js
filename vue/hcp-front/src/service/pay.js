import api from 'service/api'
import { UA } from 'utils/userAgent.js'

// 创建支付组件挂载的dom节点，单独设置font-size，否则尺寸不对
const getPayElement = () => {
  let ele = document.querySelector('.train-pay-wrapper')
  if (!ele) {
    let wrapper = document.createElement('div')
    wrapper.className = 'train-pay-wrapper'
    wrapper.style.fontSize = '16px'
    document.body.appendChild(wrapper)
    ele = document.querySelector('.train-pay-wrapper')
  }
  ele.style.fontSize = '16px'
  return ele
}

export const goPay = (outTradeID, openid) => {
  const { DPay } = window
  let opts = {
    el: getPayElement(), // 获取挂载的dom节点
    direct: true, // 是否直接触发支付
    pay: {
      token: sessionStorage.getItem('token') || null,
      out_trade_id: outTradeID,
      open_id: openid,
    }
  }
  let promise = new Promise(function(resolve, reject) {
    DPay.pay(opts, (err, result) => {
      if (result) {
        // 支付成功自动关闭弹窗
        window.DPay.close('mainPanel')
        resolve(result)
      } else {
        reject(err)
      }
    })
  })
  return promise
}

export const getPayConf = (outTradeID, openid) => {
  let opts = {
    el: getPayElement(), // 获取挂载的dom节点
    direct: true, // 是否直接触发支付
    pay: {
      token: sessionStorage.getItem('token') || null,
      out_trade_id: outTradeID,
      open_id: openid,
    }
  }
  return opts
}
