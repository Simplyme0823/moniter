import tracker from "../utils/tracker";
import onload from "../utils/onload";
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
export function timing() {
  let FMP, LCP;
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries[0];
    observer.disconnect(); //不再观察
  }).observe({ entryTypes: ["element"] }); //观察页面中有意义的元素

  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    LCP = perfEntries[0];
    observer.disconnect(); //不再观察
  }).observe({ entryTypes: ["largest-contentful-paint"] }); //观察页面中有意义的元素

  new PerformanceObserver((entryList, observer) => {
    let lastEvent = getLastEvent();
    let firstInput = entryList.getEntries()[0];
    if (firstInput) {
      //开始处理的时间 - 开始点击/输入的时间， 差值就是处理的延迟
      let inputDelay = firstInput.processingStart - firstInput.startTime;
      //处理耗时
      let duration = firstInput.duration;
      if (inputDelay > 0 || duration > 0) {
        tracker.send({
          kind: "experience",
          type: "firstInputDelay",
          inputDelay,
          duration,
          startTime: firstInput.startTime,
          selector: lastEvent
            ? getSelector(lastEvent.path || lastEvent.target)
            : "",
        });
        console.log({
          kind: "experience",
          type: "firstInputDelay",
          inputDelay,
          duration,
          startTime: firstInput.startTime,
          selector: lastEvent
            ? getSelector(lastEvent.path || lastEvent.target)
            : "",
        });
      }
    }
    observer.disconnect(); //不再观察
  }).observe({ type: "first-input", buffered: true }); //第一次交互，点击或者输入

  onload(function () {
    setTimeout(() => {
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
        loadEventEnd,
      } = performance.timing;
      tracker.send({
        kind: "experience",
        type: "timing", //统计每个阶段事件
        connectTime: connectEnd - connectStart, //连接时间
        ttfbTime: responseStart - requestStart, //首字节到达时间
        responseTime: responseEnd - responseStart, //响应的读取时间
        parseDOMTime: loadEventStart - domLoading, //DOM解析时间
        domContentLoadedTime:
          domContentLoadedEventEnd - domContentLoadedEventStart, //dom外链加载时间
        timeToInteractive: domInteractive - fetchStart, //首次可交互时间
        loadTime: loadEventEnd - loadEventStart,
      });

      const FP = performance.getEntriesByName("first-paint")[0];
      const FCP = performance.getEntriesByName("first-contentful-paint")[0];
      tracker.send({
        kind: "experience",
        type: "paint",
        firstPaint: FP.startTime,
        firstContentfulPaint: FCP.startTime,
        firstMeanfulPaint: FMP.startTime,
        largestContentfulPaint: LCP.startTime,
      });
    }, 3000);
  });
}
