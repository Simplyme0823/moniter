let host = "cn-beijing.log.aliyuncs.com";
let project = "zhufengmonitor";
let logstore = "zhufengmonitor-sore";

function getExtraData() {
  return {
    title: document.title,
    url: location.url,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  };
}

//fig图片做上传 图片速度快，没有跨域问题
class SendTracker {
  constructor() {
    this.url = `${project}.${host}/logstores/${logstore}/track`;
    this.xhr = new XMLHttpRequest();
  }
  send(data = {}) {
    let extraData = getExtraData();
    let log = { ...data, ...extraData };
    //对象的值不能是数字 阿里云的要求
    Object.keys(log).forEach((item) => {
      if (typeof log[item] === "number") {
        log[item] = `${log[item]}`;
      }
    });
    this.xhr.open("POST", this.url, true);
    let body = JSON.stringify({
      __logs__: log,
    });
    this.xhr.setRequestHeader("x-log-apiversion", "0.6.0");
    this.xhr.setRequestHeader("x-log-bodyrawsize", body.length);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.setRequestHeader("x-log-compresstype", "lz4");
    this.xhr.onload = function () {};
    this.xhr.onerror = function () {};
    this.xhr.send(body);
  }
}

export default new SendTracker();
