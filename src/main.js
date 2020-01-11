import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// Plugins
import "./plugins/mobile";
import "./plugins/resizeText";

import Element from "element-ui";
import "./element-variables.scss";
import locale from "element-ui/lib/locale/lang/en";

Vue.use(Element, { locale });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
