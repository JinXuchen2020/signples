<template>
    <view style="width: 100%;height: 100vh; position: relative; overflow: hidden;">

        <view class="container">
            <!-- 头部按钮 -->
            <view class="header">
                <button class="header-btn" @click="goHome">返回</button>
                <button class="header-btn save" @click="save">保存</button>
                <!-- <button class="header-btn" @click="">上传图片</button> -->
            </view>
            <!-- 画布 -->
            <view class="main-area">
                <div style="position: relative; 
                    display: flex;
                    align-items: center;
                    justify-content: center;" :style="{ width: canvasStyle.width, height: canvasStyle.height, }">
                    <!-- 上传图片按钮 -->
                    <!-- canvas 画布 -->
                    <image :src="imgesMuns" alt="" class="main-img" mode="aspectFit" />

                    <!-- 主画布 -->
                    <canvas canvas-id="canvasId" id="canvasId" class="main-img draggable-img"
                        :style="{ width: canvasStyle.width, height: canvasStyle.height, }" @touchstart="onTouchStart"
                        @touchmove="onTouchMove" @touchend="onTouchEnd" width="400" :class="imgesMuns ? '' : 'autos'"
                        height="400"></canvas>

                    <!-- 处理线条数据标签 -->
                    <canvas canvas-id="canvasIdPen" id="canvasIdPen" class="main-img draggable-img"
                        style="position: absolute;top: -999px;z-index: 3;"></canvas>
                    <!-- 选中图片时的边框和操作按钮（删除、复制、旋转、缩放） -->
                    <view v-for="(img, idx) in images" :key="idx">
                        <div v-if="img.selected" :key="'border-' + idx" class="img-border-ops" :style="{
                            left: (img.x) + 'px',
                            top: (img.y) + 'px',
                            width: (img.w) + 'px',
                            height: (img.h) + 'px',
                            transform: img.rotate ? `rotate(${img.rotate}rad)` : '',
                            transformOrigin: `${(img.w + 5) / 2}px ${(img.h + 5) / 2}px`,
                            zIndex: 2,
                            padding: '10px'
                        }">
                            <!-- 边框 -->
                            <div class="border-rect"></div>
                            <!-- 左上角 删除 -->
                            <div class="corner-btn corner-del" @touchstart="cornerDelete">
                                ×
                            </div>

                            <!-- <div class="corner-border"></div> -->
                            <!-- 左下角 复制 -->
                            <div class="corner-btn corner-copy" @touchstart="cornerCopy">
                                +
                            </div>

                            <div class="corner-border"></div>
                            <!-- 右上角 旋转 -->
                            <div class="corner-btn corner-rotate" @touchstart="touchStartRotate"
                                @touchmove="touchmoveRotate" @touchend="touchEndRotate">
                                ↻
                            </div>
                            <div class="corner-border"></div>
                            <!-- 右下角 缩放 -->
                            <div class="corner-btn corner-scale" @touchstart="touchStartScale" @touchmove="rotateScale"
                                @touchend="touchEndScale">
                                <span v-if="!_scaling">⇄</span>
                                <span v-else-if="_scaleType === 'horizontal'" style="color: #ff5722;">↔</span>
                                <span v-else-if="_scaleType === 'vertical'" style="color: #2196f3;">↕</span>
                                <span v-else style="color: #4caf50;">⇄</span>
                            </div>
                            <div class="corner-border"></div>
                        </div>
                    </view>
                </div>
            </view>
            <!-- 底部工具栏 -->
            <view class="toolbar">
                <view class="toolbar-item" @click="materialVisible = 'material'">
                    <image src="./images/material.png" class="toolbar-icon"></image>
                    <text>素材</text>
                </view>
                <view class="toolbar-item" @click="materialVisible = 'template'">
                    <image src="./images/template.png" class="toolbar-icon"></image>
                    <text>模板</text>
                </view>
                <view class="toolbar-item" @click="materialVisible = 'text'">
                    <image src="./images/text.png" class="toolbar-icon"></image>
                    <text>文字</text>
                </view>
                <!-- <view class="toolbar-item">
                <image src="/static/icon-mark.png" class="toolbar-icon" @click="materialVisible = 'mark'"></image>
                <text>标记</text>
            </view> -->
                <view class="toolbar-item" @click="materialVisible = 'pen'">
                    <image src="./images/paintbrush.png" class="toolbar-icon"></image>
                    <text>画笔</text>
                </view>
                <view class="toolbar-item" @click="chooseImage">
                    <image src="./images/image.png" class="toolbar-icon"></image>
                    <text>加图</text>
                </view>
            </view>
            <!-- 图层按钮 -->
            <view class="layer-box">
                <view style="width: 40%;display: flex;align-items: center;">
                    <view style="width: 50%;text-align: center;" @click="leftClick">
                        ←
                    </view>
                    <view style="width: 50%;text-align: center;" @click="ringhtClick">
                        →
                    </view>

                    <view style="width: 50%;text-align: center;" @click="clear">
                        清空
                    </view>
                </view>

                <view style="width: 25%;margin-right: 20px">
                    <button class="layer-btn" @click="layerBtn = !layerBtn">{{ !layerBtn ? '图层' : '收起图层' }}</button>
                </view>
            </view>

            <!-- 素材侧边栏 -->
            <view class="sidebarBox" v-if="materialVisible == 'material'">
                <view class="end-btn">
                    <span @click="downs">×</span>
                    <span @click="sidebar('material')">√</span>
                </view>
                <view class="sidebar">
                    <view class="sidebar-section">
                        <view class="sidebar-title" v-for="(item, idex) in materialList" :key="idex"
                            :class="sectionIndex == idex ? 'active' : ''" @click="sectionIndex = idex">{{ item.name }}
                        </view>
                    </view>
                    <view class="material-content">
                        <view class="sidebar-menu">
                            <view class="sidebar-menu-item" v-if="materialList[sectionIndex].child"
                                :class="menuItemIndex == index ? 'active' : ''"
                                v-for="(item, index) in materialList[sectionIndex].child" :key="index"
                                @click="menuItemIndex = index">{{ item.name }}</view>
                        </view>
                        <view class="material-row">
                            <view class="material-card" :class="{ 'material-circle': materialidx == idx }"
                                v-for="(item, idx) in materialList[sectionIndex].child[menuItemIndex].order" :key="idx"
                                @click="materialidx = idx">
                                <image class="material-img" :src="item.image">
                                </image>
                                <view class="material-title">{{ item.name }}</view>
                                <view class="material-tag" v-if="idx === 0">￥</view>
                                <view class="material-vip" v-if="idx !== 0">VIP</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 文字工具栏 -->
            <view class="text-toolbar" v-if="materialVisible == 'text'">
                <view class="end-btn">
                    <span @click="downs">×</span>
                    <span @click="sidebar('text')">√</span>
                </view>
                <view class="text-toolbar-row">
                    <input class="text-input" v-model="textInput" placeholder="示例文字" />
                </view>
                <view class="text-toolbar-row font-row">
                    <button v-for="(font, idx) in fonts" :key="idx"
                        :class="['font-btn', { active: textFont === font.name }]" @click="textFont = font.name"
                        :style="{ fontFamily: font.name }">
                        {{ font.label }}
                    </button>
                </view>
                <view class="text-toolbar-row size-row">
                    <text class="label">大小</text>
                    <slider class="size-slider" min="10" max="200" :value="textSize" show-value style="width: 60%;" />
                    <text class="size-value">{{ textSize }}</text>
                </view>
                <view class="text-toolbar-row color-row">
                    <text class="label">颜色</text>
                    <view class="color-list">
                        <view v-for="(color, idx) in textColors" :key="idx"
                            :class="['color-circle', { selected: textColor === color }]"
                            :style="{ background: color, border: textColor === color ? '2px solid #b6ff3b' : '2px solid #888' }"
                            @click="textColor = color">
                            <view v-if="textColor === color" class="color-selected"></view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 划线选择 -->
            <view class="pen-toolbar" v-if="materialVisible == 'pen'">
                <view class="end-btn">
                    <span @click="downs">×</span>
                    <span @click="sidebar('pen')">√</span>
                </view>
                <view class="pen-row">
                    <text class="label">粗细</text>
                    <slider min="1" max="30" :value="penSize" show-value style="width: 60%;" />
                    <!-- <text class="size-value">{{ penSize }}</text> -->
                </view>
                <view class="pen-row">
                    <text class="label">颜色</text>
                    <view class="pen-color-list">
                        <view v-for="(color, idx) in penColors" :key="color"
                            :class="['pen-color-circle', { selected: penColor === color }]"
                            :style="{ background: color, border: penColor === color ? '2px solid #b6ff3b' : '2px solid #888' }"
                            @click="penColor = color">
                            <view v-if="penColor === color" class="pen-color-selected"></view>
                        </view>
                    </view>
                </view>
                <view class="pen-row">
                    <text class="label">笔状</text>
                    <view class="pen-style-list">
                        <view :class="['pen-style-item', { active: penStyle === 'solid' }]" @click="penStyle = 'solid'">
                            <image src="/static/pen-solid.png" style="width:24px;height:24px;" />
                            <text style="color:#8dd800;margin-left:4px;">实线</text>
                        </view>
                        <view :class="['pen-style-item', { active: penStyle === 'dashed' }]"
                            @click="penStyle = 'dashed'">
                            <image src="/static/pen-dashed.png" style="width:24px;height:24px;" />
                            <text style="color:#bbb;margin-left:4px;">虚线</text>
                        </view>
                    </view>
                </view>

                <!-- 画笔状态显示 -->
                <view class="pen-status" v-if="isDrawing && currentStroke">
                    <text class="pen-status-text">正在画线: </text>
                    <view class="pen-status-color" :style="{ background: currentStroke.color }"></view>
                    <text class="pen-status-size">{{ currentStroke.size }}px</text>
                    <text class="pen-status-style">{{ currentStroke.style === 'dashed' ? '虚线' : '实线' }}</text>
                </view>
            </view>

            <!-- 模板 -->
            <view class="template-bar" v-if="materialVisible == 'template'">
                <view class="end-btn">
                    <span @click="downs">×</span>
                </view>
                <view class="template-tabs">
                    <view :class="['template-tab', { active: true }]">推荐</view>
                    <view class="template-tab">室内组景</view>
                    <view class="template-tab">组合盆</view>
                    <view class="template-tab">组景架构</view>
                    <view class="template-tab">花箱景观</view>
                    <view class="template-tab">积木造型</view>
                </view>
                <scroll-view scroll-x class="template-list">
                    <view class="template-card" v-for="(item, idx) in templateList" :key="idx"
                        @click="sidebar('template')">
                        <image class="template-img" :src="item.image">
                        </image>
                        <view class="template-info">
                            <view class="template-title">{{ item.name }}</view>
                            <view class="template-meta">
                                <image
                                    src="https://b0.bdstatic.com/ugc/img/2024-12-28/42e36b01cb8ddae367b10ca4b0e4b919.png"
                                    class="template-vip-icon" />
                                <text class="template-view">448</text>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 图层 -->
            <view class="layer-panel" v-if="layerBtn">
                <view class="layer-tabs">
                    <view :class="['layer-tab', { active: true }]">单选</view>
                    <!-- <view class="layer-tab">多选</view> -->
                </view>
                <scroll-view class="layer-list" scroll-y>
                    <view v-for="(img, idx) in images" :key="idx" class="layer-item">
                        <view style="display: flex;align-items: center;">
                            <image v-if="img.switch" src="./images/display.png" class="layer-eye" @click="hideIf(img)"
                                mode="aspectFit" />
                            <image v-else @click="hideIf(img)" src="./images/hide.png" class="layer-eye"
                                mode="scaleToFill" />
                            <view class="layer-thumb">
                                <image v-if="img.url" :src="img.url" class="layer-img" mode="aspectFit" />
                                <text v-else class="layer-text" :style="{ color: '#ff5722' }">{{ img.type == 'pen' ?
                                    '线条' :
                                    img.type == 'backgorund' ? '背景' : '文字' }}</text>
                            </view>
                            <view @click="up(img)" style="margin-left: 10px;color: #fff;">
                                ↑
                            </view>
                        </view>
                        <view style="color: #fff;text-align: right;" @click="leftClickOff(idx)">
                            ×
                        </view>
                    </view>
                </scroll-view>
                <view class="layer-footer">
                    <image src="/static/layer-icon.png" class="layer-footer-icon" />
                    <text class="layer-footer-text" @click="layerBtn = false">收起图层</text>
                </view>
            </view>
        </view>
    </view>
