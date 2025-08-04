<template>
	<view class="yu-toolbar-wrapper">
		<view class="yu-toolbar-mask" :class="{'show':show}" @click.stop="hide" @touchmove.stop.prevent="hide"></view>
		<view class="yu-toolbar-dialog" :class="{'show':show}">
			<view class="yu-tool-tab">
				<view class="list" :class="{'list-active':tabIdx === index}" v-for="(item,index) in tabList" :key="item.id" @click="tabIdx = index">
					<YuEditorIcon :name="item.icon" size="20px"></YuEditorIcon>
					<view class="text" v-text="item.name"></view>
				</view>
			</view>
			<scroll-view class="yu-tool-content" scroll-y @touchmove.stop>
				<view class="font-setting" v-if="tabIdx === 0">
					<view class="font-item">
						<view class="label">文本</view>
						<view class="content content-inp">
							<textarea class="inp" v-model="fontValue.text" type="text" placeholder="请输入" @input="onInputText" auto-height></textarea>
							<!-- <input class="inp" v-model="fontValue.text" type="text" placeholder="请输入" @input="onInputText" /> -->
						</view>
					</view>
					<view class="font-item">
						<view class="label">样式</view>
						<view class="content content-icon">
							<view class="icon-list" hover-class="icon-list-active" 
							:class="{'icon-list-active':fontStyleObj[item.value] || fontStyleObj['align'] === item.value}" 
							v-for="(item,index) in fontStyleList" :key="index" @click="onStyleChange(item)">
								<YuEditorIcon :name="item.icon" size="16px"></YuEditorIcon>
							</view>
						</view>
					</view>
					<view class="font-item">
						<view class="label">旋转</view>
						<view class="content">
							<slider :value="fontValue.rotation" @change="onRotateChange" :min="0" :max="360" step="5" :block-size="18" show-value />
						</view>
					</view>
					<view class="font-item">
						<view class="label">字号</view>
						<view class="content">
							<slider :value="fontValue.fontSize" @change="onFontSizeChange" :min="14" :max="48" :block-size="18" show-value />
						</view>
					</view>
				</view>
				<view class="font-family-list" v-else-if="tabIdx === 1">
					<view class="list"
						:style="{fontFamily:item.value}"
						:class="{'list-active':fontValue.fontFamily === item.value}"
						v-for="(item,index) in fontFamilyList" :key="index"
						v-text="item.label"
						@click="onSetFontFamily(item.value)"></view>
				</view>
				<view class="color-wrapper" v-else-if="tabIdx === 2">
					<view class="color-list" :style="{backgroundColor:color,...setFontStyle(color)}" v-for="(color,index) in fontColorList" :key="color" @click="onSetFontColor(color)">
						<YuEditorIcon name="select" size="16px" v-show="fontValue.color === color"></YuEditorIcon>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import YuEditorIcon from "../yu-editor-icon/yu-editor-icon.vue"
	import {textDefaultValue as defaultValue} from '../yu-img-editor/constant.js'
	export default {
		components: {
			YuEditorIcon
		},
		props: {
			value: {
				type: Object,
				default () {
					return null
				}
			},
			fontList: {
				type: Array,
				default () {
					return []
				}
			},
			show: {
				type: Boolean,
				default () {
					return false
				}
			}
		},
		data() {
			return {
				tabIdx: 0,
				tabList: [{
						id: 1,
						name: '文本',
						icon: "text-style"
					},
					{
						id: 2,
						name: '字体',
						icon: "text"
					},
					{
						id: 3,
						name: '颜色',
						icon: 'platte',
					}
				],
				fontStyleList:[
					{
						name: '加粗',
						icon: "text-bold",
						value: 'bold',
						type:'bold'
					},
					{
						name: '斜体',
						icon: "text-italic",
						value: 'italic',
						type:'italic'
					},
					// {
					// 	name: '下划线',
					// 	icon: "text-underline",
					// 	value: 'underline',
					// 	type:'underline'
					// },
					// {
					// 	name: '居中对齐',
					// 	icon: "text-center",
					// 	value: 'center',
					// 	type: 'align'
					// },{
					// 	name: '左对齐',
					// 	icon: "text-left",
					// 	value: 'right',
					// 	type: 'align'
					// },{
					// 	name: '右对齐',
					// 	icon: "text-right",
					// 	value: 'left',
					// 	type: 'align'
					// }
				],
				fontStyleObj:{
					bold:false,
					italic:false,
					underline:false,
					align:'center'
				},
				fontFamilyList: [{
					label:'宋体',
					value:'SimSun'
				},{
					label:'仿宋',
					value:'FangSong'
				},{
					label:'黑体',
					value:'SimHei'
				},{
					label:'楷体',
					value:'KaiTi'
				},{
					label:'微软雅黑',
					value:'Microsoft YaHei'
				},],
				fontColorList: ['#000000', '#999999', '#ff0000', '#d600e9', '#5a00ff', '#006cff', '#00d1c5', '#009804', '#ffff00', '#ff6c00',
					'#1a1a1a', '#b3b3b3', '#f53333', '#dc28ec', '#7327ff', '#2b85ff', '#25ddd2', '#1db921', '#ffff7b', '#ff872e',
					'#333333', '#cccccc', '#ff6868', '#e657f3', '#8f52ff', '#579eff', '#49e7de', '#40ce43', '#cccc00', '#ff9f59',
					'#4d4d4d', '#e6e6e6', '#ff9898', '#ed80f7', '#ac7fff', '#80b6ff', '#74eee7', '#6cdd6f', '#e5e576', '#ffb986',
					'#666666', '#f2f2f2', '#ffc6c6', '#f8acff', '#c9abff', '#add0ff', '#a0f0eb', '#99e69b', '#9fd300', '#ffd5b6',
					'#808080', '#ffffff', '#ffe8e8', '#fcddff', '#ebe0ff', '#dfedff', '#dffbf9', '#d6f6d7', '#dbf393', '#fff2e8'
				],
				fontValue: { ...defaultValue }
			}
		},
		watch: {
			value: {
				handler: function(newVal, oldVal) {
					if (typeof(newVal) === 'object' && newVal !== null) {
						this.fontValue.text = newVal.text || defaultValue.text;
						this.fontValue.fontSize = newVal.fontSize || defaultValue.fontSize;
						this.fontValue.lineHeight = newVal.lineHeight || defaultValue.lineHeight;
						this.fontValue.fontStyle = newVal.fontStyle || defaultValue.fontStyle;
						this.fontValue.fontWeight = newVal.fontWeight || defaultValue.fontWeight;
						this.fontValue.fontFamily = newVal.fontFamily || defaultValue.fontFamily;
						this.fontValue.textAlign = newVal.textAlign || defaultValue.textAlign;
						this.fontValue.color = newVal.color || defaultValue.color;
						this.fontValue.rotation = newVal.rotation || defaultValue.rotation;
						this.fontStyleObj.align = this.fontValue.textAlign;
						this.fontStyleObj.bold = ['bold','bolder'].includes(this.fontValue.fontWeight);
						this.fontStyleObj.italic = ['italic','oblique'].includes(this.fontValue.fontStyle);
					}
				},
				deep: true
			},
			'show': function(newVal, oldVal) {
				if (!newVal) {
					this.fontValue = { ...defaultValue };
				}else{
					this.fontFamilyList = this.fontFamilyList.concat([...this.fontList])
				}
			}
		},
		mounted() {
			this.onInputText = this.debounce(this.onInputFn, 200);
		},
		methods: {
			setFontStyle(color) {
				if (['#ffffff', '#FFFFFF', 'white'].includes(color)) {
					return {
						color: '#666',
						borderColor: '#e6e6e6'
					}
				} else if (['#f2f2f2', '#e6e6e6', '#ffff7b', '#ffff00', '#e5e576', '#dbf393'].includes(color)) {
					return {
						color: '#666'
					}
				} else if (['#ffc6c6', '#ffe8e8'].includes(color)) {
					return {
						color: '#ff0000'
					}
				} else if (['#f8acff', '#fcddff'].includes(color)) {
					return {
						color: '#d600e9'
					}
				} else if (['#c9abff', '#ebe0ff'].includes(color)) {
					return {
						color: '#5a00ff'
					}
				} else if (['#add0ff', '#dfedff'].includes(color)) {
					return {
						color: '#006cff'
					}
				} else if (['#a0f0eb', '#dffbf9'].includes(color)) {
					return {
						color: '#00d1c5'
					}
				} else if (['#99e69b', '#d6f6d7'].includes(color)) {
					return {
						color: '#009804'
					}
				} else if (['#ffd5b6', '#fff2e8'].includes(color)) {
					return {
						color: '#ff6c00'
					}
				} else {
					return {
						color: '#ffffff'
					}
				}
			},
			debounce(func, delay = 300) {
				let timer;
				return function(...args) {
					const context = this;
					if (timer) clearTimeout(timer);
					timer = setTimeout(() => {
						func.apply(context, args);
					}, delay);
				};
			},
			onInputFn(e) {
				this.fontValue.text = e.detail.value;
				this.$emit('change', this.fontValue)
			},
			onRotateChange(e) {
				this.fontValue.rotation = e.detail.value;
				this.$emit('change', this.fontValue)
			},
			onFontSizeChange(e) {
				this.fontValue.fontSize = e.detail.value;
				this.$emit('change', this.fontValue)
			},
			onSetFontFamily(value) {
				this.fontValue.fontFamily = value;
				this.$emit('change', this.fontValue)
			},
			onSetFontColor(value) {
				this.fontValue.color = value;
				this.$emit('change', this.fontValue)
			},
			onStyleChange(e){
				if(e.type === 'align'){
					this.fontValue.textAlign = e.value;
					this.fontStyleObj.align = e.value;
				}else if(e.type === 'bold'){
					this.fontStyleObj.bold = !this.fontStyleObj.bold;
					this.fontValue.fontWeight = this.fontStyleObj.bold?'bold':'normal';
				}else if(e.type === 'italic'){
					this.fontStyleObj.italic = !this.fontStyleObj.italic;
					this.fontValue.fontStyle = this.fontStyleObj.italic?'italic':'normal';
				}else if(e.type === 'underline'){
					this.fontStyleObj.underline = !this.fontStyleObj.underline;
				}
				this.$emit('change', this.fontValue)
			},
			hide() {
				this.$emit("update:show", false);
				this.$emit('hide')
			},
			onConfirm() {
				this.$emit("update:show", false);
				this.$emit('confirm')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.a{
		font-family: sans-serif
	}
	@import "../../static/toolbar.scss";
</style>
