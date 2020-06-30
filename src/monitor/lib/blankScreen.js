import tracker from "../utils/tracker";
import onload from "../utils/onload";

export function blankScreen() {
  function getSelector(element) {
    if (element.id) {
      return "#" + element.id;
    } else if (element.className) {
      return (
        "." +
        element.className
          .split(" ")
          .filter((item) => !!item)
          .join(".")
      );
    } else {
      return element.tagName.toLowerCase();
    }
  }

  //空元素，页面的 容器元素
  let wrapperElements = ["html", "body"];
  let emptyPoints = 0;

  function isWrapper(element) {
    let select = getSelector(element);
    if (wrapperElements.indexOf(select) !== -1) {
      emptyPoints++;
    }
  }

  onload(function () {
    for (let i = 1; i <= 9; i++) {
      // 由里到外的所有元素
      let xElements = document.elementsFromPoint(
        (window.innerWidth * i) / 10,
        window.innerHeight / 2
      );
      let yElements = document.elementsFromPoint(
        window.innerWidth / 2,
        (window.innerHeight * i) / 10
      );

      isWrapper(xElements[0]);
      isWrapper(yElements[0]);
    }

    //自定义阈值
    if (emptyPoints >= 18) {
      let centerElement = document.elementsFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
      //白屏了
      tracker.send({
        kind: "stability",
        type: "blankScreen",
        emptyPoints,
        screen: window.screen.width + "X" + window.screen.height,
        viewPoing: window.innerWidth + "X" + window.innerWidth.height,
        select: getSelector(centerElement[0]),
      });
    }
  });
}
