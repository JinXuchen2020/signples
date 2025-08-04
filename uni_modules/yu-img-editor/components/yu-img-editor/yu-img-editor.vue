<template>
	<view class="yu-img-editor-wrapper">
		<view class="yu-img-editor-canvas">
			<canvas 
				type="2d" 
				ref="imgEditorCanvas" 
				canvas-id="imgEditorCanvas" 
				id="imgEditorCanvas"
				style="width: 100%;height: 100%;" 
				@click.stop="onCanvasTap" 
				@mousedown.stop="onCanvasMousedown"
				@mousemove.stop="onCanvasMousemove" 
				@mouseup.stop="onCanvasMouseout" 
				@mouseout.stop="onCanvasMouseout"
				@touchstart.stop="onCanvasTouchstart" 
				@touchmove.stop="onCanvasTouchmove"
				@touchend.stop="onCanvasTouchend">
			</canvas>
		</view>
		<view class="yu-img-editor-toolbar">
			<view class="toolbar-item" v-for="(item,index) in tabList" :key="item.id" @click="onEditorTab(item.id)">
				<YuEditorIcon :name="item.icon" size="20px"></YuEditorIcon>
				<view class="name" v-text="item.name"></view>
			</view>
		</view>
		<YuTextToolbar :show.sync="showTextTool" :value="selectedElement" :fontList="fontList" @change="updateTextElement"></YuTextToolbar>
		<yuBgToolbar :show.sync="showBgTool" :imgList="bgImgList" @change="onChangeBgElement" @add="onUploadImageToBgElement"></yuBgToolbar>
		<YuLayerToolbar title="调整图层位置" closable :show.sync="showLayerTool" @change="onChangeLayer"></YuLayerToolbar>
	</view>
