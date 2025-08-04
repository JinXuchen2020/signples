# udp广播，包含客户端和服务端，支持Android和iOS

## 集成步骤:

- 拷贝demo里的Info.plist、nativeResources文件夹到项目根目录下
- iOS打包的provisioining profile文件需要开通组播权限，参考https://www.jianshu.com/p/c2f6e6aa41a3?v=1682211826634
- 参考[https://www.cnblogs.com/wenrisheng/p/18323027](https://www.cnblogs.com/wenrisheng/p/18323027)集成本插件到项目里

## 接口

```javascript

import {
	UTSUdpServer,
	UTSUdpClient
} from "@/uni_modules/wrs-uts-udp"
// 服务端如果有多个端口需要监听，请使用多个变量，每个变量监听一个端口
let server = new UTSUdpServer()
// let server1 = new UTSUdpServer()
// let server2 = new UTSUdpServer()

let client = new UTSUdpClient()

```

### 客户端

- 设置回调


```javascript

client.onCallback((resp) => {
	this.showMsg(JSON.stringify(resp))
	let opt = resp.opt
	switch (opt) {
		case "sendSuc": {
			this.showMsg("发送成功:" + resp.id)
		}
		break;
		case "sendFail": {
			this.showMsg("发送失败:" + resp.id)
		}
		break;
		default:
			break;
	}
})

```

- 发送数据


```javascript

let params = {}
params.ip = this.ip // 服务端IP，如果ip是255.255.255.255表示广播
params.port = parseInt(this.port) // 服务端端口
// data是十六进制数据，如果需要进制转换、ASCII、modbus、crc等，请使用插件https://ext.dcloud.net.cn/plugin?id=19206
params.data = [0x00, 0xFF] // data可以是十六进制的数组
params.id = 123121 // 可选参数，发送指令ID，整形，可自定义
client.send(params)

```

### 服务端

- 启动服务

```javascript

let params = {}
params.port = parseInt(this.port) // 监听端口
params.cacheSize = 1024 // cacheSize目前仅支持Android
let result = server.start(params)
if (result.flag) {
	this.showMsg("启动成功")
} else {
	this.showMsg("启动失败:" + JSON.stringify(result))
}

```

- 停止服务

```

server.stop()

```