<template>
	<view class="image-cropper" @wheel="cropper.mousewheel">
		<canvas v-if="use2d" type="2d" id="imgCanvas" class="img-canvas" :style="{
			width: `${canvansWidth}px`,
			height: `${canvansHeight}px`
		}"></canvas>
		<canvas v-else id="imgCanvas" canvas-id="imgCanvas" class="img-canvas" :style="{
			width: `${canvansWidth}px`,
			height: `${canvansHeight}px`
		}"></canvas>
		<view class="pic-preview" :change:init="cropper.initObserver" :init="initData" @touchstart="cropper.touchstart" @touchmove="cropper.touchmove" @touchend="cropper.touchend">
			<image v-if="imgSrc" id="crop-image" class="crop-image" :style="cropper.imageStyles" :src="imgSrc" webp></image>
			<view v-for="(item, index) in maskList" :key="item.id" :id="item.id" class="crop-mask-block" :style="cropper.maskStylesList[index]"></view>
			<view v-if="showBorder" id="crop-border" class="crop-border" :style="cropper.borderStyles"></view>
			<view v-if="radius > 0" id="crop-circle-box" class="crop-circle-box" :style="cropper.circleBoxStyles">
				<view class="crop-circle" id="crop-circle" :style="cropper.circleStyles"></view>
			</view>
			<block v-if="showGrid">
				<view v-for="(item, index) in gridList" :key="item.id" :id="item.id" class="crop-grid" :style="cropper.gridStylesList[index]"></view>
			</block>
			<block v-if="showAngle">
				<view v-for="(item, index) in angleList" :key="item.id" :id="item.id" class="crop-angle" :style="cropper.angleStylesList[index]">
					<view :style="[{
						width: `${angleSize}px`,
						height: `${angleSize}px`
					}]"></view>
				</view>
			</block>
		</view>
		<view class="fixed-bottom safe-area-inset-bottom">
			<view v-if="rotatable && !!imgSrc" class="rotate-icon" @click="cropper.rotateImage"></view>
			<view v-if="!choosable" class="choose-btn" @click="cropClick">确定</view>
			<block v-else-if="!!imgSrc">
				<view class="rechoose" @click="chooseImage">重选</view>
				<view class="cancel-button" @click="cancel">取消</view>
				<button class="button" size="mini" @click="cropClick">确定</button>
			</block>
			<view v-else class="choose-btn" @click="chooseImage">选择图片</view>
		</view>
	</view>
</template>

<!-- #ifdef APP-VUE || H5 -->
<script module="cropper" lang="renderjs">
	import cropper from './qf-image-cropper.render.js';
	export default {
		mixins: [ cropper ]
	}