</template>


<style>
	
</style>

<style scoped>
.container {
    background: #222;
    min-height: 85vh;
    height: 85vh;
    position: absolute;
    padding-bottom: 90rpx;
    overflow: hidden;
    width: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 24rpx 0 0rpx;
    gap: 20rpx;
    width: 100%;
}

.header-btn {
    background: transparent;
    border: 1rpx solid #b6ff3b;
    color: #b6ff3b;
    border-radius: 8rpx;
    /* padding: 8rpx 32rpx; */
    font-size: 28rpx;
}

.header-btn.save {
    /* margin-left: 16rpx; */
}

.main-area {
    margin: 40rpx auto 0 auto;
    background: #333;
    width: 100%;
    height: 81%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    position: absolute;
    overflow: hidden;
    /* border: 1px solid red; */
}

.upload-btn {
    position: absolute;
    left: 20rpx;
    top: 20rpx;
    z-index: 2;
    background: #b6ff3b;
    color: #222;
    border-radius: 8rpx;
    padding: 8rpx 24rpx;
    font-size: 24rpx;
    border: none;
}

.main-img {

    width: 100%;
    height: 950rpx;
    object-fit: contain;
    /* border: 1rpx solid red; */
}

.draggable-img {
    position: absolute;
    z-index: 2;
    /* 可根据需要调整初始大小 */
    /*  */
    background-size: 20px 20px;
    position: absolute;
    background-position: 0 0, 10px 10px;
    /* border: 1px solid red; */
}

