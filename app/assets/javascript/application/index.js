import ajax from "./ajax";
import WebFont from "webfontloader";

import Vue from "vue";
Vue.config.errorHandler = err => {
  console.log(err);
  window.onerror && window.onerror("", "", "", "", err);
}
Vue.prototype.$bag = {};
Vue.prototype.$ajax = ajax;

import VueI18n from "vue-i18n";
Vue.use(VueI18n);

let messages = window.envs.messages;
let initialLocale = Object.keys(messages)[0];
let initObject = {
  i18n: new VueI18n({
    locale: initialLocale,
    fallbackLocale: initialLocale,
    formatFallbackMessages: true,
    messages,
  }),
};

import { eventBus, EVENTS }     from "./event_bus";

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

["dragenter", "dragover", "dragleave", "drop"].forEach(ev => document.addEventListener(ev, preventDefaults, false));

function componentsInitializer(targetAttr, apps, config = {}) {
  let initObj = { ...initObject };
  if (config.store) {
    initObj.store = config.store();
  }

  document.addEventListener("DOMContentLoaded", event => {
    ajax.head(`${window.envs.authTarget}/touch`);

    document.body.addEventListener('click', e => eventBus.$emit(EVENTS.Body.Click, e));
    config.DOMContentLoaded && config.DOMContentLoaded();

    document.querySelectorAll(`[${targetAttr}]`).forEach(element => {
      const app = apps[element.getAttribute(targetAttr)];
      let props = {};
      Object.keys(element.dataset).forEach(dsKey => {
        let ds = element.dataset[dsKey];
        try {
          props[dsKey] = JSON.parse(ds);
        } catch(ex) {
          props[dsKey] = ds;
        }
      });

      new Vue({
        ...initObj,
        render: h => h(app, { props })
      }).$mount(element);
    });
    WebFont.load({
      google: {
        families: ["Ubuntu:normal,medium,light,bold"]
      }
    });
  });
}

import * as Components   from "./components";

componentsInitializer("data-vue-app", Components);
