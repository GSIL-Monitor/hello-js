// 接入收银台的免密组件
// http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=156941394
// http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=153283763
//

import api from 'service/api'
import { jumpUrl } from 'service/url'
import { config } from '@/config/appConf'
import { getOS, getWebView } from '@/utils/userAgent'

import qs from 'qs'

const channelWeChat = 133 // 渠道号，微信133、支付宝134
const channelAliPay = 134
const osAndroid = 1 // 1：安卓、101：iOS
const osIOS = 101

// 查询用户在当前渠道是否已签约免密
// http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=93751056#id-%E7%AD%BE%E7%BA%A6%E6%8E%A5%E5%8F%A3-1.webapp%E6%9F%A5%E8%AF%A2%E7%94%A8%E6%88%B7%E7%AD%BE%E7%BA%A6%E4%BF%A1%E6%81%AF(/passenger/webWithholdSignInfo)
export const getSignStatus = async function(token) {
  let isSign = false
  let channelId = ''
  let webView = getWebView()
  if (webView == 'WeChat') {
    channelId = channelWeChat
  } else if (webView == 'Alipay') {
    channelId = channelAliPay
  } else {
    return false
  }
  let params = {
    token: sessionStorage.getItem('token') || null,
    channel_id: channelId
  }
  const res = await api.querySignStatus(params)
  if (res && res.errno == 0) {
    let data = res.sign_data[0]
    if (data.sign_status == 1 && data.channel_id == channelId) {
      isSign = true
    }
  }
  return isSign
}

// 拉起免密组件（跳转页面方式）
export const goToSign = function(data) {
  let channelId = ''
  let webView = getWebView()
  if (webView == 'WeChat') {
    channelId = channelWeChat
  } else if (webView == 'Alipay') {
    channelId = channelAliPay
  } else {
    return
  }
  let os = getOS()
  let dataType = null
  if (os.name == 'iOS') {
    dataType = osIOS
  } else if (os.name == 'Android') {
    dataType = osAndroid
  }
  let returnUrl = window.location.href
  let params = {
    token: sessionStorage.getItem('token') || null,
    open_id: data.openid,
    channel_id: channelId, // 渠道号，微信133、支付宝134
    product_line: config.productLine,
    datatype: dataType, // 1：安卓、101：iOS
    bind_type: 6, // 6代表webapp免密组件
    return_url: decodeURIComponent(returnUrl)
  }
  let url = jumpUrl.noPwPaySign
  params = qs.stringify(params)
  let href = `${url}?${params}`
  // alert(href)
  console.dir(href)
  window.location.href = href
}
