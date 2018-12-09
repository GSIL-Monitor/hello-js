/*
@desc:注册全局对象
@author:songchao
@date: 2018-08-10
*/

exports.install = function (Vue, options) {
  Vue.prototype.eventHub = new Vue();

  Vue.prototype.Omega = (eventid, eventName, attrs = {
    uid: ""
  }) => {
    window.Omega.trackEvent(eventid, eventName, attrs);
  };
};
