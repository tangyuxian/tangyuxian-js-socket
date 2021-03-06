function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Socket {
  constructor(socketUrl, option) {
    _defineProperty(this, "socketUrl", void 0);

    _defineProperty(this, "option", void 0);

    _defineProperty(this, "websocket", void 0);

    _defineProperty(this, "sendPingInterval", void 0);

    _defineProperty(this, "reconnectInterval", void 0);

    _defineProperty(this, "activeLink", void 0);

    _defineProperty(this, "reconnectNum", 0);

    this.socketUrl = socketUrl;
    this.option = _objectSpread2({
      onOpenAutoSendMsg: "",
      heartTime: 5000,
      heartMsg: "ping",
      isReconnect: true,
      reconnectTime: 5000,
      reconnectCount: -1,
      openCallback: null,
      closeCallback: null,
      messageCallback: null,
      errorCallback: null,
      debug: false
    }, option);
    this.websocket = null;
    this.sendPingInterval = null; //???????????????

    this.reconnectInterval = null; //???????????????

    this.activeLink = true; //socket??????????????????

    this.reconnectNum = 0; //??????????????????

    this.init();
  }
  /**
   * ?????????
   */


  init() {
    if (!("WebSocket" in window)) {
      throw new Error("????????????????????????");
    }

    if (!this.socketUrl) {
      throw new Error("?????????????????????");
    }

    this.websocket = null;
    this.websocket = new window.WebSocket(this.socketUrl);
    this.websocketOnOpen(null);
    this.websocketOnMessage(null);
    this.websocketOnError(null);
    this.websocketOnClose(null);
  }
  /**
   * ????????????
   */


  websocketOnOpen(callback) {
    if (!(this.websocket instanceof window.WebSocket)) return;

    this.websocket.onopen = event => {
      if (this.option.debug) console.log("%c websocket????????????", "color:green");
      this.sendPing(this.option.heartTime, this.option.heartMsg);

      if (this.option.onOpenAutoSendMsg) {
        this.send(this.option.onOpenAutoSendMsg);
      }

      if (typeof callback === "function") {
        callback(event);
      } else {
        typeof this.option.openCallback === "function" && this.option.openCallback(event);
      }
    };
  }
  /**
   * ????????????
   * @param message
   */


  send(message) {
    if (!(this.websocket instanceof window.WebSocket)) return;

    if (this.websocket.readyState !== this.websocket.OPEN) {
      return;
    }

    this.websocket.send(message);
  }
  /**
   * ????????????????????????
   * @param callback
   */


  websocketOnMessage(callback) {
    if (!(this.websocket instanceof window.WebSocket)) return;

    this.websocket.onmessage = event => {
      // ??????????????????????????????????????????????????????
      if (typeof callback === "function") {
        callback(event.data);
      } else {
        typeof this.option.messageCallback === "function" && this.option.messageCallback(event.data);
      }
    };
  }
  /**
   * ????????????
   * @param callback
   */


  websocketOnError(callback) {
    if (!(this.websocket instanceof window.WebSocket)) return;

    this.websocket.onerror = event => {
      if (this.option.debug) console.error("??????????????????", event);

      if (typeof callback === "function") {
        callback(event);
      } else {
        typeof this.option.errorCallback === "function" && this.option.errorCallback(event);
      }
    };
  }
  /**
   * ????????????
   */


  websocketOnClose(callback) {
    if (!(this.websocket instanceof window.WebSocket)) return;

    this.websocket.onclose = event => {
      if (this.option.debug) console.warn("socket????????????,????????????:", event);
      clearInterval(this.sendPingInterval);
      clearInterval(this.reconnectInterval);

      if (this.activeLink && this.option.isReconnect) {
        this.onReconnect();
      } else {
        this.activeLink = false;
        if (this.option.debug) console.log("%c websocket??????????????????", "color:green");
      }

      if (typeof callback === "function") {
        callback(event);
      } else {
        typeof this.option.closeCallback === "function" && this.option.closeCallback(event);
      }
    };
  }
  /**
   * ????????????
   */


  onReconnect() {
    if (this.option.debug) console.warn(`???????????????,${this.option.reconnectTime}???????????????????????????`);

    if (this.option.reconnectCount === -1 || this.option.reconnectCount > this.reconnectNum) {
      this.reconnectInterval = setTimeout(() => {
        this.reconnectNum++;
        if (this.option.debug) console.warn(`???????????????${this.reconnectNum}?????????`);
        this.init();
      }, this.option.reconnectTime);
    } else {
      this.activeLink = false;
      if (this.option.debug) console.warn(`?????????${this.reconnectNum}?????????????????????,????????????`);
      clearInterval(this.reconnectInterval);
    }
  }
  /**
   * ??????socket?????????
   */


  removeSocket() {
    this.activeLink = false;
    if (!(this.websocket instanceof window.WebSocket)) return;
    this.websocket.close(1000);
  }
  /**
   * ????????????
   * @param time
   * @param ping
   */


  sendPing(time = 5000, ping = "ping") {
    clearInterval(this.sendPingInterval);
    if (time === -1) return;
    this.send(ping);
    this.sendPingInterval = setInterval(() => {
      this.send(ping);
    }, time);
  }
  /**
   * ??????websocket??????
   * @returns {null}
   */


  getWebsocket() {
    return this.websocket;
  }
  /**
   * ??????????????????
   */


  getActiveLink() {
    return this.activeLink;
  }

}

export { Socket as default };
