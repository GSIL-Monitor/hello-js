import UA from 'ua-device'

const str = window.navigator.userAgent;
let detected = new UA(str)

export const getWebView = function() {
  var webView = "browser";
  if (/MicroMessenger/i.test(str)) {
    webView = 'WeChat';
  } else if (/didi\.passenger/i.test(str)) {
    webView = 'DIDI';
  } else if (/AlipayClient/i.test(str)) {
    webView = 'Alipay';
  } else if (/weibo/i.test(str)) {
    webView = 'Weibo';
  } else if (/MQQ/i.test(str)) {
    webView = 'MQQ';
  } else if (/CriOS/i.test(str)) {
    webView = 'Chrome';
  } else if (/UCwebView/i.test(str) || /UCWEB/i.test(str)) {
    webView = 'UC';
  } else if (/FlyFlow/i.test(str)) {
    webView = 'Baidu';
  } else if (/Mercury/i.test(str)) {
    webView = 'Mercury';
  } else if (/SogouMobilewebView/i.test(str)) {
    webView = 'Sogou';
  } else if (/Opera/i.test(str)) {
    webView = 'Opera';
  } else if (/baiduboxapp/i.test(str)) {
    webView = 'BaiduBox';
  } else if (/hao123/i.test(str)) {
    webView = 'Hao123';
  }
  return webView
}

export const getUA = function() {
  return detected
}

export const getOS = function() {
  return detected.os
}

export const isPC = function() {
  let isPc = false
  try {
    let { device } = detected
    isPc = device.type !== 'tablet' && device.type !== 'mobile'
  } catch (e) {

  }
  return isPc
}
