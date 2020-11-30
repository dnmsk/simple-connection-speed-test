import axios        from "axios";

const headers = {
  "X-Time-Offset": (-new Date().getTimezoneOffset()) + "",
  "X-Requested-With": "XMLHttpRequest",
};

const readCsrf = () => {
  const paramEl = document.querySelector('meta[name=csrf-param]');
  const tokenEl = document.querySelector('meta[name=csrf-token]');
  if (!paramEl || !tokenEl) {
    return { post: {}, headers: {} };
  }
  const param = paramEl.getAttribute('content');
  const token = tokenEl.getAttribute('content');
  const post = {};
  post[param] = token;
  const headers = { 'X-CSRF-Token': token };
  return {
    post: post,
    headers: headers
  };
};

const vueAjaxRequest = method => {
  return {
    [method]: (url, params = {}, config = {}) => {
      let additionalHeaders = {};
      if (params instanceof FormData) {
        additionalHeaders["Content-Type"] = "multipart/form-data";
      }
      if (params.id && method != "post") {
        url += (url.endsWith("/") ? "" : "/") + params.id;
        delete params.id;
      }
      if (config.headers) {
        additionalHeaders = {
          ...additionalHeaders,
          ...config.headers
        };
        delete config.headers;
      }
      if (params.constructor == Object && method != "get" && method != "head") {
        let csrf = readCsrf();
        params = {
          ...params,
          ...csrf.post
        };
        additionalHeaders = {
          ...additionalHeaders,
          ...csrf.headers
        };
      }
      switch(method) {
        case "get":
        case "head":
        case "delete":
          return axios[method](url, {
            params,
            headers: {
              ...headers,
              ...additionalHeaders
            },
            ...config,
            withCredentials: true,
          });
        default:
         return axios[method](url, params, {
          headers: {
            ...headers,
            ...additionalHeaders
          },
          ...config,
          withCredentials: true,
        });
      };
    }
  }
};

export default {
  ...vueAjaxRequest("get"),
  ...vueAjaxRequest("post"),
  ...vueAjaxRequest("put"),
  ...vueAjaxRequest("delete"),
  ...vueAjaxRequest("head"),
};