.autos {
    background-color: #f5f5f5;
    background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%),
        linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%);
}

.toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: #111;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 140rpx;
    border-top: 1rpx solid #333;
    z-index: 10;
}

.toolbar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    font-size: 22rpx;
}

.toolbar-icon {
    width: 40rpx;
    height: 40rpx;
    margin-bottom: 4rpx;
}

.layer-box {
    position: fixed;
    right: 0rpx;
    bottom: 140rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100rpx;
    /* border: 1px solid red; */
    color: #fff;
}

.layer-btn {
    background: #333;
    color: #fff;
    border-radius: 8rpx;
    padding: 12rpx 32rpx;
    font-size: 26rpx;
    border: none;
    z-index: 2;
    width: 100%;
}

.sidebarBox {
    position: absolute;
    left: 0;
    bottom: 0rpx;
    width: 100%;
    background: #191919;
    /* border: 1px solid blue; */
    z-index: 3;
}

.sidebar {
    width: 100%;
    height: 40vh;
    z-index: 5;
    display: flex;
    /* flex-direction: column; */
    padding-top: 20rpx;
}

.sidebar-section {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 10rpx;
    padding: 0 10rpx;
}

.sidebar-title {
    color: #bbb;
    font-size: 22rpx;
    margin-right: 16rpx;
    padding: 8rpx 0;
}

