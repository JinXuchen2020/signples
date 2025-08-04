import {moveType,icon,textDefaultValue} from "./constant.js"
// 矩形元素类
class RectElement {
	// 中心点坐标
	centerX = 0
	centerY = 0
	// 逻辑宽高
	logWidth = 0
	logHeight = 0
	moveType = moveType.MOVE
	pointRadius = 12 //坐标点的有效点击范围
	constructor(option) {
		this.type = option.type; //类型：文本、图片
		this.text = option.text; //文本内容
		this.path = option.path; //图片路径
		this.x = option.x || 0; // 坐标原点x
		this.y = option.y || 0; // 坐标原点y
		this.lastX = this.x; // 上次停留的x坐标
		this.lastY = this.y; // 上次停留的y坐标
		this.selected = option.selected || false; //是否选中状态
		this.width = option.width || 0; //元素宽
		this.height = option.height || 0; //元素高
		this.lineHeight = option.lineHeight || 1.5; //文本--行高
		this.fontStyle = option.fontStyle || 'normal'; //文本--字体样式
		this.fontWeight = option.fontWeight || 'normal'; //文本--字体粗细
		// this.textAlign = option.textAlign || 'center'; //文本--对齐方式
		this.fontSize = option.fontSize || textDefaultValue.fontSize; //文本--字体大小
		this.lastFontSize = this.fontSize;
		this.fontFamily = option.fontFamily || textDefaultValue.fontFamily; //文本--字体
		this.color = option.color || textDefaultValue.color; //文本--字体颜色
		this.rotation = option.rotation || textDefaultValue.rotation; //旋转的角度
		this.lastRotation = this.rotation; //上一次旋转的角度
		this.angle = this.rotation * Math.PI / 180; //旋转角度（弧度）
		this.lastAngle = this.angle; //上一次旋转角度（弧度）
	}
	//通过计算更新初始值
	updateInitValue() {
		if (this.moveType === moveType.MOVE || this.moveType === moveType.POINT_BOTTOM_LEFT) {
			this.centerX = this.x + this.width / 2;
			this.centerY = this.y + this.height / 2;
			this.logWidth = this.width;
			this.logHeight = this.height;
		}
	}
	//通过设置更新图片image类型参数
	updateImageValue(e) {
		this.path = e.path;
		this.width = e.width || 0;
		this.height = e.height || 0;
	}
	//通过设置更新文本text类型参数
	updateTextValue(e) {
		this.text = e.text;
		if(e.fontFamily){
			this.fontFamily = e.fontFamily;
		}
		if(e.color){
			this.color = e.color;
		}
		if(e.fontSize){
			this.fontSize = e.fontSize;
			this.lastFontSize = e.fontSize;
		}
		if(e.fontStyle){
			this.fontStyle = e.fontStyle;
		}
		if(e.fontWeight){
			this.fontWeight = e.fontWeight;
		}
		// if(e.textAlign){
		// 	this.textAlign = e.textAlign
		// }
		if(typeof(e.rotation) === 'number'){
			this.rotation = e.rotation;
			this.lastRotation = this.rotation;
			this.angle = this.rotation * Math.PI / 180;
			this.lastAngle = this.angle;
		}
	}
	/**
	 * @param {string} text 需要切割的字符串 会按回车、<br/>进行切割
	 */
	splitByBreaks(text) {
		return text.split(/<br\s*\/?>|\n+/).filter(val => val.length > 0);
	}
	// 绘制文本元素
	drawTextElement(ctx) {
		ctx.save();
		ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`; // 设置文字样式
		ctx.fillStyle = this.color;
		ctx.textAlign = 'center';//this.textAlign;
		// ctx.textBaseline = 'middle';
		const textList = this.splitByBreaks(this.text);
		let lines = [],lineWidths = []; 
		for (let i = 0, len = textList.length; i < len; i++) {
			const _lineText = textList[i];
			if (this.moveType !== moveType.POINT_RIGHT_BOTTOM) {
				const metrics = ctx.measureText(_lineText).width + 16; // 测量文字宽度
				lineWidths.push(metrics);
			}
			lines.push(_lineText);
		}
		const _height = this.fontSize * this.lineHeight; //根据字高计算的单行文本高度
		if (this.moveType !== moveType.POINT_RIGHT_BOTTOM) {
			this.width = Math.max(...lineWidths, this.width);
			this.height = Math.max(lines.length * _height + 8, 30); //最小高度30
		}
		this.updateInitValue();
		ctx.translate(this.centerX, this.centerY); // 移动到元素中心
		ctx.rotate(this.angle); // 旋转
		// 绘制文字
		let currentY = -this.height / 2 + this.fontSize + 4; // 初始Y位置（垂直居中）
		for (var j = 0; j < lines.length; j++) {
			ctx.fillText(lines[j].trim(), 0, currentY);
			currentY += _height;
		}
		// ctx.fillText(this.text, 0, 0);
		// 如果选中，绘制边框
		if (this.selected) {
			this.drawRectangle(ctx)
		}
		ctx.restore();
	}
	// 绘制矩形边框
	drawRectangle(ctx) {
		const x = -this.width / 2;
		const y = -this.height / 2;
		const w = this.width;
		const h = this.height;
		const circleRadius = 6;
		ctx.save()

		ctx.strokeStyle = '#FFF' // '#3565ee'
		ctx.setFillStyle('#FFF')
		ctx.beginPath()
		ctx.strokeRect(x, y, w, h)
		ctx.closePath()

		ctx.beginPath()
		ctx.arc(x, y, circleRadius + 2, 0, 2 * Math.PI)
		ctx.fill()
		// ctx.stroke()
		ctx.closePath()

		ctx.drawImage(icon.close, x - circleRadius, y - circleRadius, 2 * circleRadius, 2 * circleRadius);

		ctx.beginPath()
		ctx.arc(x + w, y + h, circleRadius + 2, 0, 2 * Math.PI)
		ctx.fill()
		// ctx.stroke()
		ctx.closePath()

		ctx.drawImage(icon.rotation, x + w - circleRadius, y + h - circleRadius, 2 * circleRadius, 2 * circleRadius);

		ctx.beginPath()
		ctx.arc(x, y + h, circleRadius + 2, 0, 2 * Math.PI)
		ctx.fill()
		// ctx.stroke()
		ctx.closePath()

		ctx.drawImage(icon.edit, x - circleRadius, y + h - circleRadius, 2 * circleRadius, 2 * circleRadius);

		ctx.beginPath()
		/* strokeRect */
		ctx.fillRect(x + w - 3, y - 3, 6, 6)
		ctx.closePath()

		ctx.restore()
	}
	// 绘制图片元素
	drawImageElement(ctx) {
		ctx.save();
		this.updateInitValue();
		ctx.translate(this.centerX, this.centerY); // 移动到元素中心
		ctx.rotate(this.angle); // 旋转
		// 绘制图片
		ctx.drawImage(
			this.path,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		);
		// 如果选中，绘制边框
		if (this.selected) {
			this.drawRectangle(ctx)
		}
		ctx.restore();
	}
	/**
	 * 对齐画布
	 * @param {Object} option
	 * |- {number} x 元素x坐标
	 * |- {number} y 元素y坐标
	 */
	alignCanvas(option) {
		if(option && typeof(option.x) === 'number'){
			this.x = option.x;
			this.centerX = this.x + this.width / 2;
		}
		if(option && typeof(option.y) === 'number'){
			this.y = option.y;
			this.centerY = this.y + this.height / 2;
		}
	}
	/**
	 * @param {number} deltaX x方向平移的距离 可为负值
	 * @param {number} deltaY y方向平移的距离 可为负值
	 */
	delta(deltaX, deltaY) {
		this.x = this.lastX + deltaX;
		this.y = this.lastY + deltaY;
		this.centerX = this.x + this.logWidth / 2;
		this.centerY = this.y + this.logHeight / 2;
	}
	touchEndSetPoint() {
		if (this.moveType === moveType.POINT_RIGHT_BOTTOM) {
			this.lastRotation = this.rotation;
			this.lastAngle = this.angle;
			this.lastFontSize = this.fontSize;
		}
		this.lastX = this.x;
		this.lastY = this.y;
		this.logWidth = this.width;
		this.logHeight = this.height;
		// console.log(this.x,this.y,this.centerX,this.centerY,this.width,this.height)
	}
	/**
	 * 元素缩放
	 * @param {number} endX 结束点x坐标
	 * @param {number} endY 结束点y坐标
	 * @param {number} startX 开始点x坐标
	 * @param {number} startY 开始点y坐标
	 */
	rectPointScale(endX, endY, startX, startY) {
		if (this.moveType == moveType.POINT_RIGHT_BOTTOM) {
			const startLine = Math.sqrt(Math.pow(this.centerX - startX, 2) + Math.pow(this.centerY - startY, 2));
			const endLine = Math.sqrt(Math.pow(this.centerX - endX, 2) + Math.pow(this.centerY - endY, 2));
			const ratio = endLine / startLine;
			const w = this.logWidth * ratio;
			const h = w * (this.logHeight / this.logWidth);
			this.width = w;
			this.height = h;
			this.x = this.centerX - w / 2;
			this.y = this.centerY - h / 2;
			this.fontSize = Math.round(this.lastFontSize * ratio);
			// this.x = this.lastX - (w - this.logWidth) / 2;
			// this.y = this.lastY - (h - this.logHeight) / 2;
		}
	}
	/**元素旋转
	 * @param {number} endX 结束点x坐标
	 * @param {number} endY 结束点y坐标
	 * @param {number} startX 开始点x坐标
	 * @param {number} startY 开始点y坐标
	 */
	rectRotate(endX, endY, startX, startY) {
		let angleBefore = Math.atan2(startY - this.centerY, startX - this.centerX) / Math.PI * 180;
		let angleAfter = Math.atan2(endY - this.centerY, endX - this.centerX) / Math.PI * 180;
		this.rotation = Math.round(angleAfter - angleBefore) + this.lastRotation;
		this.angle = this.rotation * Math.PI / 180;
	}
	/**矩形检测
	 * @param {number} px 点击位置旋转转换后的x坐标
	 * @param {number} py 点击位置旋转转换后的y坐标
	 * @param {number} x 元素x坐标
	 * @param {number} y 元素y坐标
	 * @param {number} width 元素宽
	 * @param {number} height 元素高
	 */
	isPointInRect(px, py, x, y, width, height) {
		return px >= x &&
			px <= x + width &&
			py >= y &&
			py <= y + height
	}
	/**圆形检测
	 * @param {number} px 点击位置旋转转换后的x坐标
	 * @param {number} py 点击位置旋转转换后的y坐标
	 * @param {number} x 圆心的X坐标
	 * @param {number} y 圆心的y坐标
	 * @param {number} radius 圆的半径
	 */
	isPointInCircle(px, py, x, y, radius) {
		const dx = px - x;
		const dy = py - y;
		return dx * dx + dy * dy <= radius * radius;
	}
	/**
	 * @param {number} value 设置操作类型
	 */
	setMoveType(value = moveTypeList.MOVE) {
		this.moveType = value
	}
	/**
	 * 点击/触摸点反向旋转
	 * @param {number} px 点击位置横坐标
	 * @param {number} py 点击位置纵坐标
	 */
	pointReverseRotate(px, py) {
		const dx = px - this.centerX;
		const dy = py - this.centerY;
		// 反向旋转点坐标
		const cos = Math.cos(-this.angle);
		const sin = Math.sin(-this.angle);

		const localX = dx * cos - dy * sin;
		const localY = dx * sin + dy * cos;
		return { x: localX + this.centerX, y: localY + this.centerY, localX, localY }
	}
	/**
	 * 点击/触摸点是否在有效矩形区域
	 * @param {number} px 点击位置横坐标
	 * @param {number} py 点击位置纵坐标
	 */
	isPointInside(px, py) {
		const { localX, localY } = this.pointReverseRotate(px, py);
		return Math.abs(localX) <= this.width / 2 && Math.abs(localY) <= this.height / 2
	}
	/**
	 * 点击并判断区域(四点判断，八点请用checkClickArea2)
	 * @param {number} px 点击位置横坐标
	 * @param {number} py 点击位置纵坐标
	 * @return {boolean} 返回是否在点击区域
	 */
	checkClickArea(px, py) {
		const { p0, p2, p4, p6 } = this.getRectPoint();
		const { x, y, localX, localY } = this.pointReverseRotate(px, py);
		const radius = this.getNewPointRadius();
		let isPointInside = true;
		if (this.isPointInCircle(x, y, p0.x, p0.y, radius)) {
			/*左上 ↖ */
			console.log('↖')
			this.setMoveType(moveType.POINT_TOP_LEFT)
		} else if (this.isPointInCircle(x, y, p2.x, p2.y, radius)) {
			/*右上 ↗ */
			console.log('↗')
			this.setMoveType(moveType.POINT_TOP_RIGHT)
		} else if (this.isPointInCircle(x, y, p4.x, p4.y, radius)) {
			/*右下 ↘ */
			console.log('↘')
			this.setMoveType(moveType.POINT_RIGHT_BOTTOM)
		} else if (this.isPointInCircle(x, y, p6.x, p6.y, radius)) {
			/*左下 ↙ */
			console.log('↙')
			this.setMoveType(moveType.POINT_BOTTOM_LEFT)
		} else if (this.isPointInRect(x, y, this.x, this.y, this.width, this.height)) {
			console.log('IN')
			this.setMoveType(moveType.MOVE)
		} else {
			console.log('OUT')
			isPointInside = false;
			this.setMoveType(moveType.MOVE)
		}
		return isPointInside
	}
	checkClickArea2(px, py) {
		const { p0, p1, p2, p3, p4, p5, p6, p7 } = this.getRectPoint();
		const { x, y, localX, localY } = this.pointReverseRotate(px, py);
		const radius = this.getNewPointRadius();
		let isPointInside = true;
		if (this.isPointInCircle(x, y, p0.x, p0.y, radius)) {
			/*左上 ↖ */
			console.log('↖')
			this.setMoveType(moveType.POINT_TOP_LEFT)
		} else if (this.isPointInCircle(x, y, p1.x, p1.y, radius)) {
			/*上中 ↑ */
			console.log('↑')
			this.setMoveType(moveType.POINT_TOP)
		} else if (this.isPointInCircle(x, y, p2.x, p2.y, radius)) {
			/*右上 ↗ */
			console.log('↗')
			this.setMoveType(moveType.POINT_TOP_RIGHT)
		} else if (this.isPointInCircle(x, y, p3.x, p3.y, radius)) {
			/*右中 → */
			console.log('→')
			this.setMoveType(moveType.POINT_RIGHT)
		} else if (this.isPointInCircle(x, y, p4.x, p4.y, radius)) {
			/*右下 ↘ */
			console.log('↘')
			this.setMoveType(moveType.POINT_RIGHT_BOTTOM)
		} else if (this.isPointInCircle(x, y, p5.x, p5.y, radius)) {
			/*下中 ↓ */
			console.log('↓')
			this.setMoveType(moveType.POINT_BOTTOM)
		} else if (this.isPointInCircle(x, y, p6.x, p6.y, radius)) {
			/*左下 ↙ */
			console.log('↙')
			this.setMoveType(moveType.POINT_BOTTOM_LEFT)
		} else if (this.isPointInCircle(x, y, p7.x, p7.y, radius)) {
			/*左中 ← */
			console.log('←')
			this.setMoveType(moveType.POINT_LEFT)
		} else if (this.isPointInRect(x, y, this.x, this.y, this.width, this.height)) {
			console.log('IN')
			this.setMoveType(moveType.MOVE)
		} else {
			console.log('OUT')
			isPointInside = false;
			this.setMoveType(moveType.MOVE)
		}
		return isPointInside
	}
	/**
	 * 根据形状大小判断可用点击区域
	 */
	getNewPointRadius(){
		const row = this.height / 2;
		const column = this.width / 2;
		if (column >= row) {
			return (row > 2 * this.pointRadius) ? this.pointRadius : row / 2
		}
		return (column > 2 * this.pointRadius) ? this.pointRadius : column / 2
	}
	/**
	 * 获取矩形框8点坐标
	 */
	getRectPoint() {
		const borderGap = this.getNewPointRadius() / 2; //边距，能超出父矩形框的距离,可用半径的一半
		/*左上 ↖ */
		const p0 = {
			x: this.x + borderGap,
			y: this.y + borderGap
		}
		/*上中 ↑ */
		const p1 = {
			x: this.x + this.width / 2,
			y: this.y + borderGap
		}
		/*右上 ↗ */
		const p2 = {
			x: this.x + this.width - borderGap,
			y: this.y + borderGap
		}
		/*右中 → */
		const p3 = {
			x: this.x + this.width - borderGap,
			y: this.y + this.height / 2
		}
		/*右下 ↘ */
		const p4 = {
			x: this.x + this.width - borderGap,
			y: this.y + this.height - borderGap
		}
		/*下中 ↓ */
		const p5 = {
			x: this.x + this.width / 2,
			y: this.y + this.height - borderGap
		}
		/*左下 ↙ */
		const p6 = {
			x: this.x + borderGap,
			y: this.y + this.height - borderGap
		}
		/*左中 ← */
		const p7 = {
			x: this.x + borderGap,
			y: this.y + this.height / 2
		}
		return { p0, p1, p2, p3, p4, p5, p6, p7 }
	}
}

export default RectElement