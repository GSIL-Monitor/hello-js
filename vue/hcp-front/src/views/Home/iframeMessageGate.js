import { getWebView, getOS } from 'utils/userAgent'
import { PostMessageClient } from '@didi/message-poster'

/**
 * 用以控制支付宝／微信内的公共的parent window跳转
 * docs: https://git.xiaojukeji.com/webapp/message-poster
 */
let hostOnline = 'https://train.didiglobal.com/webapp/#'

let webView = getWebView()
let os = getOS()
let isHttps = window.location.protocol.includes('https')
// 若当前host不是https加载时，则跳转也用http
if (!isHttps) {
  hostOnline = 'http://train.didiglobal.com/webapp/#'
}


export const initPMClient = (messageKey, callback) => {
  const PMClient = new PostMessageClient({
    originList: ['http://common.diditaxi.com.cn', 'https://common.diditaxi.com.cn'],
    onRecieve: callback || (() => {}),
    messageKey: messageKey
  })
  window.PMClient = PMClient
  return PMClient
}

function checkPMClient(messageKey) {
  if (!window.PMClient) {
    initPMClient(messageKey)
  }
}

// 通知父窗口进行跳转
export const parentWindowRedirect = (path, query, needAssemble) => {
  let url = path
  if (needAssemble) {
    url = hostOnline + path
  }
  let obj = {
    type: 'jump',
    data: {
      url, // 用于jump类型的跳转url
      params: query || {}, // 用以url后面的指定参数
    }
  }
  window.PMClient.post(obj)
    .then(res => {
      // alert(JSON.stringify(res))
    })
  console.log('has post jump');
}

export const goTo = function({ path, query, needAssemble = true }) {
  let { self, top } = window
  if (self !== top) {
    parentWindowRedirect(path, query, needAssemble)
  } else {
    this.$router.push({
      path,
      query
    })
  }
}

// 从公共首页同步获取指定的值
// 目前支持['appversion', 'realTimeGeo', 'geo', 'reversedGeo', 'fromStation', 'toStation', 'login', 'openid']
export const getDataFromCommon = function(dataList) {
  let obj = {
    type: 'getData',
    data: {
      dataList: dataList
    }
  }
  return new Promise(function(resolve, reject) {
    window.PMClient.post(obj)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  });
}

export const getLoginStatus = async() => {
  function removeLogin() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('cell')
    sessionStorage.removeItem('loginStatus')
  }
  return new Promise(function(resolve, reject) {
    window.PMClient.post({
      type: 'checkLogin'
    }, 5000)
      .then(res => {
        let { data } = res
        if (data && data.status && data.status == 'success') {
          sessionStorage.setItem('token', data.token)
          // localStorage.setItem('token', data.token)
          sessionStorage.setItem('cell', data.phone)
          // localStorage.setItem('cell', data.phone)
          sessionStorage.setItem('loginStatus', true)
          resolve(data)
        } else {
          removeLogin()
          reject(data)
        }
        // 成功接收数据
      }).catch(err => {
        console.log(err);
        removeLogin()
        reject(err)
        // 接收错误
      })
  });
}

export const getLocation = function() {
  return new Promise(function(resolve, reject) {
    window.PMClient.post({
      type: 'getLocate'
    }).then(res => {
      if (res && res.data && res.data.city) {
        // console.log(res);
        resolve(res.data)
      } else {
        reject(res)
      }
      // 成功接收数据
    }).catch(err => {
      console.log(err);
      reject(err)
      // 接收错误
    })
  });
}

export const forceLogin = function() {
  return new Promise(function(resolve, reject) {
    // window.PMClient.postTimeout({ type: 'forceLogin' }, 5000)
    window.PMClient.post({ type: 'forceLogin' })
      .then(res => {
        if (res && res.data && res.data.token) {
          sessionStorage.setItem('token', res.data.token)
          sessionStorage.setItem('cell', res.data.phone)
          sessionStorage.setItem('loginStatus', true)
        }
        // 成功接收数据
        resolve(res)
      }).catch(err => {
        reject(err)
        // 接收错误
      })
  });
}
