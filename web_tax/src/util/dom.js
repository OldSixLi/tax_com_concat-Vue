export function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

/**
 * 滚动条到底部的距离
 * 距离底部高度 = 总的高度 - 卷去的高度 - 窗体的高度
 * @returns
 */
export function getScrollBottomHeight() {
  return getHtmlHeight() - getScrollTop() - getWindowHeight();
}
/**
 * 获取页面整体高度
 *
 * @returns
 */
export function getHtmlHeight() {
  return document.querySelector("html").scrollHeight;
}
/**
 * 滚动的高度(窗口顶部隐去的高度)
 *
 * @returns
 */
export function getScrollTop() {
  let scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop =
    bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

/**
 * 函数节流方法
 *
 * @returns
 */
export function throttle() {
  threshhold || (threshhold = 250);
  var last,
    timer;
  return function() {
    var context = scope || this;
    var now = +new Date(),
      args = arguments;
    if (last && now - last + threshhold < 0) {
      // hold on to it
      clearTimeout(deferTimer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 函数去抖方法
 *
 * @returns
 */
export function debounce() {
  let timer = null;
  return function() {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(
      function() {
        method.apply(context, args);
      }, delay);
  }
}