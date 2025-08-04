<template>
	<view class="yu-toolbar-wrapper">
		<view class="yu-toolbar-mask" :class="{'show':show}" @click.stop="hide" @touchmove.stop.prevent="hide"></view>
		<view class="yu-toolbar-dialog" :class="{'show':show}">
			<scroll-view class="yu-tool-content" scroll-y>
				<view class="bg-settting">
					<view class="tool-title">背景颜色</view>
					<view class="color-wrapper">
						<view class="color-list" :class="{'color-list-transparent':bgColor === 'transparent'}" :style="{backgroundColor:bgColor,borderColor: bgColor === '#ffffff'? '#e6e6e6':'transparent'}" v-for="(bgColor,bgIdx) in bgColorList" :key="`color_${bgIdx}`" @click="onChangeBg(bgColor,'color')"></view>
					</view>
					<view class="color-wrapper">
						<view class="color-list" :style="{background:bgColor.raw,border:'none'}" v-for="(bgColor,bgIdx) in bgGradList" :key="`grad_color_${bgIdx}`" @click="onChangeBg(bgColor,'gradColor')"></view>
					</view>
					<view class="tool-title">背景图片</view>
					<view class="image-wrapper">
						<view class="image-list image-add" @click="onAddBgImage">
							<YuEditorIcon name="plus" size="20px"></YuEditorIcon>
						</view>
						<view class="image-list" v-for="(bgImage,bgIdx) in bgImageList" :key="bgIdx" @click="onChangeBg(bgImage,'image')">
							<image class="img" :src="bgImage" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import YuEditorIcon from "../yu-editor-icon/yu-editor-icon.vue"
	export default {
		components: {
			YuEditorIcon
		},
		props: {
			show: {
				type: Boolean,
				default () {
					return false
				}
			},
			imgList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				bgColorList: [ "transparent","#ffffff", '#000000', '#999999', '#ff3835', '#ff7270', '#ffbcbb', '#ff6d00', '#ffab40',
					'#ffd180', '#f7e335', '#fff6a5', '#37833b', '#54a857', '#98cb9a',
					'#01b455', '#39cb7d', '#86e5b3', '#16bfd4', '#47cedf', '#8debf7', '#1255fe', '#5182ff', '#b0c6ff',
					'#5730e5', '#8064ea', '#b5a3f5', '#f0308f', '#f375b3', '#eb9ef7'
				],
				bgGradList: [{
						"raw": "linear-gradient(180deg, #fad0c4 0%, #ffd1ff 100%)",
						"angle": 0,
						"stops": [{
								"color": "#fad0c4",
								"position": 0
							},
							{
								"color": "#ffd1ff",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #a18cd1 0%, #fbc2eb 100%)",
						"angle": 0,
						"stops": [{
								"color": "#a18cd1",
								"position": 0
							},
							{
								"color": "#fbc2eb",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
						"angle": 0,
						"stops": [{
								"color": "#ff9a9e",
								"position": 0
							},
							{
								"color": "#fecfef",
								"position": 0.99
							},
							{
								"color": "#fecfef",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #fbc2eb 0%, #a6c1ee 100%)",
						"angle": 0,
						"stops": [{
								"color": "#fbc2eb",
								"position": 0
							},
							{
								"color": "#a6c1ee",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #e0c3fc 0%, #8ec5fc 100%)",
						"angle": 0,
						"stops": [{
								"color": "#e0c3fc",
								"position": 0
							},
							{
								"color": "#8ec5fc",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
						"angle": 0,
						"stops": [{
								"color": "#FFE29F",
								"position": 0
							},
							{
								"color": "#FFA99F",
								"position": 0.48
							},
							{
								"color": "#FF719A",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #fa709a 0%, #fee140 100%)",
						"angle": 0,
						"stops": [{
								"color": "#fa709a",
								"position": 0
							},
							{
								"color": "#fee140",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #209cff 0%, #68e0cf 100%)",
						"angle": 0,
						"stops": [{
								"color": "#209cff",
								"position": 0
							},
							{
								"color": "#68e0cf",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #007adf 0%, #00ecbc 100%)",
						"angle": 0,
						"stops": [{
								"color": "#007adf",
								"position": 0
							},
							{
								"color": "#00ecbc",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #2CD8D5 0%, #6B8DD6 48%, #8E37D7 100%)",
						"angle": 0,
						"stops": [{
								"color": "#2CD8D5",
								"position": 0
							},
							{
								"color": "#6B8DD6",
								"position": 0.48
							},
							{
								"color": "#8E37D7",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #5271C4 0%, #ECA1FE 100%)",
						"angle": 0,
						"stops": [{
								"color": "#5271C4",
								"position": 0
							},
							{
								"color": "#ECA1FE",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #b721ff 0%, #21d4fd 100%)",
						"angle": 0,
						"stops": [{
								"color": "#b721ff",
								"position": 0
							},
							{
								"color": "#21d4fd",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #5f72bd 0%, #9b23ea 100%)",
						"angle": 0,
						"stops": [{
								"color": "#5f72bd",
								"position": 0
							},
							{
								"color": "#9b23ea",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
						"angle": 0,
						"stops": [{
								"color": "#667eea",
								"position": 0
							},
							{
								"color": "#764ba2",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #b224ef 0%, #7579ff 100%)",
						"angle": 0,
						"stops": [{
								"color": "#b224ef",
								"position": 0
							},
							{
								"color": "#7579ff",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #b3ffab 0%, #12fff7 100%)",
						"angle": 0,
						"stops": [{
								"color": "#b3ffab",
								"position": 0
							},
							{
								"color": "#12fff7",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #9be15d 0%, #00e3ae 100%)",
						"angle": 0,
						"stops": [{
								"color": "#9be15d",
								"position": 0
							},
							{
								"color": "#00e3ae",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #92fe9d 0%, #00c9ff 100%)",
						"angle": 0,
						"stops": [{
								"color": "#92fe9d",
								"position": 0
							},
							{
								"color": "#00c9ff",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #84fab0 0%, #8fd3f4 100%)",
						"angle": 0,
						"stops": [{
								"color": "#84fab0",
								"position": 0
							},
							{
								"color": "#8fd3f4",
								"position": 1
							}
						]
					},
					{
						"raw": "linear-gradient(180deg, #00cdac 0%, #8ddad5 100%)",
						"angle": 0,
						"stops": [{
								"color": "#00cdac",
								"position": 0
							},
							{
								"color": "#8ddad5",
								"position": 1
							}
						]
					}
				],
				bgImageList:[1,1,1,1]
			}
		},
		watch: {
			imgList: {
				handler: function(newVal, oldVal) {
					// console.log('监听')
					if (Array.isArray(newVal)) {
						this.bgImageList = [...newVal]
					}
				},
				immediate: true,
				deep: true
			}
		},
		mounted() {
			
		},
		methods: {
			onAddBgImage() {
				this.$emit('add')
			},
			onChangeBg(value, type) {
				this.$emit('change', {
					type,
					value
				})
			},
			hide() {
				this.$emit("update:show", false);
				this.$emit('hide')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../static/toolbar.scss";
	.color-list-transparent{
		background-image: url("../../static/mosaic.png");
		background-size: 12px;
		overflow: hidden;
	}
	
</style>