/** @format */

function test() {}

test.prototype.add = function () {
  console.log("add");
};

const a = test.prototype.add;

const b = "http://127.0.0.1:7001/statistics";
const reg = /staistic/;
console.log(reg.test(b));
