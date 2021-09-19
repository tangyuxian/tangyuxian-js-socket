import TsSocket from '../src/main'
import JsSocket from '../lib/Socket.js'
import {JSDOM} from 'jsdom'
const { window } = new JSDOM('<!doctype html><html><body></body></html>'); //导出JSDOM中的window对象
// @ts-ignore
global.window = window; //将window对象设置为nodejs中全局对象;
describe('Socket', () => {
  const url = 'ws://192.168.31.11:8888/websocket'
  const option = {
    debug: true,
    onOpenAutoSendMsg: JSON.stringify({ id: '123456', type: 'login' }),
    openCallback: (res: any) => {
      console.log('建立连接成功', res)
      //...
    },
    messageCallback: (res: any) => {
      console.log('接收到的消息', res)
      //...
    }
    //...
  }
  /**
   * @jest-environment jsdom
   */
  it('typeScript', () => {
    const ws = new TsSocket(url, option)
    //...
    jest.setTimeout(5000)
    // ws.removeSocket()
    let getActiveLink = ws.getActiveLink();
    expect(getActiveLink).toBe(true)
  })

  /**
   * @jest-environment jsdom
   */
  it('javascript', () => {
    const ws = new JsSocket(url, option)
    //...
    jest.setTimeout(5000)
    // ws.removeSocket()
    let getActiveLink = ws.getActiveLink();
    expect(getActiveLink).toBe(true)
  })
})
