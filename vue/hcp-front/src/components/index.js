import Calendar from './Calendar/index'
import CityList from './CityList/index'
import CountryList from './CountryList/index'
import Schedule from "./Schedule/index.vue";

const install = (Vue, options) => {
  if (install.installed) return
  Vue.component(Calendar.name, Calendar);
  Vue.component(CityList.name, CityList);
  Vue.component(CountryList.name, CountryList);
  Vue.component(Schedule.name, Schedule);
  install.installed = true;
}

export default {
  version: '1.0.0',
  install
}
