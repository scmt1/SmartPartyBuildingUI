# qf-image-cropper
## 图片裁剪插件
uniapp微信小程序图片裁剪插件，支持自定义尺寸、定点等比例缩放、拖动、图片翻转、剪切圆形/圆角图片、定制样式，功能多性能高体验好注释全。

### 平台支持：
1. 支持微信小程序：移动端、PC端、开发者工具
2. 支持H5平台（2.1.0版本起）
3. 支持APP平台（2.1.5版本起）：Android、IOS
4. 其他平台暂未测试兼容性未知

### 支持功能：
1. 自定义裁剪尺寸
2. 定点等比例缩放：移动端以双指触摸中心点为缩放中心点，PC端以鼠标所在点为缩放中心点
3. 自由拖动：支持限制滑出边界，也支持回弹效果（滑动时可滑出边界，释放时回弹到边界）
4. 图片翻转：在裁剪尺寸非 1:1 的情况下，翻转时宽高无法铺满裁剪区域时，图片会自动放大到合适尺寸
5. 裁剪生成新图片
6. 本地选择图片
7. 可定制样式：可自由选择是否渲染裁剪边框、可伸缩裁剪顶角、参考线
8. 裁剪圆角图片：圆形、圆角矩形

### 属性说明
| 属性名 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| src              | String        |         | 图片资源地址 |
| width            | Number        | 300     | 裁剪宽度 |
| height           | Number        | 300     | 裁剪高度 |
| showBorder       | Boolean       | true    | 是否绘制裁剪区域边框 |
| showGrid         | Boolean       | true    | 是否绘制裁剪区域网格参考线 |
| showAngle        | Boolean       | true    | 是否展示四个支持伸缩的角 |
| areaScale        | Number        | 0.3     | 裁剪区域最小缩放倍数 |
| maxScale         | Number        | 5       | 图片最大缩放倍数 |
| bounce           | Boolean       | true    | 是否有回弹效果：拖动时可以拖出边界，释放时会弹回边界 |
| rotatable        | Boolean       | true    | 是否支持翻转 |
| choosable        | Boolean       | true    | 是否支持从本地选择素材 |
| angleSize        | Number        | 20      | 四个角尺寸，单位px |
| angleBorderWidth | Number        | 2       | 四个角边框宽度，单位px |
| radius           | Number        |         | 裁剪图片圆角半径，单位px |
| fileType         | String        | png     | 生成文件的类型，只支持 'jpg' 或 'png'。默认为 'png' |
| delay            | Number        | 1000    | 图片从绘制到生成所需时间，单位ms<br>微信小程序平台使用 `Canvas 2D` 绘制时有效<br>如绘制大图或出现裁剪图片空白等情况应适当调大该值，因 `Canvas 2d` 采用同步绘制，需自己把控绘制完成时间 |
| navigation       | Boolean       | true    | 页面是否是原生标题栏：<br>H5平台当 showAngle 为 true 时，使用插件的页面在 `page.json` 中配置了 `"navigationStyle": "custom"` 时，必须将此值设为 false ，否则四个可拉伸角的触发位置会有偏差。<br>注：因H5平台的窗口高度是包含标题栏的，而屏幕触摸点的坐标是不包含的 |
| @crop    	       | EventHandle   |         | 剪裁完成后触发，event = { tempFilePath }。在H5平台下，tempFilePath 为 base64 |

### 基本用法
```
<template>
	<div>
		<qf-image-cropper :width="500" :height="500" :radius="30" @crop="handleCrop"></qf-image-cropper>
	</div>
</template>

<script>
	import QfImageCropper from '@/components/qf-image-cropper/qf-image-cropper.vue';
	export default {
		components: {
			QfImageCropper
		},
		methods: {
			handleCrop(e) {
				uni.previewImage({
					urls: [e.tempFilePath],
					current: 0
				});
			}
 		}
	}
</script>
```
### 使用说明
1.建议在`pages.json`中将引用插件的页面添加一下配置禁止下拉刷新和禁止页面滑动，防止出现性能或页面抖动等问题。
```
{
	"enablePullDownRefresh": false,
	"disableScroll": true
}
```
2.建议使用本插件不要设置过大宽高的目标图片尺寸，建议1365x1365以内，否则可能会导致如下问题：
```
1.界面卡顿，内存占用过高
2.生成图片失真（模糊）
3.确定裁剪后一直显示 `裁剪中...`，该问题是由 `uni.canvasToTempFilePath` 无法回调导致，不同平台不同设备限制可能有所不同。
```
3.如裁剪后的图片存在偏移的问题，请检查是否受自己项目中父组件或全局样式影响。
4.src属性设置网络图片时，图片资源必须是能触发 `getImageInfo` API 的 success 回调才可用于插件裁剪。因此小程序平台获取网络图片信息需先配置download域名白名单才能生效。