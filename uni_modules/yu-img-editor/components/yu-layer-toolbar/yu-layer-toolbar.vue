<template>
	<view class="yu-toolbar-wrapper">
		<view class="yu-toolbar-mask" :class="{'show':show}" @click.stop="hide" @touchmove.stop.prevent="hide"></view>
		<view class="yu-toolbar-dialog" :class="{'show':show}">
			<view class="yu-tool-title">
				<view class="icon-wrapper" v-if="closable"></view>
				<view class="title" v-text="title"></view>
				<view class="icon-wrapper" v-if="closable" @click="hide">
					<image class="icon" src="../../static/close.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="yu-tool-layer">
				<view class="layer-list" hover-class="layer-list-active" v-for="(item,index) in layerList" :key="item.id" @click="onChange(item)">
					<YuEditorIcon :name="item.icon" size="20px"></YuEditorIcon>
					<view class="text" v-text="item.name"></view>
				</view>
			</view>
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
			title: {
				type: String,
				default () {
					return ''
				}
			},
			closable: {
				type: Boolean,
				default () {
					return false
				}
			}
		},
		data() {
			return {
				layerList: [{
						id: 1,
						name: '置顶',
						icon: "top",
						value: 'top'
					},
					{
						id: 2,
						name: '上移',
						icon: "up",
						value: 'up'
					},
					{
						id: 3,
						name: '下移',
						icon: 'down',
						value: 'down'
					},
					{
						id: 4,
						name: '置底',
						icon: 'bottom',
						value: 'bottom'
					},
					{
						id: 5,
						name: '左对齐',
						icon: "align-left",
						value: 'align-left'
					},
					{
						id: 6,
						name: '右对齐',
						icon: "align-right",
						value: 'align-right'
					},
					{
						id: 7,
						name: '顶对齐',
						icon: 'align-top',
						value: 'align-top'
					},
					{
						id: 8,
						name: '底对齐',
						icon: 'align-bottom',
						value: 'align-bottom'
					},
					{
						id: 9,
						name: '水平居中',
						icon: 'align-horizontally',
						value: 'align-horizontally'
					},
					{
						id: 10,
						name: '垂直居中',
						icon: 'align-vertically',
						value: 'align-vertically'
					}
				],
			}
		},
		mounted() {

		},
		methods: {
			onChange(e) {
				this.$emit('change', e.value)
			},
			hide() {
				this.$emit("update:show", false);
				this.$emit('hide')
			}
		}
	}
</script>

<style>
	/* @import "@/static/toolbar.css"; */
</style>