.sidebar-title.active {
    color: #b6ff3b;
    border-bottom: 2rpx solid #b6ff3b;
}

.sidebar-menu {
    /* margin-top: 30rpx; */
    display: flex;
    gap: 10rpx;
}

.sidebar-menu-item {
    color: #bbb;
    font-size: 22rpx;
    padding: 8rpx 16rpx;
    border-radius: 6rpx;
}

.sidebar-menu-item.active {
    background: #222;
    color: #b6ff3b;
}

.material-content {
    /* position: absolute;
    left: 180rpx;
    top: 120rpx;
    right: 0; */
    /* height: 72vh; */
    background: transparent;
    z-index: 4;
    /* padding: 24rpx 0 0 0; */
    overflow-y: auto;
}

.material-row {
    display: flex;
    flex-direction: row;
    gap: 24rpx;
    margin-bottom: 24rpx;
    justify-content: flex-start;
    padding-left: 24rpx;
}

.material-card {
    background: #222;
    border-radius: 12rpx;
    width: 160rpx;
    height: 200rpx;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    position: relative;
    box-shadow: 0 2rpx 8rpx #0006;
    padding: 12rpx 0;
    border: 2px solid #222;
}

.material-circle {
    border: 2px solid #fff;
}

.material-img {
    width: 120rpx;
    height: 120rpx;
    object-fit: contain;
    margin-bottom: 8rpx;
}

