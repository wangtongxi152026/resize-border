/** @format */

function throttle(func, wait, options) {
  var context, args, result;
  // setTimeout 的 handler
  var timeout = null;
  // 标记时间戳
  // 上一次执行回调的时间戳
  var previous = 0;
  // 如果没有传入 options 参数
  // 则将 options 参数置为空对象
  if (!options) options = {};

  var later = function () {
    // 如果 options.leading === false
    // 则每次触发回调后将 previous 置为 0
    // 否则置为当前时间戳
    previous = options.leading === false ? 0 : new Date();
    timeout = null;
    result = func.apply(context, args);
    // 这里的 timeout 变量一定是 null 了吧
    // 是否没有必要进行判断？
    if (!timeout) context = args = null;
  };

  // 以滚轮事件为例（scroll）
  // 每次触发滚轮事件即执行这个返回的方法
  // _.throttle 方法返回的函数
  return function () {
    // 记录当前时间戳
    var now = new Date();

    if (!previous && options.leading === false) previous = now;

    // 距离下次触发 func 还需要等待的时间
    var remaining = wait - (now - previous);
    context = this;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        // 解除引用，防止内存泄露
        timeout = null;
      }
      // 重置前一次触发的时间戳
      previous = now;
      // 触发方法
      // result 为该方法返回值
      result = func.apply(context, args);
      // 引用置为空，防止内存泄露
      // 感觉这里的 timeout 肯定是 null 啊？这个 if 判断没必要吧？
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // 最后一次需要触发的情况
      // 如果已经存在一个定时器，则不会进入该 if 分支
      // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
      // 间隔 remaining milliseconds 后触发 later 方法
      timeout = setTimeout(later, remaining);
    }
    // 回调返回值
    return result;
  };
}
function debounce(fn, delay) {
  let timer;
  return function () {
    let _this = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, delay);
  };
}
