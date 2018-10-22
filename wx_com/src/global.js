// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue';
import HtButton from './components/HtButton.vue';
import HtDate from './components/HtDate.vue';
import DepartItem from './components/DepartItem.vue';
Vue.component('ht-button', HtButton);
Vue.component('ht-date', HtDate);
Vue.component('d-item', DepartItem);

import {
  Button,
  Field,
  Popup,
  Header,
  CellSwipe,
  Cell,
  IndexList,
  IndexSection,
  Radio,
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  InfiniteScroll,
  Spinner,
  Badge,
  Checklist,
  Picker,
  Indicator
} from 'mint-ui';
Vue.component(Picker.name, Picker);
Vue.component(Button.name, Button);
Vue.component(Popup.name, Popup);
Vue.component(Field.name, Field);
Vue.component(Header.name, Header);
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Cell.name, Cell);
Vue.component(IndexList.name, IndexList);
Vue.component(IndexSection.name, IndexSection);
Vue.component(Radio.name, Radio);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Spinner.name, Spinner);
Vue.component(Badge.name, Badge);
Vue.component(Checklist.name, Checklist);
Vue.use(InfiniteScroll);
Vue.use(Indicator);