</template>
<script>
	import YuTextToolbar from "../yu-text-toolbar/yu-text-toolbar.vue"
	import YuBgToolbar from "../yu-bg-toolbar/yu-bg-toolbar.vue"
	import YuLayerToolbar from "../yu-layer-toolbar/yu-layer-toolbar.vue"
	import YuEditorIcon from "../yu-editor-icon/yu-editor-icon.vue"
	import BgElement from './BgElement.js'
	import RectElement from './RectElement.js'
	import Scene from './Scene.js'
	import { moveType } from "./constant.js"
	// 创建场景
	const scene = new Scene();
	export default {
		components: {
			YuTextToolbar,
			YuBgToolbar,
			YuLayerToolbar,
			YuEditorIcon
		},
		props: {
			bgUrl: {
				type: String,
				default () {
					return ''
				}
			},
			bgColor: {
				type: [String, Array],
				default () {
					return ''
				}
			},
			data: {
				type: Array,
				default () {
					return []
				}
			},
			bgImgList: {
				type: Array,
				default () {
					return []
				}
			},
			fontList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				platform: '',
				tabList: [{
						id: 1,
						name: '生成',
						icon: "save"
					}, {
						id: 2,
						name: '背景',
						icon: 'background',
					},
					{
						id: 3,
						name: '文字',
						icon: "text-add"
					},
					{
						id: 4,
						name: '图片',
						icon: 'pic-add',
					},
					{
						id: 5,
						name: '图层',
						icon: 'layer',
					},
				],
				canvasLeft: 0,
				canvasTop: 0,
				canvasWidth: 375,
				canvasHeight: 375,
				ctx: null,
				showTextTool: false,
				showBgTool: false,
				showLayerTool: false,
				selectedElement: null,
				isMultiTouch: false,
				isMousedown: false
			};
		},
		watch: {
			data: {
				handler: function(newVal, oldVal) {
					if (Array.isArray(newVal) && newVal.length > 0) {
						this.$nextTick(() => {
							this.init()
						})
					}
				},
				immediate: true,
				deep: true
			}
		},
		computed: {

		},
		mounted() {
			this.getDeviceInfo()
		},
		methods: {
			getDeviceInfo() {
				const sysInfo = uni.getSystemInfoSync();
				this.platform = sysInfo.platform;
			},
			init() {
				let query = uni.createSelectorQuery().in(this)
				query.select("#imgEditorCanvas").boundingClientRect(function() {}).exec((res => {
					const rect = res[0];
					this.canvasLeft = rect.left;
					this.canvasTop = rect.top;
					this.canvasWidth = rect.width;
					this.canvasHeight = rect.height;
					this.ctx = uni.createCanvasContext('imgEditorCanvas', this);
					// console.log(this.ctx)
					scene.init(this.canvasWidth, this.canvasHeight)
					this.initBg()
					this.initRect();
				}))
			},
			initBg() {
				let _color = this.bgColor;
				if (Array.isArray(this.bgColor) && this.bgColor.length > 0) {
					_color = this.ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
					const _list = this.bgColor;
					for (let i = 0, len = _list.length; i < len; i++) {
						let postion = i / (len - 1);
						if (i === 0) {
							postion = 0;
						} else if (i === len - 1) {
							postion = 1;
						}
						_color.addColorStop(postion, _list[i])
					}
				}
				const bg = new BgElement({
					color: _color,
					imgUrl: this.bgUrl,
					x: 0,
					y: 0,
					width: this.canvasWidth,
					height: this.canvasHeight
				});
				scene.setBgElement(bg)
			},
			initRect() {
				const arr = this.data;
				for (let i = 0, len = arr.length; i < len; i++) {
					let item = arr[i];
					const rect = new RectElement({
						...item,
						selected: !!(i === len - 1)
					});
					scene.addElement(rect);
				}
				scene.draw(this.ctx);
			},
			insertTextElement(value) {
				const rect = new RectElement({
					...value,
					selected: true
				});
				scene.addElement(rect);
				scene.draw(this.ctx);
				this.selectedElement = JSON.parse(JSON.stringify(scene.selectedElement));
				this.showTextTool = true;
			},
			updateTextElement(e) {
				if (scene.selectedElement && scene.selectedElement.selected) {
					scene.selectedElement.updateTextValue(e);
					scene.draw(this.ctx);
				}
			},
			insertImageElement(path) {
				this.getImageInfoSync(path).then((res) => {
					const rect = new RectElement({
						...res,
						selected: true
					});
					scene.addElement(rect);
					scene.draw(this.ctx);
				})
			},
			updateImageElement(path) {
				this.getImageInfoSync(path).then((res) => {
					scene.selectedElement.updateImageValue({
						...res
					});
					scene.draw(this.ctx);
				})
			},
			onChangeLayer(val) {
				if (!(scene.selectedElement && scene.selectedElement.selected)) return
				const el = scene.selectedElement;
				switch (val) {
					case 'top':
						scene.setElementTop(el)
						break;
					case 'up':
						scene.setElementUp(el)
						break;
					case 'bottom':
						scene.setElementBottom(el)
						break;
					case 'down':
						scene.setElementeDown(el)
						break;
					case 'align-left':
						el.alignCanvas({
							x: 0
						})
						break;
					case 'align-right':
						el.alignCanvas({
							x: this.canvasWidth - el.width
						})
						break;
					case 'align-top':
						el.alignCanvas({
							y: 0
						})
						break;
					case 'align-bottom':
						el.alignCanvas({
							y: this.canvasHeight - el.height
						})
						break;
					case 'align-horizontally':
						el.alignCanvas({
							x: (this.canvasWidth - el.width) / 2
						})
						break;
					case 'align-vertically':
						el.alignCanvas({
							y: (this.canvasHeight - el.height) / 2
						})
						break;
				}
				scene.draw(this.ctx)
			},
			handleSelectElement() {
				if (!(scene.selectedElement && scene.selectedElement.selected)) return
				const el = scene.selectedElement;
				if (el.moveType == moveType.POINT_TOP_LEFT) {
					/*删除*/
					scene.removeElement(el)
					scene.draw(this.ctx)
				} else if (el.moveType == moveType.POINT_BOTTOM_LEFT) {
					/*修改*/
					if (el.type === 'image') {
						this.showImageTool = true;
					} else if (el.type === 'text') {
						this.showTextTool = true;
					}
				}
			},
			onChangeBgElement(e) {
				if (e.type === 'color') {
					scene.updateBgColor(e.value)
				} else if (e.type === 'gradColor') {
					const gradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
					const _list = e.value.stops;
					for (let i = 0, len = _list.length; i < len; i++) {
						gradient.addColorStop(_list[i].position, _list[i].color)
					}
					scene.updateBgColor(gradient)
				} else if (e.type === 'image') {
					scene.updateBgImage(e.value)
				}
				scene.draw(this.ctx)
			},
			onCanvasMousedown(e) {
				if (this.platform !== "windows") return
				this.isMousedown = true;
				const mouseX = e.clientX - this.canvasLeft;
				const mouseY = e.clientY - this.canvasTop;
				// console.log('onCanvasMousedown', e.clientX, e.clientY)
				this.onStart(mouseX, mouseY)
			},
			onCanvasMousemove(e) {
				if (!this.isMousedown || this.platform !== "windows") return
				const mouseX = e.clientX - this.canvasLeft;
				const mouseY = e.clientY - this.canvasTop;
				this.onMove(mouseX, mouseY)
			},
			onCanvasMouseout() {
				if (this.platform !== "windows") return
				this.isMousedown = false;
				this.onEnd()
			},
			onCanvasTap(e) {
				// const px = e.detail.x - this.canvasLeft;
				// const py = e.detail.y - this.canvasTop;
				if (scene.selectedElement && scene.selectedElement.selected) {
					this.handleSelectElement();
				}
			},
			onCanvasTouchstart(e) {
				if (e.touches.length >= 2) {
					this.isMultiTouch = true;
					return
				}
				const startX = e.touches[0].x;
				const startY = e.touches[0].y;
				this.onStart(startX, startY)
			},
			onCanvasTouchmove(e) {
				if (this.isMultiTouch) return
				if (e.touches.length === 1) {
					let moveClientX = e.touches[0].x;
					let moveClientY = e.touches[0].y;
					this.onMove(moveClientX, moveClientY)
				}
			},
			onCanvasTouchend(e) {
				if (this.isMultiTouch) return
				this.onEnd()
			},
			onStart(x, y) {
				this.startClientX = x;
				this.startClientY = y;
				scene.clearSelection(this.ctx)
				const selectedElement = scene.getElementAt(x, y);
				this.selectedElement = JSON.parse(JSON.stringify(selectedElement));
				if (scene.selectedElement && scene.selectedElement.selected) {
					scene.draw(this.ctx);
					this.isMultiTouch = false;
				}
			},
			onMove(moveClientX, moveClientY) {
				if (scene.selectedElement && scene.selectedElement.selected) {
					let deltaX = moveClientX - this.startClientX;
					let deltaY = moveClientY - this.startClientY;
					if (scene.selectedElement.moveType == moveType.MOVE) {
						// console.log('移动')
						scene.selectedElement.delta(deltaX, deltaY)
						scene.draw(this.ctx)
					} else if (scene.selectedElement.moveType == moveType.POINT_RIGHT_BOTTOM) {
						// console.log('旋转缩放')
						// 旋转
						scene.selectedElement.rectRotate(moveClientX, moveClientY, this.startClientX, this.startClientY)
						// 缩放
						scene.selectedElement.rectPointScale(moveClientX, moveClientY, this.startClientX, this
							.startClientY)
						scene.draw(this.ctx)
					}
				}
			},
			onEnd() {
				if (scene.selectedElement && scene.selectedElement.selected) {
					scene.selectedElement.touchEndSetPoint()
				}
			},
			getImageInfoSync(imgPath) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgPath,
						success: (info) => {
							const aspectRatio = info.width / info.height;
							const width = 120; // 默认宽度
							const height = width / aspectRatio;
							let obj = {
								type: 'image',
								path: imgPath,
								x: this.canvasWidth / 2 - width / 2,
								y: this.canvasHeight / 2 - height / 2,
								width: width,
								height: height,
								rotate: 0,
								originalWidth: info.width,
								originalHeight: info.height
							}
							resolve(obj)
						},
						fail: (error) => {
							reject(error)
						}
					});
				})
			},
			onUploadImageToBgElement() {
				this.handleChooseImage((res) => {
					const url = res.tempFilePaths[0];
					this.bgImgList.unshift(url)
					scene.updateBgImage(url)
					scene.draw(this.ctx)
				})
			},
			onEditorTab(tabId) {
				if (tabId === 1) {
					this.onCreateImage();
				} else if (tabId === 2) {
					//设置背景
					this.showBgTool = true;
				} else if (tabId === 3) {
					//插入文本
					this.insertTextElement({
						type: 'text',
						text: '',
						x: this.canvasWidth / 2 - 45,
						y: this.canvasHeight / 2 - 14,
						width: 90,
						height: 28
					})
				} else if (tabId === 4) {
					//插入图片
					this.handleChooseImage((res) => {
						this.insertImageElement(res.tempFilePaths[0])
					})
				} else if (tabId === 5) {
					//修改图层
					this.showLayerTool = true;
				}
			},
			onCreateImage() {
				scene.clearSelection(this.ctx)
				uni.showLoading({
					title: '正在生成图片...'
				})
				this.$nextTick(() => {
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						canvasId: 'imgEditorCanvas',
						fileType: 'png',
						quality: 1,
						success: (res) => {
							this.$emit('save', res.tempFilePath)
						},
						fail: () => {
							uni.showToast({
								title: '生成失败',
								icon: 'none'
							})
						},
						complete: () => {
							uni.hideLoading()
						}
					})
				})
			},
			/*上传选择图片*/
			handleChooseImage(fn, options: UTSJSONObject) {
				let count = options.count || 1;
				let sourceType = options.sourceType || ['album', 'camera'];
				let sizeType = options.sizeType || ['original', 'compressed'];
				let isAvatar = options.isAvatar ? options.isAvatar : false;
				//#ifdef APP-PLUS
				let cropConfig = {
					width: 180,
					height: 180
				};
				let crop = isAvatar ? cropConfig : {};
				//#endif
				//#ifndef MP-WEIXIN
				uni.chooseImage({
					count,
					sizeType, //可以指定是原图还是压缩图，默认二者都有
					sourceType,
					//#ifdef APP-PLUS
					crop,
					//#endif
					success: function(res) {
						// console.log(res.tempFiles)
						fn && fn(res);
					}
				});
				//#endif
				//#ifdef MP-WEIXIN
				uni.chooseMedia({
					count,
					sizeType,
					sourceType,
					mediaType: ['image'],
					camera: 'back',
					success(res) {
						fn && fn(res);
					}
				})
				//#endif
			}
		}
	}
</script>
<style lang="scss" scoped>
	.yu-img-editor-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;

		.yu-img-editor-canvas {
			flex: 1;
			height: 0;
			width: 100%;
			/* #ifdef APP-ANDROID */
			// background-image: url("static/mosaic.png");
			background-size: 8px;
			/* #endif */
			/* #ifndef APP-ANDROID */
			// background-image: url("/uni_modules/yu-img-editor/static/mosaic.png");
			background-size: 16rpx;
			/* #endif */
		}

		.yu-img-editor-toolbar {
			position: relative;
			background-color: #fff;
			padding-bottom: 0;
			padding-bottom: 0;
			display: flex;
			align-items: center;

			

			.toolbar-item {
				flex: 1;
				text-align: center;
				padding: 10px 0;
				color: #666;
				line-height: 0;

				.name {
					padding-top: 2px;
					font-size: 12px;
					line-height: 1.5;
					color: #999;
				}
			}
		}
	}
</style>