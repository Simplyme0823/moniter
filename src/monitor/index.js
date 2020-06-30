import { injectJsError } from "./lib/jsError";
import { injectXHR } from "./lib/xhr";
import { blankScreen } from "./lib/blankScreen";
import { timing } from "./lib/timing";
// import "./utils/getLastEvent"
//执行函数给window加上监听事件
injectJsError();
injectXHR();
blankScreen();
timing();
