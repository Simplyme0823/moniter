import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";

export function injectJsError() {
  window.addEventListener("error", (event) => {
    if (event.target && (event.target.src || event.target.href)) {
      tracker.send({
        kind: "stability", //监控指标的大类
        type: "error", //小类型，这是一个错误
        errorType: "resourceError", //JS/css资源加载
        url: "", //前端路由
        filename: event.target.src || event.target.href,
        tagName: event.target.tagName,
        selector: getSelector(event.target), //代表最后一个操作的元素
      });
      return;
    }
    tracker.send({
      kind: "stability", //监控指标的大类
      type: "error", //小类型，这是一个错误
      errorType: "jsError", //JS执行错误
      url: "", //前端路由
      message: event.message, //报错信息
      filename: event.filename,
      position: `${event.lineno}:${event.colno}`,
      stack: getLines(event.error.stack),
      selector: lastEvent ? getSelector(lastEvent) : "", //代表最后一个操作的元素
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    let lastEvent = getLastEvent();
    let message;
    let filename;
    let line = 0;
    let column = 0;
    let stack;
    if (typeof event.reason === "string") {
      message = event.reason;
    } else if (typeof event.reason === "object") {
      if (event.reason.stack) {
        let matchResult = event.reason.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        line = matchResult[2];
        column = matchResult[3];
      }
      message = reason.stack.message;
      stack = getLines(event.reason.stack);
    }

    let log = {
      kind: "stability", //监控指标的大类
      type: "error", //小类型，这是一个错误
      errorType: "promiseError", //JS执行错误
      message: message,
      filename: filename,
      position: `${line}:${column}`,
      stack: stack,
      selector: lastEvent ? getSelector(lastEvent) : "", //代表最后一个操作的元素
    };
    tracker.send(log);
  });
}

function getLines(stack) {
  console.log(stack);
  return stack
    .split("\n")
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, "").join("^"));
}
