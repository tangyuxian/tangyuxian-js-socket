import Socket from '../src/main'
import {JSDOM} from 'jsdom'

describe('Socket', () => {
  it('option', () => {
    const url = 'ws://192.168.1.101:8888/websocket'
    console.log(url)
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
    const ws = new Socket(url, option)
    //...
    ws.removeSocket()
    expect(ws).toBe(undefined)
  })

  // it('platform', () => {
  //   expect(log('win32', 'platform')).toBe(undefined)
  // })
})
