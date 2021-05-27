## 简介

> 对websocket进行一次简单的封装,加入心跳和重连机制,开箱即用

##  安装

``` shell
$ npm install/i tangyuxian-js-socket --save
```

##  api

> URL 对象实例化后的第一个参数是链接通道地址

例如:ws://192.168.1.101:8888/websocket/

> option对象中有一下属性

| 参数              | 类型     | 默认值 | 说明                                                         |
| ----------------- | -------- | ------ | ------------------------------------------------------------ |
| isReconnect       | Booble   | true   | 是否自动重连,启用后自动重连功能生效                          |
| reconnectTime     | Number   | 5000   | 在`isReconnect`为**true**时生效,设置每次重连的时间间隔,单位是毫秒 |
| reconnectCount    | Number   | -1     | 重连次数,默认不限制                                          |
| debug             | Booble   | false  | debug模式,开启后会在控制台打印连接情况                       |
| onOpenAutoSendMsg | Any      |        | 当连接成功后自动发送的消息内容,一般用于建立连接后发送当前客户端的身份标识用于登录 |
| heartTime         | Number   | 5000   | 心跳时间间隔,单位是毫秒,设置-1时不触发心跳                   |
| heartMsg          | Any      | 'ping' | 默认发送的心跳内容                                           |
| openCallback      | Function |        | 成功连接时的回调函数                                         |
| messageCallback   | Function |        | 接收到消息的回调函数                                         |
| errorCallback     | Function |        | 错误的回调函数                                               |
| closeCallback     | Function |        | 关闭时的回调函数                                             |

## Events

| 事件名             | 参数                            | 说明                                                         |
| ------------------ | :------------------------------ | ------------------------------------------------------------ |
| send               | message:Any                     | 需要发送的数据信息                                           |
| removeSocket       | -                               | 关闭socke连接并标记关闭状态,成功关闭可触发websocket默认关闭事件onclose |
| getWebsocket       | websocket:Object                | 获取实例化之后的websocket对象                                |
| getActiveLink      | type:Booble                     | 获取当前socket标记状态,当值为**false**时代表整个socket对象处于不可用状态 |
| websocketOnOpen    | callback:Function(event:Object) | websocket连接建立成功时的回调函数                            |
| websocketOnMessage | callback:Function(event:Object) | websocket接收到消息时可触发的回调函数                        |
| websocketOnError   | callback:Function(event:Object) | websocket出现连接错误时触发的回调函数                        |
| websocketOnClose   | callback:Function(event:Object) | websocket关闭时触发的回调函数                                |

## 用法示例


``` javascript
import Socket from 'tangyuxian-js-socket'
let url = "ws://192.168.1.101:8888/websocket"
let option = {
   debug:true,
   onOpenAutoSendMsg:JSON.stringify({id:'123456',type:"login"}),
   openCallback:res=>{
      console.log("建立连接成功",res)
      //...
   },
   messageCallback:res=>{
      console.log("接收到的消息",res) 
      //...
   }
   //...
}
let ws = new Socket(url,option)
//...
ws.removeSocket()
```

``` javascript
import { Socket } from 'tangyuxian-js-socket'
let url = "ws://192.168.1.101:8888/websocket"
let ws = new Socket(url)
ws.websocketOnOpen(res=>{
    console.log("建立连接成功",res)
    ws.send(JSON.stringify({id:'123456',type:"login"}))
    //...
})
ws.websocketOnMessage(res=>{
     console.log("接收到的消息",res) 
     //...
})
//...
ws.removeSocket()
```

## 许可证

本项目是根据麻省理工学院(MIT)的许可证授权, 详情可点击 [LICENSE](https://github.com/tangyuxian/tangyuxian-js-socket/blob/main/LICENSE) 文件查看.