.material-title {
    color: #fff;
    font-size: 20rpx;
    margin-bottom: 4rpx;
    text-align: center;
}

.material-tag {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: #b6ff3b;
    color: #222;
    border-radius: 50%;
    width: 32rpx;
    height: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    font-weight: bold;
}

.material-vip {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: #ffd700;
    color: #222;
    border-radius: 8rpx;
    padding: 2rpx 8rpx;
    font-size: 16rpx;
    font-weight: bold;
}

.text-toolbar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0rpx;
    background: #222;
    border-radius: 16rpx 16rpx 0 0;
    padding: 32rpx 24rpx 24rpx 24rpx;
    z-index: 3;
    box-shadow: 0 -4rpx 24rpx #000a;
}

.text-toolbar-row {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
}

.text-input {
    flex: 1;
    background: #333;
    color: #fff;
    border: 1rpx solid #444;
    border-radius: 8rpx;
    padding: 12rpx 20rpx;
    font-size: 28rpx;
    outline: none;
}

.font-row {
    flex-wrap: wrap;
    gap: 16rpx;
}

.font-btn {
    background: #333;
    color: #fff;
    border: 1rpx solid #444;
    border-radius: 8rpx;
    padding: 8rpx 24rpx;
    font-size: 26rpx;
    margin-right: 12rpx;
    margin-bottom: 8rpx;
    transition: border 0.2s, color 0.2s;
}

.font-btn.active {
    border: 2rpx solid #b6ff3b;
    color: #b6ff3b;
}

.size-row {
    gap: 16rpx;
}

.label {
    color: #bbb;
    font-size: 22rpx;
    margin-right: 12rpx;
}

.size-slider {
    flex: 1;
    margin: 0 12rpx;
}

.size-value {
    color: #b6ff3b;
    font-size: 24rpx;
    min-width: 48rpx;
    text-align: right;
}

.color-row {
    gap: 16rpx;
}

.color-list {
    display: flex;
    flex-direction: row;
    gap: 16rpx;
    margin-left: 12rpx;
}

.color-circle {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 2rpx solid #888;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
}

.color-circle.selected {
    border: 2rpx solid #b6ff3b;
}

.color-selected {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    top: 10rpx;
    left: 10rpx;
    box-shadow: 0 0 4rpx #b6ff3b;
}

.end-btn {
    width: 90%;
    height: 40rpx;
    text-align: right;
    color: #fff;
    margin: 10rpx auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}



/* 画线 */
.pen-toolbar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #222;
    border-radius: 16rpx 16rpx 0 0;
    padding: 32rpx 24rpx 24rpx 24rpx;
    z-index: 3;
    box-shadow: 0 -4rpx 24rpx #000a;
}

.pen-row {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    gap: 16rpx;
}

.pen-color-list {
    display: flex;
    flex-direction: row;
    gap: 16rpx;
    margin-left: 12rpx;
}

.pen-color-circle {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 2rpx solid #888;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
}

.pen-color-circle.selected {
    border: 2rpx solid #b6ff3b;
}

.pen-color-selected {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    top: 10rpx;
    left: 10rpx;
    box-shadow: 0 0 4rpx #b6ff3b;
}

.pen-style-list {
    display: flex;
    flex-direction: row;
    gap: 24rpx;
    margin-left: 12rpx;
}

.pen-style-item {
    display: flex;
    align-items: center;
    background: #333;
    border: 1rpx solid #444;
    border-radius: 8rpx;
    padding: 8rpx 16rpx;
    font-size: 24rpx;
    color: #bbb;
    cursor: pointer;
    transition: border 0.2s, color 0.2s;
}

