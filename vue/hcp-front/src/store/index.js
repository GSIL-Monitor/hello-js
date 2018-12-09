import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger'

import common from './modules/common'
import homepage from './modules/homepage';
import filterTrainPicker from './modules/filterTrainPicker';
import trainList from './modules/trainList';
import buyTicket from './modules/buyTicket';
import reservation from './modules/reservation';
import passenger from './modules/passenger';
import schedule from './modules/schedule';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common,
    homepage,
    filterTrainPicker,
    trainList,
    buyTicket,
    reservation,
    passenger,
    schedule
  },
  strict: debug,
  plugins: debug ? [] : []
  // plugins: debug ? [createLogger()] : []
})