</script>
<!-- #endif -->
<!-- #ifdef MP-WEIXIN || MP-QQ -->
<script module="cropper" lang="wxs" src="./qf-image-cropper.wxs"></script>
<!-- #endif -->
<script>
	/** 裁剪区域最大宽高所占屏幕宽度百分比 */
	const AREA_SIZE = 75;
	/** 图片默认宽高 */
	const IMG_SIZE = 300;

	export default {
		name:"qf-image-cropper",
		// #ifdef MP-WEIXIN
		options: {
			// 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响
			styleIsolation: "isolated"
		},
		// #endif
		props: {
			/** 图片资源地址 */
			src: {
				type: String,
				default: ''
			},
			/** 裁剪宽度，有些平台或设备对于canvas的尺寸有限制，过大可能会导致无法正常绘制 */
			width: {
				type: Number,
				default: IMG_SIZE
			},
			/** 裁剪高度，有些平台或设备对于canvas的尺寸有限制，过大可能会导致无法正常绘制 */
			height: {
				type: Number,
				default: IMG_SIZE
			},
			/** 是否绘制裁剪区域边框 */
			showBorder: {
				type: Boolean,
				default: true
			},
			/** 是否绘制裁剪区域网格参考线 */
			showGrid: {
				type: Boolean,
				default: true
			},
			/** 是否展示四个支持伸缩的角 */
			showAngle: {
				type: Boolean,
				default: true
			},
			/** 裁剪区域最小缩放倍数 */
			areaScale: {
				type: Number,
				default: 0.3
			},
			/** 图片最大缩放倍数 */
			maxScale: {
				type: Number,
				default: 5
			},
			/** 是否有回弹效果：拖动时可以拖出边界，释放时会弹回边界 */
			bounce: {
				type: Boolean,
				default: true
			},
			/** 是否支持翻转 */
			rotatable: {
				type: Boolean,
				default: true
			},
			/** 是否支持从本地选择素材 */
			choosable: {
				type: Boolean,
				default: true
			},
			/** 四个角尺寸，单位px */
			angleSize: {
				type: Number,
				default: 20
			},
			/** 四个角边框宽度，单位px */
			angleBorderWidth: {
				type: Number,
				default: 2
			},
			/** 裁剪图片圆角半径，单位px */
			radius: {
				type: Number,
				default: 0
			},
			/** 生成文件的类型，只支持 'jpg' 或 'png'。默认为 'png' */
			fileType: {
				type: String,
				default: 'png'
			},
			/**
			 * 图片从绘制到生成所需时间，单位ms
			 * 微信小程序平台使用 `Canvas 2D` 绘制时有效
			 * 如绘制大图或出现裁剪图片空白等情况应适当调大该值，因 `Canvas 2d` 采用同步绘制，需自己把控绘制完成时间
			 */
			delay: {
				type: Number,
				default: 1000
			},
			// #ifdef H5
			/**
			 * 页面是否是原生标题栏
			 * H5平台当 showAngle 为 true 时，使用插件的页面在 `page.json` 中配置了 "navigationStyle": "custom" 时，必须将此值设为 false ，否则四个可拉伸角的触发位置会有偏差。
			 * 注：因H5平台的窗口高度是包含标题栏的，而屏幕触摸点的坐标是不包含的
			 */
			navigation: {
				type: Boolean,
				default: true
			}
			// #endif
		},
		emits: ["crop"],
		data() {
			return {
				// 用不同 id 使 v-for key 不重复
				maskList: [
					{ id: 'crop-mask-block-1' },
					{ id: 'crop-mask-block-2' },
					{ id: 'crop-mask-block-3' },
					{ id: 'crop-mask-block-4' },
				],
				gridList: [
					{ id: 'crop-grid-1' },
					{ id: 'crop-grid-2' },
					{ id: 'crop-grid-3' },
					{ id: 'crop-grid-4' },
				],
				angleList: [
					{ id: 'crop-angle-1' },
					{ id: 'crop-angle-2' },
					{ id: 'crop-angle-3' },
					{ id: 'crop-angle-4' },
				],
				/** 本地缓存的图片路径 */
				imgSrc: '',
				/** 图片的裁剪宽度 */
				imgWidth: IMG_SIZE,
				/** 图片的裁剪高度 */
				imgHeight: IMG_SIZE,
				/** 裁剪区域最大宽度所占屏幕宽度百分比 */
				widthPercent: AREA_SIZE,
				/** 裁剪区域最大高度所占屏幕宽度百分比 */
				heightPercent: AREA_SIZE,
				/** 裁剪区域布局信息 */
				area: {},
				/** 未被缩放过的图片宽 */
				oldWidth: 0,
				/** 未被缩放过的图片高 */
				oldHeight: 0,
				/** 系统信息 */
				sys: uni.getSystemInfoSync(),
				scaleWidth: 0,
				scaleHeight: 0,
				rotate: 0,
				offsetX: 0,
				offsetY: 0,
				use2d: false,
				canvansWidth: 0,
				canvansHeight: 0,
				// imageStyles: {},
				// maskStylesList: [{}, {}, {}, {}],
				// borderStyles: {},
				// gridStylesList: [{}, {}, {}, {}],
				// angleStylesList: [{}, {}, {}, {}],
				// circleBoxStyles: {},
				// circleStyles: {},
			}
		},
		computed: {
			initData() {
				// console.log('initData')
				return {
					timestamp: new Date().getTime(),
					area: {
						...this.area,
						bounce: this.bounce,
						showBorder: this.showBorder,
						showGrid: this.showGrid,
						showAngle: this.showAngle,
						angleSize: this.angleSize,
						angleBorderWidth: this.angleBorderWidth,
						minScale: this.areaScale,
						widthPercent: this.widthPercent,
						heightPercent: this.heightPercent,
						radius: this.radius
					},
					sys: this.sys,
					img: {
						maxScale: this.maxScale,
						src: this.imgSrc,
						width: this.oldWidth,
						height: this.oldHeight,
						oldWidth: this.oldWidth,
						oldHeight: this.oldHeight,
					}
				}
			},
			imgProps() {
				return {
					width: this.width,
					height: this.height,
					src: this.src,
				}
			}
		},
		watch: {
			imgProps: {
				handler(val) {
					// console.log('imgProps', val)
					// 自定义裁剪尺，示例如下：
					this.imgWidth = Number(val.width) || IMG_SIZE;
					this.imgHeight = Number(val.height) || IMG_SIZE;
					let use2d = true;
					// #ifndef MP-WEIXIN
					use2d = false;
					// #endif
					// if(use2d && (this.imgWidth > 1365 || this.imgHeight > 1365)) {
					// 	use2d = false;
					// }
					let canvansWidth = this.imgWidth;
					let canvansHeight = this.imgHeight;
					let size = Math.max(canvansWidth, canvansHeight)
					let scalc = 1;
					if(size > 1365) {
						scalc = 1365 / size;
					}
					this.canvansWidth = canvansWidth * scalc;
					this.canvansHeight = canvansHeight * scalc;
					this.use2d = use2d;
					this.initArea();
					val.src && this.initImage(val.src);
				},
				immediate: true
			},
		},
		methods: {
			/** 取消按钮时间 **/
			cancel() {
				this.$emit("close")
			},
			/** 提供给wxs调用，用来接收图片变更数据 */
			dataChange(e) {
				// console.log('dataChange', e)
				this.scaleWidth = e.width;
				this.scaleHeight = e.height;
				this.rotate = e.rotate;
				this.offsetX = e.x;
				this.offsetY = e.y;
			},
			/** 初始化裁剪区域布局信息 */
			initArea() {
				// 底部操作栏高度 = 底部底部操作栏内容高度 + 设备底部安全区域高度
				this.sys.offsetBottom = uni.upx2px(100) + this.sys.safeAreaInsets.bottom;
				// #ifndef H5
				this.sys.windowTop = 0;
				this.sys.navigation = true;
				// #endif
				// #ifdef H5
				// h5平台的窗口高度是包含标题栏的
				this.sys.windowTop = this.sys.windowTop || 44;
				this.sys.navigation = this.navigation;
				// #endif
				let wp = this.widthPercent;
				let hp = this.heightPercent;
				if (this.imgWidth > this.imgHeight) {
					hp = hp * this.imgHeight / this.imgWidth;
				} else if (this.imgWidth < this.imgHeight) {
					wp = wp * this.imgWidth / this.imgHeight;
				}
				const size = this.sys.windowWidth > this.sys.windowHeight ? this.sys.windowHeight : this.sys.windowWidth;
				const width = size * wp / 100;
				const height = size * hp / 100;
				const left = (this.sys.windowWidth - width) / 2;
				const right = left + width;
				const top = (this.sys.windowHeight + this.sys.windowTop - this.sys.offsetBottom - height) / 2;
				const bottom = this.sys.windowHeight + this.sys.windowTop - this.sys.offsetBottom - top;
				this.area = { width, height, left, right, top, bottom };
				this.scaleWidth = width;
				this.scaleHeight = height;
			},
			/** 从本地选取图片 */
			chooseImage() {
				// #ifdef MP-WEIXIN || MP-JD
				if(uni.chooseMedia) {
					uni.chooseMedia({
						count: 1,
						mediaType: ['image'],
						success: (res) => {
							this.resetData();
							this.initImage(res.tempFiles[0].tempFilePath);
						}
					});
					return;
				}
				// #endif
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.resetData();
						this.initImage(res.tempFiles[0].path);
					}
				});
			},
			/** 重置数据 */
			resetData() {
				this.imgSrc = '';
				this.rotate = 0;
				this.offsetX = 0;
				this.offsetY = 0;
				this.initArea();
			},
			/**
			 * 初始化图片信息
			 * @param {String} url 图片链接
			 */
			initImage(url) {
				uni.getImageInfo({
					src: url,
					success: (res) => {
						this.imgSrc = res.path;
						let scale = res.width / res.height;
						let areaScale = this.area.width / this.area.height;
						if (scale > 1) { // 横向图片
							if (scale >= areaScale) { // 图片宽不小于目标宽，则高固定，宽自适应
								this.scaleWidth = (this.scaleHeight / res.height) * this.scaleWidth * (res.width / this.scaleWidth);
							} else { // 否则宽固定、高自适应
								this.scaleHeight = res.height * this.scaleWidth / res.width;
							}
						} else { // 纵向图片
							if (scale <= areaScale) { // 图片高不小于目标高，宽固定，高自适应
								this.scaleHeight = (this.scaleWidth / res.width) * this.scaleHeight / (this.scaleHeight / res.height);
							} else { // 否则高固定，宽自适应
								this.scaleWidth = res.width * this.scaleHeight / res.height;
							}
						}
						// 记录原始宽高，为缩放比列做限制
						this.oldWidth = this.scaleWidth;
						this.oldHeight = this.scaleHeight;
					},
					fail: (err) => {
						console.error(err)
					}
				});
			},
			/**
			 * 剪切图片圆角
			 * @param {Object} ctx canvas 的绘图上下文对象
			 * @param {Number} radius 圆角半径
			 * @param {Number} scale 生成图片的实际尺寸与截取区域比
			 * @param {Function} drawImage 执行剪切时所调用的绘图方法，入参为是否执行了剪切
			 */
			drawClipImage(ctx, radius, scale, drawImage) {
				if(radius > 0) {
					ctx.save();
					ctx.beginPath();
					const w = this.canvansWidth;
					const h = this.canvansHeight;
					if(w === h && radius >= w / 2) { // 圆形
						ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
					} else { // 圆角矩形
						if(w !== h) { // 限制圆角半径不能超过短边的一半
							radius = Math.min(w / 2, h / 2, radius);
							// radius = Math.min(Math.max(w, h) / 2, radius);
						}
						ctx.moveTo(radius, 0);
						ctx.arcTo(w, 0, w, h, radius);
						ctx.arcTo(w, h, 0, h, radius);
						ctx.arcTo(0, h, 0, 0, radius);
						ctx.arcTo(0, 0, w, 0, radius);
						ctx.closePath();
					}
					ctx.clip();
					drawImage && drawImage(true);
					ctx.restore();
				} else {
					drawImage && drawImage(false);
				}
			},
			/**
			 * 旋转图片
			 * @param {Object} ctx canvas 的绘图上下文对象
			 * @param {Number} rotate 旋转角度
			 * @param {Number} scale 生成图片的实际尺寸与截取区域比
			 */
			drawRotateImage(ctx, rotate, scale) {
				if(rotate !== 0) {
					// 1. 以图片中心点为旋转中心点
					const x = this.scaleWidth * scale / 2;
					const y = this.scaleHeight * scale / 2;
					ctx.translate(x, y);
					// 2. 旋转画布
					ctx.rotate(rotate * Math.PI / 180);
					// 3. 旋转完画布后恢复设置旋转中心时所做的偏移
					ctx.translate(-x, -y);
				}
			},
			drawImage(ctx, image, callback) {
				// 生成图片的实际尺寸与截取区域比
				const scale = this.canvansWidth / this.area.width;
				this.drawClipImage(ctx, this.radius, scale, () => {
					this.drawRotateImage(ctx, this.rotate, scale);
					const r = this.rotate / 90;
					ctx.drawImage(
						image,
						[
							(this.offsetX - this.area.left),
							(this.offsetY - this.area.top),
							-(this.offsetX - this.area.left),
							-(this.offsetY - this.area.top)
						][r] * scale,
						[
							(this.offsetY - this.area.top),
							-(this.offsetX - this.area.left),
							-(this.offsetY - this.area.top),
							(this.offsetX - this.area.left)
						][r] * scale,
						this.scaleWidth * scale,
						this.scaleHeight * scale
					);
				});
			},
			/**
			 * 绘图
			 * @param {Object} canvas
			 * @param {Object} ctx canvas 的绘图上下文对象
			 * @param {String} src 图片路径
			 * @param {Function} callback 开始绘制时回调
			 */
			draw2DImage(canvas, ctx, src, callback) {
				// console.log('draw2DImage', canvas, ctx, src, callback)
				if(canvas) {
					const image = canvas.createImage();
					image.onload = () => {
						this.drawImage(ctx, image);
						// 如果觉得`生成时间过长`或`出现生成图片空白`可尝试调整延迟时间
						callback && setTimeout(callback, this.delay);
					};
					image.onerror = (err) => {
						console.error(err)
						uni.hideLoading();
					};
					image.src = src;
				} else {
					this.drawImage(ctx, src);
					setTimeout(() => {
						ctx.draw(false, callback);
					}, 200);
				}
			},
			/**
			 * 画布转图片到本地缓存
			 * @param {Object} canvas
			 * @param {String} canvasId
			 */
			canvasToTempFilePath(canvas, canvasId) {
				// console.log('canvasToTempFilePath', canvas, canvasId)
				uni.canvasToTempFilePath({
					canvas,
					canvasId,
					x: 0,
					y: 0,
					width: this.canvansWidth,
					height: this.canvansHeight,
					destWidth: this.imgWidth, // 必要，保证生成图片宽度不受设备分辨率影响
					destHeight: this.imgHeight, // 必要，保证生成图片高度不受设备分辨率影响
					fileType: this.fileType, // 目标文件的类型，默认png
					success: (res) => {
						// 生成的图片临时文件路径
						this.handleImage(res.tempFilePath);
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({ title: '裁剪失败，生成图片异常！', icon: 'none' });
					}
				}, this);
			},
			/** 确认裁剪 */
			cropClick() {
				uni.showLoading({ title: '裁剪中...', mask: true });
				if(!this.use2d) {
					const ctx = uni.createCanvasContext('imgCanvas', this);
					ctx.clearRect(0, 0, this.canvansWidth, this.canvansHeight);
					this.draw2DImage(null, ctx, this.imgSrc, () => {
						this.canvasToTempFilePath(null, 'imgCanvas');
					});
					return;
				}
				// #ifdef MP-WEIXIN
				const query = uni.createSelectorQuery().in(this);
				query.select('#imgCanvas')
					.fields({ node: true, size: true })
					.exec((res) => {
						const canvas = res[0].node;

						const dpr = uni.getSystemInfoSync().pixelRatio;
						canvas.width = res[0].width * dpr;
						canvas.height = res[0].height * dpr;
						const ctx = canvas.getContext('2d');
						ctx.scale(dpr, dpr);
						ctx.clearRect(0, 0, this.canvansWidth, this.canvansHeight);

						this.draw2DImage(canvas, ctx, this.imgSrc, () => {
							this.canvasToTempFilePath(canvas);
						});
					});
				// #endif
			},
			handleImage(tempFilePath){
				// 在H5平台下，tempFilePath 为 base64
				// console.log(tempFilePath)
				uni.hideLoading();
				this.$emit('crop', { tempFilePath });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image-cropper {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background-color: #000;
		.img-canvas {
			position: absolute !important;
			transform: translateX(-100%);
		}
		.pic-preview {
			width: 100%;
			flex: 1;
			position: relative;

			.crop-mask-block {
				background-color: rgba(51, 51, 51, 0.8);
				z-index: 2;
				position: fixed;
				box-sizing: border-box;
				pointer-events: none;
			}
			.crop-circle-box {
				position: fixed;
				box-sizing: border-box;
				z-index: 2;
				pointer-events: none;
				overflow: hidden;
				.crop-circle {
					width: 100%;
					height: 100%;
				}
			}
			.crop-image {
				padding: 0 !important;
				margin: 0 !important;
				border-radius: 0 !important;
				display: block !important;
			}
			.crop-border {
				position: fixed;
				border: 1px solid #fff;
				box-sizing: border-box;
				z-index: 3;
				pointer-events: none;
			}
			.crop-grid {
				position: fixed;
				z-index: 3;
				border-style: dashed;
				border-color: #fff;
				pointer-events: none;
				opacity: 0.5;
			}
			.crop-angle {
				position: fixed;
				z-index: 3;
				border-style: solid;
				border-color: #fff;
				pointer-events: none;
			}
		}

		.fixed-bottom {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 99;
			display: flex;
			flex-direction: row;
			background-color: $uni-bg-color-grey;

			.rotate-icon {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABCFJREFUaEPtml3IpVMUx3//ko/ChTIyiGFSMyhllI8bc4F85yuNC2FCqLmQC1+FZORiEkUMNW7UjKjJULgxV+NzSkxDhEkZgwsyigv119J63p7zvOc8z37OmXdOb51dz82711r7/99r7bXXXucVi3xokeNnRqCvB20fDmwAlgK/5bcD+FTSr33tHXQP2H4MeHQE0A+B5yRtLiUyDQJrgVc6AAaBpyV93kXkoBMIQLbfBS5NcK8BRwDXNcD+AdwnaVMbiWkRCPBBohpxHuK7M7865sclRdgNHVMhkF6IMIpwirFEUhzo8M7lwIvASTXEqyVtH8ZgagQSbOzsDknv18HZXpHn5IL8+94IOUm7miSmSqAttjPdbgGuTrnNktYsGgLpoYuAD2qg1zRTbG8P2D4SOC6/Q7vSHPALsE/S7wWy80RsPw/ckxMfSTq/LtRJwPbxwF3ASiCUTxwHCPAnEBfVF8AWSTtL7Ng+LfWOTfmlkn6udFsJ5K15R6a4kvX6yGyUFBvTOWzHXXFzCt4g6c1OArYj9iIGh43YgR+BvztXh1PSa4cMkd0jaVmXDduPAE+k3HpJD7cSGFKvfAc8FQUX8IOk/V2L1udtB/hTgdOBW4Aba/M7Ja1qs2f7euCNlHlZUlx4/495IWQ7Jl+qGbxX0gt9AHfJ2o6zFBVoNVrDKe+F3Sm8VdK1bQQ+A85JgXckXdkFaJx527cC9TpnVdvBtl3h2iapuhsGPdBw1b9xnUvaNw7AEh3bnwDnpuwGSfeP0rN9NvAMELXRXFkxEEK2nwQeSiOtRVQJwC4Z29cAW1Nuu6TVXTrN+SaBt4ErUug2Sa/2NdhH3vZy4NvU2S/p6D768w5xI3WOrAD7LtISFpGdIhVXKfaYvjd20wP13L9M0p4DBbaFRKToSLExVkr6qs+aIwlI6iwz+izUQqC+ab29PiMwqRcmPXczD8w8MFj1zg7xXEqbpdHCw7FgWSjafZL+KcQxtpjteCeflwYulFR/J3TabSslVkj6utPChAK2f6q9uZdLitKieLQRuExSvX9ZbLRUMFs09efpUZL+KtUfVo1GW/umNHC3pOhRLtiwfSbwZS6wV9IJfRdreuBBYH0a2STp9r4G+8jbXgc8mzoDT8VSO00ClwDv1ZR7XyylC4ec7ejaLUmdsV6Aw7oSbwFXpdFdks7qA6pU1na0aR6owgeIR/1cx63UzjAC0YXYVjMQHlkn6ZtSo21ytuPZGKFagQ/xsXZ/3iGuFrYdjafXG0DiQMeBi47c9/GV3BO247UV38n5o0UAP6xmu7jFOGxjRr66On5NPBDOCBsDTapxjHY1dyOcolNXnYlx1himE53p2PmNkxosevfavhg4Izt2k7TXPwZ2S6p6QZPin/2rwcQ7OKmBohCadJGF1P8PG6aaQBKVX/8AAAAASUVORK5CYII=');
				background-size: 60% 60%;
				background-repeat: no-repeat;
				background-position:center;
				width: 80rpx;
				height: 80rpx;
				position: absolute;
				top: -90rpx;
				left: 10rpx;
				transform: rotateY(180deg);
			}

			.rechoose {
				color: $uni-color-primary;
				padding: 0 $uni-spacing-row-lg;
				line-height: 100rpx;
				flex: 1;
				font-size: 26rpx;
			}

			.choose-btn {
				color: $uni-color-primary;
				text-align: center;
				line-height: 100rpx;
				flex: 1;
			}

			.cancel-button {
				color: $uni-color-primary;
				padding: 0 $uni-spacing-row-lg;
				margin-right: 20rpx;
				line-height: 100rpx;
				font-size: 26rpx;
			}

			.button {
				margin: auto $uni-spacing-row-lg auto auto;
				background-color: $uni-color-primary;
				color: #fff;
				font-size: 26rpx;
			}
		}

		.safe-area-inset-bottom {
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom); // 兼容 IOS<11.2
			padding-bottom: env(safe-area-inset-bottom); // 兼容 IOS>=11.2
		}

	}
</style>