.pen-style-item.active {
    border: 2rpx solid #b6ff3b;
    color: #8dd800;
    background: #222;
}

/* 模板 */
/* template-bar 样式补全 */
.template-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #191919;
    border-radius: 16rpx 16rpx 0 0;
    z-index: 3;
    padding: 24rpx 0 0 0;
    box-shadow: 0 -4rpx 24rpx #000a;
}

.template-tabs {
    display: flex;
    flex-direction: row;
    gap: 24rpx;
    padding: 0 24rpx;
    margin-bottom: 16rpx;
}

.template-tab {
    color: #bbb;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    min-width: 50px;
    text-align: center;
}

.template-tab.active {
    color: #b6ff3b;
    background: #222;
}

.template-list {
    display: flex;
    flex-direction: row;
    gap: 24rpx;
    padding: 0 24rpx 24rpx 24rpx;
    overflow-x: auto;
    white-space: nowrap;
}

.template-card {
    display: inline-block;
    background: #222;
    border-radius: 12rpx;
    width: 320rpx;
    margin-right: 24rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx #0006;
    vertical-align: top;
}

.template-img {
    width: 100%;
    height: 180rpx;
    object-fit: cover;
    display: block;
}

.template-info {
    padding: 12rpx 16rpx 8rpx 16rpx;
}

.template-title {
    color: #fff;
    font-size: 26rpx;
    margin-bottom: 8rpx;
}

.template-meta {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.template-vip-icon {
    width: 28rpx;
    height: 28rpx;
}

.template-view {
    color: #bbb;
    font-size: 22rpx;
}

/* 图层面板样式 */
.layer-panel {
    position: fixed;
    right: 15rpx;
    top: 200rpx;
    width: 320rpx;
    max-height: 60vh;
    background: #222;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 24rpx #000a;
    z-index: 20;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.layer-tabs {
    display: flex;
    flex-direction: row;
    border-bottom: 1rpx solid #333;
    background: #191919;
}

.layer-tab {
    flex: 1;
    text-align: center;
    color: #bbb;
    font-size: 22rpx;
    padding: 16rpx 0;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
}

.layer-tab.active {
    color: #b6ff3b;
    background: #222;
    border-bottom: 2rpx solid #b6ff3b;
}

.layer-list {
    flex: 1;
    overflow-y: auto;
    padding: 12rpx 0;
}

.layer-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 16rpx;
    border-bottom: 1rpx solid #333;
    gap: 16rpx;
}

.layer-eye {
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
}

.layer-thumb {
    width: 48rpx;
    height: 48rpx;
    background: #333;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.layer-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.layer-text {
    font-size: 22rpx;
    color: #fff;
    text-align: center;
    width: 100%;
}

.layer-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12rpx 0;
    background: #191919;
    border-top: 1rpx solid #333;
    gap: 8rpx;
}

.layer-footer-icon {
    width: 28rpx;
    height: 28rpx;
}

.layer-footer-text {
    color: #bbb;
    font-size: 22rpx;
}

.img-border-ops {
    position: absolute;
    border: 2px dashed #b6ff3b;
    border-radius: 12rpx;
    box-sizing: border-box;
    pointer-events: none;
}

.border-rect {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #1e01fc;
    border-radius: 12rpx;
    pointer-events: none;
}

.corner-btn {
    position: absolute;
    width: 42rpx;
    height: 42rpx;
    background: #8dd800;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    z-index: 2;
    pointer-events: auto;
    box-shadow: 0 2rpx 8rpx #0006;
    cursor: pointer;
    user-select: none;
}

.corner-del {
    left: -16rpx;
    top: -16rpx;
    background: #e53935;
}

.corner-copy {
    left: -16rpx;
    bottom: -16rpx;
    background: #8dd800;
}

.corner-rotate {
    right: -16rpx;
    top: -16rpx;
    background: #8dd800;
}

.corner-scale {
    right: -16rpx;
    bottom: -16rpx;
    background: #8dd800;
}
</style>
