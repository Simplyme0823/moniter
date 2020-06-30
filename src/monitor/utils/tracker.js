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
    this.sendBeacon = navigator.sendBeacon ? navigator.sendBeacon : undefined
    this.xhr = new XMLHttpRequest();
  }
  send(data = {}) {
    let extraData = getExtraData();
    let log = { ...data, ...extraData };

    this.xhr.open("POST", this.url, true);
    let body = JSON.stringify({
      __logs__: log,
    });
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.send(body);
  }
}

export default new SendTracker();
