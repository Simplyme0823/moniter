function getSelectors(path) {
  return path
    .reverse()
    .filter((elem) => elem !== document && elem !== window)
    .map((elem) => {
      let selector = "";
      if (elem.id) {
        return `{elem.tagName.toLowerCase()}#${elem.id}`;
      } else if (elem.className && typeof elem.className === "string") {
        return `{elem.className.toLowerCase()}#${elem.className}`;
      } else {
        selector = elem.nodeName.toLowerCase();
      }
      return selector;
    })
    .join(" ");
}
export default function (path) {
  if (Array.isArray(path)) {
    return getSelectors(path);
  } else {
    // obj
    let pathNodes = [];
    while (path) {
      pathNodes.push(path);
      path = path.parentNode;
    }
    return getSelectors(pathNodes);
  }
}
