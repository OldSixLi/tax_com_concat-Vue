import { toTimestamp, toNormalTime } from './../helper';

Vue.filter('toTime', toNormalTime);
Vue.filter('toStamp', toTimestamp);
