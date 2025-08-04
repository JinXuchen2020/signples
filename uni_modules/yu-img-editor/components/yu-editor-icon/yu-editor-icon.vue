<template>
	<view class="yu-editor-icon" :class="'icon-' + name" :style="{fontSize:size,color:color}"></view>
</template>
<script>
	export default {
		props: {
			name: {
			  type: String,
			  required:true,
			  default() {
			    return ''
			  }
			},
			size: {
			  type: String,
			  default () {
			    return '1rem'
			  }
			},
			color: {
			  type: String,
			  default () {
			    return 'inherit'
			  }
			}
		},
		data() {
			return {

			};
		},
		methods: {
			
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../static/editor.css';
	.yu-editor-icon{
		display: inline-block;
		vertical-align: middle;
		line-height: 1;
	}
</style>
