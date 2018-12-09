import axios from '@/utils/request'
import { requestJsonp } from '@/utils/request'
import url from './url'
import { appId } from '@/config/appConf.js'

const api = {}
/* ------------------------------- 公共 ------------------------------- */
api.fetchCityList = opts => requestJsonp(url.fetchCityList, opts)
api.fetchStationListUrl = (params, opts) => axios.get(url.fetchStationListUrl, { params, ...opts })
api.fetchCommonConfig = (params, opts) => axios.get(url.fetchCommonConfig, { params, ...opts })
api.isLoginDidi = () => {
  let promise = new Promise((resolve, reject) => {
    // window.login.setConfig({ appid: appId })
    window.login.isLogin(
      response => {
        const { ticket, cell, login } = response
        try {
          if (login && ticket && cell) {
            // localStorage.setItem('token', ticket)
            // localStorage.setItem('cell', cell)
            sessionStorage.setItem('token', ticket)
            sessionStorage.setItem('cell', cell)
            sessionStorage.setItem('loginStatus', true)
            resolve(response)
            return
          }
        } catch (e) {
          console.log(e)
        }
        // login invalid
        reject(response)
        sessionStorage.removeItem('loginStatus')
      },
      error => {
        // login invalid
        sessionStorage.removeItem('loginStatus')
        console.log(error)
        reject(error)
      }
    )
  })
  return promise
}

api.loginDidi = () => {
  return new Promise((resolve, reject) => {
    window.login.forceLogin(
      res => {
        const { ticket, cell } = res
        try {
          // localStorage.setItem('token', ticket)
          // localStorage.setItem('cell', cell)
          console.log('login didi res')
          sessionStorage.setItem('token', ticket)
          sessionStorage.setItem('cell', cell)
          sessionStorage.setItem('loginStatus', true)
        } catch (e) {
          console.log(e)
          // alert(e)
        }
        resolve(res)
      },
      error => {
        console.log(error)
        reject(error)
      }
    )
  })
}
/* ------------------------------- 外部依赖 ------------------------------- */
api.fetchBannerAD = (params, opts) => axios.post(url.fetchBannerAD, { ...params }, opts)

/* ------------------------------- 订票主流程 ------------------------------- */

api.fetchTrainList = (params, opts) => axios.get(url.fetchTrainList, { params, ...opts })
api.fetchSchedule = (params, opts) => axios.get(url.fetchSchedule, { params, ...opts })
api.fetchContactList = (params, opts) => axios.get(url.fetchContactList, { params, ...opts })
api.addContact = (params, opts) => axios.post(url.addContact, { ...params }, opts)
api.delContact = (params, opts) => axios.post(url.delContact, { ...params }, opts)
api.login12306 = (params, opts) => axios.post(url.login12306, { ...params }, opts)
api.logout12306 = (params, opts) => axios.post(url.logout12306, { ...params }, opts)
api.holdSeat = (params, opts) => axios.post(url.holdSeat, { ...params }, opts)
api.fetchOrderStatus = (params, opts) => axios.get(url.fetchOrderStatus, { params, ...opts })
api.fetchPayId = (params, opts) => axios.get(url.fetchPayId, { params, ...opts })
api.fetchContactOption = (params, opts) => axios.get(url.contactOption, { params, ...opts })
api.countryList = (params, opts) => axios.get(url.countryList, { params, ...opts })
api.fetchCountryList = (params, opts) => axios.get(url.fetchCountryList, { params, ...opts })
api.listBubble = (params, opts) => axios.get(url.listBubble, { params, ...opts })
api.closeBubble = (params, opts) => axios.post(url.closeBubble, { ...params }, opts)
api.fetchPriceDetail = (params, opts) => axios.get(url.fetchPriceDetail, { params, ...opts })

/* ------------------------------- 订单相关 ------------------------------- */
api.fetchListOrder = (params, opts) => axios.get(url.fetchListOrder, { params, ...opts })
api.fetchOrderDetail = (params, opts) => axios.get(url.fetchOrderDetail, { params, ...opts })
api.cancelOrder = (params, opts) => axios.post(url.cancelOrder, { ...params }, opts)
api.returnTicket = (params, opts) => axios.get(url.returnTicket, { params, ...opts })
api.changeTicket = (params, opts) => axios.post(url.changeTicket, { ...params }, opts)
api.changeTicketConfirm = (params, opts) => axios.post(url.changeTicketConfirm, { ...params }, opts)
api.cancelChange = (params, opts) => axios.post(url.cancelChange, { ...params }, opts)
api.getCoupon = (params, opts) => axios.get(url.getCoupon, { params, ...opts })
// 先支付
api.cancelPrepayOrder = (params, opts) => axios.post(url.CancelPrepayOrder, { ...params }, opts)

/* ------------------------------- 抢票相关 ------------------------------- */
api.grabTicketPost = (params, opts) => axios.post(url.grabTicketPost, { ...params }, opts)
api.cancalGrabTicket = (params, opts) => axios.post(url.cancalGrabTicket, { ...params }, opts)
api.querySignStatus = (params, opts) => axios.get(url.querySignStatus, { params }, opts)
api.fetchGrabCounts = (params, opts) => axios.get(url.fetchGrabCounts, { params }, opts)
export default api
