# ns-unzip
### 开发文档
[UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
[UTS API插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
[UTS 组件插件](https://uniapp.dcloud.net.cn/plugin/uts-component.html)
[Hello UTS](https://gitcode.net/dcloud/hello-uts)
### 使用插件
```javascript
import { Ziper} from "@/uni_modules/ns-unzip"
const ziper = new Ziper("zipFilePath");
//设置编码，中文出现乱码时使用
ziper.setCharset("UTF8" | "GBK")
//其他方法实参同此方法
ziper.addFile({
	"path":"descFilePath",
	"onend":(result)=>{
		...
	}
})
```
### 声明文件
```typescript
type end = (res:string)=>void;
type initType = {
		zipfilepath : string,
		password ?: string
		}
type optType = {
	path:string,
	onend?:end
}
interface ZiperType {
	/**
	 * @abstract 创建包含单个文件的zip文件或者将单个文件添加到现有zip
	 * @param path 要添加进zip的文件路径
	 * @param onend 操作完成后的回调函数
	 */
	addFile(opt:optType):void;
	/**
	 * @abstract 使用文件夹来创建zip文件或者向现有zip添加文件夹
	 * @param path 文件夹路径
	 * @param onend 操作完成后的回调函数
	 */
	addFolder(opt:optType):void;
	/**
	 * @abstract 提取zip文件中的所有文件
	 * @param path 将会在此目录下存储解压后的文件
	 * @param onend 操作完成后的回调函数
	 */
	extractAll(opt:optType):void;
	/**
	 * @abstract 设置编码，出现乱码时可以尝试改变编码，默认为UTF8
	 * @param charser "UTF8" | "GBK"
	 */
	setCharset( charset:string):void;
}


export class Ziper implements ZiperType {
	/**
	 * @param zipfilepath:要解压或创建的zip文件路径
	 * @param password:可选参数，仅在解压被密码保护的zip文件时使用
	 */
	constructor(init : initType);
	public extractAll( opt:optType) : void;
	public addFolder(opt:optType) : void;
	public addFile(opt:optType) : void;
	public setCharset(charset : string) : void
}
```