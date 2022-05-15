/** @format */
const container = document.querySelector(".container");
const select = document.querySelector(".select");
const target = document.querySelector(".single-selection");
const targetDashed = document.querySelector(".single-selection-dashed");
const wrap = document.querySelector(".selection-stage-board");

class ResizeBorderSignd {
  static scale = 1;
  static box;

  static boxRect() {
    return ResizeBorderSignd.box.getBoundingClientRect();
  }

  constructor(options) {
    this.parent;
    this.rect;
    this.parentRect;
    this.currentDOM;
    this.eventType = options.eventType || "click";
    this.marked = options.marked;
    this.cb = options.cb || null;
    this.isNeedScroll = options.isNeedScroll;
    this.listener();
  }

  windowResizeHandle() {
    const boxRect = ResizeBorderSignd.box.getBoundingClientRect();
    wrap.style.width = boxRect.width + "px";
    wrap.style.height = boxRect.height + "px";
    this.parentRect = this.parent.getBoundingClientRect();
    hiddenDashed();
    if (this.currentDOM) {
      this.getCurrentPos();
    }
  }

  listener() {
    ResizeBorderSignd.box["on" + this.eventType] = (e) => {
      if (this.eventType == "mouseover" && this.currentDOM !== e.target) {
        // 清除上一个元素的onmousemove
        if (this.currentDOM) {
          this.currentDOM.onmousemove = null;
        }
      }

      if (this.eventType == "mouseover") {
        // hover和click的是同一个元素
        if (AR.currentDOM === e.target) {
          hiddenDashed();
          return;
        }
      }

      this.currentDOM = e.target;

      this.getScrolltContainer(this.currentDOM, () => {
        if (this.isNeedScroll && this.parent) {
          this.parent.onscroll = null;
        }
      });
      this.parentRect = this.parent.getBoundingClientRect();

      this.getCurrentPos();
      if (this.eventType == "mouseover") {
        if (AR.currentDOM === undefined && e.target) {
          this.parent.onscroll = throttle(this.getCurrentPos.bind(this, this.cb));
        }
      }

      if (this.eventType === "click") {
        // hover和click的是同一个元素
        if (BR.currentDOM === this.currentDOM) {
          hiddenDashed();
        }
        this.parent.onscroll = throttle(this.getCurrentPos.bind(this, this.cb));
      } else if (this.eventType === "mouseover") {
        this.currentDOM.onmousemove = () => {
          // debounce(this.getCurrentPos.bind(this), 200, false);
          throttle(this.getCurrentPos.bind(this));
        };
      }
    };
  }

  getCurrentPos(cb) {
    let { marked } = this;
    let scale = ResizeBorderSignd.scale;
    let boxRect = ResizeBorderSignd.box.getBoundingClientRect();
    let rect = this.currentDOM.getBoundingClientRect();
    let parentRect = this.parentRect;
    // 溢出父级隐藏
    if (
      rect.bottom < parentRect.top ||
      parentRect.bottom < rect.top ||
      rect.right < parentRect.left ||
      parentRect.right < rect.left
    ) {
      this.marked.style.display = "none";
      return;
    }
    let detaTop = rect.top - parentRect.top;
    let detaBottom = parentRect.bottom - rect.bottom;

    let detaLeft = rect.left - parentRect.left;
    let detaRight = parentRect.right - rect.right;

    // 子元素上面超出父级范围
    if (detaTop < 0) {
      let height = (rect.height + detaTop) * (1 / scale) + "px";
      // 下面也超出
      if (detaBottom < 0) {
        height = (rect.height + detaTop + detaBottom) * (1 / scale) + "px";
      }
      marked.style.height = height;
      marked.style.top = (rect.top - boxRect.top - detaTop) * (1 / scale) + "px";
    } else if (detaBottom < 0) {
      marked.style.height = (rect.height + detaBottom) * (1 / scale) + "px";
      marked.style.top = (rect.top - boxRect.top) * (1 / scale) + "px";
    } else {
      marked.style.height = rect.height * (1 / scale) + "px";
      marked.style.top = (rect.top - boxRect.top) * (1 / scale) + "px";
    }

    // 子元素下面超出父级范围
    if (detaLeft < 0) {
      let width = (rect.width + detaLeft) * (1 / scale) + "px";
      // 上面也超出
      if (detaRight < 0) {
        width = (rect.width + detaLeft + detaRight) * (1 / scale) + "px";
      }
      marked.style.width = width;
      marked.style.left = (rect.left - boxRect.left - detaLeft) * (1 / scale) + "px";
    } else if (detaRight < 0) {
      marked.style.width = (rect.width + detaRight) * (1 / scale) + "px";
      marked.style.left = (rect.left - boxRect.left) * (1 / scale) + "px";
    } else {
      marked.style.width = rect.width * (1 / scale) + "px";
      marked.style.left = (rect.left - boxRect.left) * (1 / scale) + "px";
    }
    marked.style.display = "block";
    if (cb) {
      cb();
    }
  }

  getScrolltContainer(el, cb) {
    let scrollHeight = el.scrollHeight;
    let offsetHeight = el.offsetHeight;
    let clientHeight = el.clientHeight;
    if (scrollHeight > clientHeight || offsetHeight > clientHeight) {
      if (cb) {
        cb();
      }
      this.parent = el;
    } else {
      el = el.parentNode;
      this.getScrolltContainer(el);
    }
  }
}

select.onchange = function (e) {
  ResizeBorderSignd.scale = e.target.value;
  container.style.setProperty("--scale", ResizeBorderSignd.scale);
};

ResizeBorderSignd.scale = 0.8;
ResizeBorderSignd.box = document.querySelector(".box");

const AR = new ResizeBorderSignd({
  marked: target,
  eventType: "click",
  isNeedScroll: true,
  cb: hiddenDashed,
});

const BR = new ResizeBorderSignd({
  eventType: "mouseover",
  marked: targetDashed,
  isNeedScroll: false,
});

function hiddenDashed() {
  targetDashed.style.display = "none";
}

// 处理浏览器窗口改变
window.onresize = throttle(AR.windowResizeHandle.bind(AR));
