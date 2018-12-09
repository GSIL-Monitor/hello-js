/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'
import qs from 'qs'

// 分组按需加载, 依靠webpackChunkName
// eslint-disable-next-line
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home/index.vue')  // eslint-disable-line

const TrainList = () => import(/* webpackChunkName: "trainList" */ '@/views/TrainList/index.vue')
const TrainDetail = () => import(/* webpackChunkName: "trainDetail" */ '@/views/TrainDetail/index.vue')

const AddContact = () => import(/* webpackChunkName: "buyTicket" */ '@/views/AddContact')  // eslint-disable-line
const BuyTicket = () => import(/* webpackChunkName: "buyTicket" */ '@/views/BuyTicket/index.vue')
const OrderList = () => import(/* webpackChunkName: "order" */ '@/views/OrderList/index.vue')
const OrderDetail = () => import(/* webpackChunkName: "order" */ '@/views/OrderDetail/index.vue')
const ApplyRefund = () => import(/* webpackChunkName: "refund" */ '@/views/Refund/index.vue')
const ChangeTicket = () => import(/* webpackChunkName: "changeTicket" */ '@/views/ChangeTicket/index.vue')
const BuyChangeTicket = () => import(/* webpackChunkName: "changeTicket" */ '@/views/ChangeTicket/detail.vue')

const Login12306 = () => import(/* webpackChunkName: "12306" */ '@/views/Login12306/login.vue')  // eslint-disable-line
const Logout12306 = () => import(/* webpackChunkName: "12306" */ '@/views/Login12306/logout.vue')  // eslint-disable-line
const ResetPass = () => import(/* webpackChunkName: "12306" */ '@/views/login12306/resetPass.vue')  // eslint-disable-line

const IdentityNotice = () => import(/* webpackChunkName: "protocol" */ '@/views/Protocol/identityNotice.vue')
const ChangeTicketNotice = () => import(/* webpackChunkName: "protocol" */ '@/views/Protocol/changeTicketNotice.vue')
const BuyNotice = () => import(/* webpackChunkName: "protocol" */ '@/views/Protocol/buyNotice.vue')
const RefundForNA = () => import(/* webpackChunkName: "protocol" */ '@/views/Protocol/RefundForNA.vue')
const GrabNotice = () => import(/* webpackChunkName: "protocol" */ '@/views/Protocol/grabNotice.vue')
const ChildTicketNotice = () => import(/* webpackChunkName: "protocol" */ '@/views/Protocol/childTicketNotice.vue')
const TicketBookingNotice = () => import(/* webpackChunkName: "protocol" */ '@/views/BuyTicket/ticketBookingNotice.vue')

const Reservation = () => import(/* webpackChunkName: "grab" */ '@/views/Reservation/reservation.vue')

const Logout = () => import(/* webpackChunkName: "logout" */ '@/views/Logout/index.vue')
// const AliPayTest = () => import(/* webpackChunkName: "logout" */ '@/views/BuyTicket/alipayTest.vue')
Vue.use(Router)

// noLoginCheck 代表无需检查login状态
// forceLoginCheck 代表不管session是否有效，都会检查一次login状态（为了确保拿到手机号码）
// 其他页面，仅当session失效（一般为第一屏加载时），检查login状态
export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home, meta: { noLoginCheck: true } },
    { path: '/trainList', name: 'TrainList', component: TrainList, meta: { noLoginCheck: true } },
    { path: '/trainDetail', name: 'TrainDetail', component: TrainDetail, meta: { noLoginCheck: true } },
    { path: '/addContact', name: 'AddContact', component: AddContact },
    { path: '/buyTicket', name: 'BuyTicket', component: BuyTicket, meta: { forceLoginCheck: true } },
    { path: '/orderList', name: 'ListOrder', component: OrderList },
    { path: '/orderDetail', name: 'OrderDetail', component: OrderDetail },
    { path: '/applyRefund', name: 'ApplyRefund', component: ApplyRefund },
    { path: '/changeTicket', name: 'ChangeTicket', component: ChangeTicket },
    { path: '/buyChangeTicket', name: 'BuyChangeTicket', component: BuyChangeTicket },
    // 12306
    { path: '/login12306', name: 'Login', component: Login12306 },
    { path: '/logout12306', name: 'Logout', component: Logout12306 },
    { path: '/resetPass/:name', name: 'ResetPass', component: ResetPass },
    // 各种协议，先用router控制，后续看是否要放在CDN上
    { path: '/protocol/identityNotice', name: 'IdentityNotice', component: IdentityNotice, meta: { noLoginCheck: true } },
    { path: '/protocol/changeTicketNotice', name: 'ChangeTicketNotice', component: ChangeTicketNotice, meta: { noLoginCheck: true } },
    { path: '/protocol/buyNotice', name: 'BuyNotice', component: BuyNotice, meta: { noLoginCheck: true } },
    { path: '/protocol/refund', name: 'RefundForNA', component: RefundForNA, meta: { noLoginCheck: true } },
    { path: '/protocol/childTicketNotice', name: 'ChildTicketNotice', component: ChildTicketNotice, meta: { noLoginCheck: true } },
    { path: '/protocol/ticketBookingNotice', name: 'TicketBookingNotice', component: TicketBookingNotice, meta: { noLoginCheck: true } },
    // 抢票
    { path: '/grabTicket', name: 'reservation', component: Reservation, meta: { forceLoginCheck: true } },

    // 抢票攻略
    { path: '/protocol/grabNotice', name: 'GrabNotice', component: GrabNotice, meta: { noLoginCheck: true } },
    { path: '/logout', name: 'logout', component: Logout, meta: { noLoginCheck: true } },
    {
      path: '/chargeinfo',
      name: 'charge'
    },
    {
      path: '/coupons',
      name: 'coupons'
    }
    // {
    //   path: '/alipayTest',
    //   name: 'alipay',
    //   component: AliPayTest, meta: { noLoginCheck: true }
    // }
  ],
  parseQuery(query) {
    return qs.parse(query);
  },
  stringifyQuery(query) {
    var result = qs.stringify(query);
    return result ? ('?' + result) : '';
  }
})
