// 背景元素
class BgElement {
	constructor(option) {
		this.color = option.color || '';
		this.imgUrl = option.imgUrl  || '';
		this.x = option.x || 0;
		this.y = option.y || 0;
		this.width = option.width || 0;
		this.height = option.height || 0;
	}
	/**
	 * 绘制背景图片
	 * 图片优先级高于颜色
	 */
	drawBgImage(ctx) {
		if(!this.color && !this.imgUrl) return
		if(this.imgUrl){
			ctx.save();
			ctx.drawImage(this.imgUrl, this.x, this.y, this.width, this.height);
			ctx.restore();
		}else if(this.color){
			ctx.setFillStyle(this.color)
			ctx.fillRect(0, 0, this.width, this.height)
		}
	}
}

export default BgElement