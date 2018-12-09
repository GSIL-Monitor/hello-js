import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import base from './utils/base';
import api from '@/service/api'
// import '@/assets/styles/normalize.css' // 因为cube-ui的style内置了reset.css，所以不重复引normalize了
import {
  Style,
  Toast,
  Dialog,
  ActionSheet,
  Loading,
  createAPI,
  Picker,
  Popup,
  Switch
} from 'cube-ui'
import '@/assets/styles/app.less'
import '@/assets/styles/media-se.less'

Vue.config.productionTip = false

// 自定义滚动指令
Vue.directive('touchMove', {
  inserted(el, binding, vnode) {
    if (el.style.height === 'auto') return // 当绑定元素height为auto时，直接返回
    let start = 0;
    let date = 0;
    let dateStart = 0;
    let scrollPrevious = 0 // 保存滚动条上次所在位置
    let moveSave = []
    let dateSave = []
    let timmer = null
    let scrollNow = 0 // 滚动当前所在位置

    el.addEventListener('touchstart', function (e) {
      clearInterval(timmer)
      moveSave = []
      dateSave = []
      scrollPrevious = el.scrollLeft
      start = e.targetTouches[0].clientX // 手指开始接触屏幕时所在屏幕Y轴位置
      dateStart = new Date()
    })

    el.addEventListener('touchmove', function (e) {
      e.preventDefault()
      let move = e.targetTouches[0].clientX // 手指滑动时所在屏幕Y轴位置
      let distance = move - start // 每次滑动的距离
      let date = new Date()
      if (moveSave.length < 2) {
        moveSave.push(move) // 保存最近两次滑动所在的位置跟时间
        dateSave.push(date)
      } else {
        moveSave.shift()
        moveSave.push(move)
        dateSave.shift()
        dateSave.push(date)
      }
      el.scrollLeft = -distance + scrollPrevious
      if (moveSave[1] < moveSave[0]) {
        if (binding.value && binding.value.upScroll) {
          binding.value.upScroll(el, vnode) // 向上滑动时运行的函数
        }
      } else if (binding.value && binding.value.downScroll) {
        binding.value.downScroll(el, vnode) // 向下滑动时运行的函数
      }
    })

    el.addEventListener('touchend', function (e) {
      let speed = 0 // 滑动速度（单位px/ms）
      let elementHeight = el.scrollHeight - el.clientHeight // 滚动条最大值
      let reduction = 0.01 // 加速度
      if (moveSave.length < 2) {
        speed = (moveSave[0] - start) / (dateSave[0] - dateStart)
      } else {
        speed = (moveSave[1] - moveSave[0]) / (dateSave[1] - dateSave[0])
      }
      if (speed > 5) { // 限制speed的最大值跟最小值
        speed = 5
      }
      if (speed < -5) {
        speed = -5
      }
      if (Math.abs(speed) > 0.5) { // speed超过某一直后就会持续移动
        timmer = setInterval(function () {
          if (speed < 0) {
            speed += reduction
            if (binding.value && binding.value.upScroll) {
              binding.value.upScroll(el) // 向上滑动时运行的函数
            }
            if (speed > 0) {
              speed = 0
            }
            scrollNow += -speed * 16
          } else if (speed > 0) {
            speed -= reduction
            if (binding.value && binding.value.downScroll) {
              binding.value.downScroll(el) // 向下滑动时运行的函数
            }
            if (speed < 0) {
              speed = 0
            }
            scrollNow -= speed * 16
          }
          el.scrollLeft = scrollNow
          if (speed === 0 || el.scrollLeft === 0 || el.scrollLeft === elementHeight) {
            clearInterval(timmer)
          }
        }, 16)
      }
    })
  }
});

const routerTransfer = (to, from, next, needReload) => {
  if (needReload) {
    console.log(needReload);
    let href = window.location.origin + window.location.pathname + '#' + to.fullPath
    window.location.href = href
    return;
  }
  // console.log(new Date().valueOf());
  if (to.query && to.query.openid) {
    next()
    return;
  }
  if (from.query && from.query.openid) {
    to.query.openid = from.query.openid
    next({
      path: to.path,
      query: to.query
    })
  }
  next()
}
let realTo = {}
/* eslint-disable */
router.beforeEach((to, from, next) => {
  const loginStatus = sessionStorage.getItem('loginStatus')
  // 需要登录验证且未登录的页面 || 需要强制校验登陆状态的页面
  if ((!to.meta.noLoginCheck && !loginStatus) || to.meta.forceLoginCheck) {
    // if ((!to.meta.noLoginCheck && !loginStatus)) {
    // 拉起登陆后会刷新一次location，为防止拉起两次登陆
    // 仅当检测到本次location变化不是由login造成的时候(即不包含hash_passport_login)，才检测登陆状态／拉起登陆
    if (!to.fullPath.includes('hash_passport_login')) {
      console.log('check login');
      api.isLoginDidi()
        .then(checkResult => {
          routerTransfer(to, from, next)
          // 已登陆
          store.dispatch('updatePhone', {
            passengerPhone: checkResult.cell
          })
          console.log('has login, updatePhone' + checkResult.cell);
        })
        .catch(error => {
          console.log('force login begin');
          // 未登陆则拉起登陆
          realTo = Object.assign({}, to)
          api.loginDidi()
            .then(res => {
              console.log('force login complete, login success');
              console.log(res);
              let needReload = true
              routerTransfer(realTo, from, next, needReload)
            })
            .catch(error => {
              console.log('force login complete, login fail');
              console.log(error);
              routerTransfer(to, from, next)
            })
        })
    } else {
      // console.log('ffff');
      // 拉起登陆时
      routerTransfer(to, from, next)
    }
  } else {
    console.log("didn't check login");
    routerTransfer(to, from, next)
  }
});
/* eslint-enable */


router.afterEach(route => {

});

import customComponents from '@/components/index.js'

const components = [Toast, Dialog, ActionSheet, customComponents, Picker, Popup, Switch]
components.forEach(component => {
  Vue.use(component)
});

Vue.use(base);

/* eslint-disable */
// try disabled BFCache
(function () {
  let bfWorker = new Worker(window.URL.createObjectURL(new Blob(['1'])));
  window.onunload = function () {}
  let showCount = 0
  window.addEventListener('pageshow', function () {
    showCount++
    // console.log('pageshow');
    // alert('show has been fired' + showCount)
    bfWorker.terminate()
  })
  window.addEventListener('pagehide', function () {
    console.log('pagehide');
    bfWorker.terminate()
  })
})()
/* eslint-enable */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  mounted() {},
  template: '<App/>'
})

/* eslint-disable */
if (process.env.NODE_ENV !== 'prodution') {
  try {
    eruda.init();
  } catch (e) {

  }
}
