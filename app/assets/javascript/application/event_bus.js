import Vue from "vue";

const events = {
  Body: { Click: "" },
  defineEvents(obj, name) {
    const f = (o, e) => {
      Object.keys(o).forEach(objKey => {
        const v = o[objKey]
        if (typeof(v) == "object") {
          f(v, e[objKey] || (e[objKey] = {}));
        } else {
          e[objKey] = v;
        }
      })
    }
    f(obj, events);
    createNamedValues(events, name);
  }
};

function createNamedValues(obj, predefinedKey) {
  Object.keys(obj).forEach(objKey => {
    let val = obj[objKey];
    let stringValue = [predefinedKey, objKey].join(".");
    if (typeof(val) == "object") {
      createNamedValues(val, stringValue);
    } else {
      if (val == '') {
        obj[objKey] = stringValue;
      }
    }
  });
  return obj;
};

export const EVENTS = createNamedValues(events, "EVENTS");
export const eventBus = new Vue({});
