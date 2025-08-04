class Scene {
	canvasWidth = 375
	canvasHeight = 375
	selectedElement = null
	constructor() {
		this.bgElement = null;
		this.elements = [];
	}
	init(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
	}

	setBgElement(element) {
		this.bgElement = element;
	}
	
	//修改背景颜色
	updateBgColor(color) {
		this.bgElement.color = color;
		this.bgElement.imgUrl = '';
	}
	
	//修改背景图片
	updateBgImage(imgUrl) {
		// console.log('设值')
		this.bgElement.color = '';
		this.bgElement.imgUrl = imgUrl;
	}
	
	addElement(element) {
		for (let i = 0, len = this.elements.length; i < len; i++) {
			let item = this.elements[i];
			item.selected = false;
			if (item.type === 'text' && !item.text) {
				/*清除文本为空的示例*/
				this.elements.splice(i, 1)
			}
		}
		this.elements.push(element);
	}

	draw(ctx) {
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.bgElement.drawBgImage(ctx);
		// this.fillBlank(ctx)
		// 绘制所有元素（按添加顺序，后添加的在上层）
		this.elements.forEach(element => {
			if (element.selected) {
				this.selectedElement = element;
			}
			if (element.type === 'text') {
				element.drawTextElement(ctx);
			} else if (element.type === 'image') {
				element.drawImageElement(ctx);
			}
		});
		ctx.draw()
	}

	// 检测点击，返回最上层的命中元素
	getElementAt(px, py) {
		// 从后向前检查（上层元素优先）
		for (let i = this.elements.length - 1; i >= 0; i--) {
			const isInside = this.elements[i].checkClickArea(px, py);
			if (isInside) {
				this.elements[i].selected = true;
				this.selectedElement = this.elements[i];
				return this.elements[i]
			}
		}
		this.selectedElement = null
		return null;
	}

	//将画布填空成白板
	fillBlank(ctx) {
		ctx.setFillStyle('#4CD964')
		ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
	}

	// 清除所有选中状态
	clearSelection(ctx) {
		this.elements.forEach(element => {
			element.selected = false;
		});
		this.draw(ctx)
	}

	// 将元素提到最前
	removeElement(element) {
		const index = this.elements.indexOf(element);
		if (index > -1) {
			this.elements.splice(index, 1);
		}
	}

	// 将元素提到最前
	setElementTop(element) {
		const index = this.elements.indexOf(element);
		if (index > -1) {
			this.elements.splice(index, 1);
			this.elements.push(element);
		}
	}

	// 将元素移到最后
	setElementBottom(element) {
		const index = this.elements.indexOf(element);
		if (index > -1) {
			this.elements.splice(index, 1);
			this.elements.unshift(element);
		}
	}

	// 将元素上移一层
	setElementUp(element) {
		const index = this.elements.indexOf(element);
		if (index > -1 && index < this.elements.length - 1) {
			[this.elements[index], this.elements[index + 1]] = [this.elements[index + 1], this.elements[index]];
		}
	}

	// 将元素下移一层
	setElementeDown(element) {
		const index = this.elements.indexOf(element);
		if (index > 0) {
			[this.elements[index], this.elements[index - 1]] = [this.elements[index - 1], this.elements[index]];
		}
	}
}

export default Scene
