/*
desc:采用跳转页面的方式获取openid
     仅当前置页面携带过来的openid无效时才使用该方案
author:huangzhijingpoint
date:2018-08-20
*/
import qs from 'qs'
import { jumpUrl } from 'service/url'
import { Base64 } from 'js-base64'
// import { isPC } from 'utils/userAgent'

// 跳转一次获取openId
export const getOpenID = function(isWeChat, isAliPay, _this) {
  const { host, hostname, href } = window.location
  let redirect = href
  let source = 'weixin'
  const appidWeChat = 'wx69b6673576ec5a65'
  const appidAliPay = '2015042700050887'
  let appid = appidWeChat
  if (isWeChat) {
    source = 'weixin'
    appid = appidWeChat
  } else if (isAliPay) {
    source = 'alipay_wallet'
    appid = appidAliPay
  }
  // let api = 'https://common.diditaxi.com.cn/webapp/platform/oauth2/openid'
  let api = jumpUrl.fetchOpenId
  let isHttps = window.location.protocol.includes('https')
  if (!isHttps) {
    api = 'http:' + api
  } else {
    api = 'https:' + api
  }
  let $route = _this.$route.query
  redirect = Base64.encode(redirect)
  // alert(redirect)
  redirect = encodeURIComponent(redirect)
  // alert(redirect)
  let url = api + '?source=' + source + '&appid=' + appid + '&base64_redirect=' + redirect
  window.location.href = url
}

// 与this中高度耦合，所以需要在data中注册checkOpenId
export const checkOpenId = function(isWeChat, isAliPay) {
  // 优先使用前置页面中url带过来的openid
  // 如果页面url中openid无效时，使用跳转的方式获取openid兜底

  let hasOpenId = false
  if (!isWeChat && !isAliPay) {
    // 若在非微信、非支付宝环境，则当作有openid处理，不进行跳转
    hasOpenId = true
    return hasOpenId
  }
  if (!this.$route.query.openid || this.$route.query.openid == 'general_app') {
    let { query, path } = this.$route
    let { host, href } = window.location
    // let reg = `/${host}\/(\S*)#${path}/`
    // let str = 'http://train.didiglobal.com/?openid=osdfsdfdsfdsdf&acctoken=dsffdsfs&needuserinfo=#buyTicket?train_no=K200'
    // 先用split分割，有时间改成正则匹配一下
    let string = href.split(`${host}`)[1].split(`#${path}`)[0].split('/?')[1]
    let channelParams = qs.parse(string) // 支付宝or微信跳转后url中新加的信息，注意needuserinfo部分不准，因为无返回
    if (!channelParams.openid || channelParams.openid == 'general_app') {
      console.log('go get openid');
      console.log(channelParams);
      let that = this
      getOpenID(isWeChat, isAliPay, that)
      hasOpenId = false
    } else {
      let { query } = this.$route
      let newQuery = Object.assign({}, query, { openid: channelParams.openid })
      hasOpenId = true
      console.log('already fetch openid from 302 redirect');
      console.log(channelParams);
      this.$router.replace({ query: newQuery })
    }
  } else {
    console.log('openid from route');
    console.log(this.$route.query.openid);
    hasOpenId = true
  }
  return hasOpenId
}
