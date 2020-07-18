/** @format */

import tracker from "../utils/tracker";
const reg = /staistic/;

export function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest;
  let oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, async) {
    //避免访问监控地址的时候出现死循环
    //如果访问监控地址出现错误，会导致一直访问监控地址
    if (reg.test(url)) {
      console.log(url);
      this.logData = {
        method,
        url,
        async,
      };
    }
    return oldOpen.apply(this, arguments);
  };
  let oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    if (this.logData) {
      // 这里是网络错误处理
      let startTime = Date.now();
      let handler = type => event => {
        let duration = Date.now() - startTime;
        let status = this.status;
        let statusText = this.statusText;
        tracker.send({
          kind: "stability",
          type: "xhr",
          eventType: type,
          pathname: this.logData.url,
          status: status + "-" + statusText,
          duration,
          response: this.response ? JSON.stringify(this.response) : "",
          params: body || "",
        });
        console.log(type);
      };
      this.addEventListener("load", handler("load"), false);
      this.addEventListener("error", handler("error"), false);
      this.addEventListener("abort", handler("abort"), false);
    }
    return oldSend.apply(this, arguments);
  };
}
