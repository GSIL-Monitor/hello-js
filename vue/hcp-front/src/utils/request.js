import axios from '@didi/dajax'
import jsonp from 'jsonp'
import {
  localDb
} from '@/utils/request'
import api from '@/service/api'

axios.defaults.baseURL = '/api/v1';
axios.interceptors.request.use(function(config) {
  let token
  try {
    token = sessionStorage.getItem('token') || null
    // token = localStorage.getItem('token') || null
  } catch (e) {
    console.log(e);
  }

  let Reg = new RegExp(/^\S*\/api\/v1\S*$/ig)
  if (token) {
    if (config.params) {
      config.params.token = token
    } else {
      config.params = {
        token
      }
    }
  }

  // 仅给train.didiglobal.com的api添加header，外部跨域接口不加，否则调用可能有问题，如免密状态查询接口
  if (!config.url.includes('//')) {
    // eslint-disable-next-line
    config.params.osType = 3 // 1 iOS、2 android、3 webapp
  }
  return config;
});

function checkResponse(res) {
  let response = res
  const {
    status,
    statusText,
    data
  } = response
  if (status >= 200 && status < 300) {
    // let { errno } = data
    // if (typeof errno === 'undefined') {
    //   errno = status
    // }
    // 100003时，token失效，拉起登陆
    if (data.errno && (data.errno == '1000003' || data.errno == '1000008')) {
      // 如果是首页获取汽泡的接口，则不拉起登录
      if (res.config.url.indexOf('listBubble') != -1) {
        return false;
      }
      api.loginDidi()
        .then(res => {
          window.location.reload()
        })
        .catch(error => {
          console.log(error);
        })
    }
    return data
  }
  return {
    errno: status,
    errmsg: statusText
  }
}

function transformErrorResponse(res) {
  // 4xx、5xx等
  let response
  if (res.response) {
    ({
      response
    } = res)
  }
  try {
    const {
      status,
      statusText,
      data
    } = response
    // return { errno: status, errmsg: statusText }
    return {
      errno: status,
      errmsg: '网络错误'
    }
  } catch (e) {
    return {
      errno: 404,
      errmsg: '网络错误'
    }
  }
}

axios.interceptors.response.use(checkResponse, transformErrorResponse);

export function requestJsonp(url, options = null) {
  return new Promise((resolve, reject) => {
    jsonp(url, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export default axios
