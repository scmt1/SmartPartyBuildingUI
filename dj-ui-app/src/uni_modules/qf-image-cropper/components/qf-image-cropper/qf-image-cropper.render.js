/**
 * 图片编辑器-手势监听
 * 1. 支持编译到app-vue（uni-app 2.5.5及以上版本）、H5上
 */
/** 图片偏移量 */
var offset = { x: 0, y: 0 };
/** 图片缩放比例 */
var scale = 1;
/** 图片最小缩放比例 */
var minScale = 1;
/** 图片旋转角度 */
var rotate = 0;
/** 触摸点 */
var touches = [];
/** 图片布局信息 */
var img = {};
/** 系统信息 */
var sys = {};
/** 裁剪区域布局信息 */
var area = {};
/** 触摸行为类型 */
var touchType = '';
/** 操作角的位置 */
var activeAngle = 0;
/** 裁剪区域布局信息偏移量 */
var areaOffset = { left: 0, right: 0, top: 0, bottom: 0 };
/** 元素ID */
var elIds = {
	'imageStyles': 'crop-image',
	'maskStylesList': 'crop-mask-block',
	'borderStyles': 'crop-border',
	'circleBoxStyles': 'crop-circle-box',
	'circleStyles': 'crop-circle',
	'gridStylesList': 'crop-grid',
	'angleStylesList': 'crop-angle',
}
/** 记录上次初始化时间戳，排除APP重复更新 */
var timestamp = 0;
/**
 * 样式对象转字符串
 * @param {Object} style 样式对象
 */
function styleToString(style) {
	if(typeof style === 'string') return style;
	var str = '';
	for (let k in style) {
		str += k + ':' + style[k] + ';';
	}
	return str;
}
/**
 *
 * @param {Object} instance 页面实例对象
 * @param {Object} key 要修改样式的key
 * @param {Object|Array} style 样式
 */
function setStyle(instance, key, style) {
	// console.log('setStyle', instance, key, JSON.stringify(style))
	// #ifdef APP-PLUS
	if(Object.prototype.toString.call(style) === '[object Array]') {
		for (var i = 0, len = style.length; i < len; i++) {
			var el = window.document.getElementById(elIds[key] + '-' + (i + 1));
			el && (el.style = styleToString(style[i]));
		}
	} else {
		var el = window.document.getElementById(elIds[key]);
		el && (el.style = styleToString(style));
	}
	// #endif
	// #ifdef H5
	instance[key] = style;
	// #endif
}
/**
 * 触发页面实例指定方法
 * @param {Object} instance 页面实例对象
 * @param {Object} name 方法名称
 * @param {Object} obj 传递参数
 */
function callMethod(instance, name, obj) {
	// #ifdef APP-PLUS
	instance.callMethod(name, obj);
	// #endif
	// #ifdef H5
	instance[name](obj);
	// #endif
}
/**
 * 计算两点间距
 * @param {Object} touches 触摸点信息
 */
function getDistanceByTouches(touches) {
	// 根据勾股定理求两点间距离
	var a = touches[1].pageX - touches[0].pageX;
	var b = touches[1].pageY - touches[0].pageY;
	var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	// 求两点间的中点坐标
	// 1. a、b可能为负值
	// 2. 在求a、b时，如用touches[1]减touches[0]，则求中点坐标也得用touches[1]减a/2、b/2
	// 3. 同理，在求a、b时，也可用touches[0]减touches[1]，则求中点坐标也得用touches[0]减a/2、b/2
	var x = touches[1].pageX - a / 2;
	var y = touches[1].pageY - b / 2;
	return { c, x, y };
};
/**
 * 检查边界：限制 x、y 拖动范围，禁止滑出边界
 * @param {Object} e 点坐标
 */
function checkRange(e) {
	var r = rotate / 90 % 2;
	if(r === 1) { // 因图片宽高可能不等，翻转 90° 或 270° 后图片宽高需反着计算，且左右和上下边界要根据差值做偏移
		var o = (img.height - img.width) / 2; // 宽高差值一半
		return {
			x: Math.min(Math.max(e.x, -img.height + o + area.width + area.left), area.left + o),
			y: Math.min(Math.max(e.y, -img.width - o + area.height + area.top), area.top - o)
		}
	}
	return {
		x: Math.min(Math.max(e.x, -img.width + area.width + area.left), area.left),
		y: Math.min(Math.max(e.y, -img.height + area.height + area.top), area.top)
	}
};
/**
 * 变更图片布局信息
 * @param {Object} e 布局信息
 */
function changeImageRect(e) {
	// console.log('changeImageRect', e)
	offset.x += e.x || 0;
	offset.y += e.y || 0;
	if(e.check) { // 检查边界
		var point = checkRange(offset);
		if(offset.x !== point.x || offset.y !== point.y) {
			offset = point;
		}
	}

	// 因频繁修改 width/height 会造成大量的内存消耗，改为scale
	// e.instance.imageStyles = {
	// 	width: img.width + 'px',
	// 	height: img.height + 'px',
	// 	transform: 'translate(' + (offset.x + ox) + 'px, ' + (offset.y + ox) + 'px) rotate(' + rotate +'deg)'
	// };
	var ox = (img.width - img.oldWidth) / 2;
	var oy = (img.height - img.oldHeight) / 2;
	// e.instance.imageStyles = {
	// 	width: img.oldWidth + 'px',
	// 	height: img.oldHeight + 'px',
	// 	transform: 'translate(' + (offset.x + ox) + 'px, ' + (offset.y + oy) + 'px) rotate(' + rotate +'deg) scale(' + scale + ')'
	// };
	setStyle(e.instance, 'imageStyles', {
		width: img.oldWidth + 'px',
		height: img.oldHeight + 'px',
		transform: 'translate(' + (offset.x + ox) + 'px, ' + (offset.y + oy) + 'px) rotate(' + rotate +'deg) scale(' + scale + ')'
	});
	callMethod(e.instance, 'dataChange', {
		width: img.width,
		height: img.height,
		x: offset.x,
		y: offset.y,
		rotate: rotate
	});
};
/**
 * 变更裁剪区域布局信息
 * @param {Object} e 布局信息
 */
function changeAreaRect(e) {
	// console.log('changeAreaRect', e)
	// 变更蒙版样式
	setStyle(e.instance, 'maskStylesList', [
		{
			left: 0,
			width: (area.left + areaOffset.left) + 'px',
			top: 0,
			bottom: 0,
		},
		{
			left: (area.right + areaOffset.right) + 'px',
			right: 0,
			top: 0,
			bottom: 0,
		},
		{
			left: (area.left + areaOffset.left) + 'px',
			width: (area.width + areaOffset.right - areaOffset.left) + 'px',
			top: 0,
			height: (area.top + areaOffset.top) + 'px',
		},
		{
			left: (area.left + areaOffset.left) + 'px',
			width: (area.width + areaOffset.right - areaOffset.left) + 'px',
			top: (area.bottom + areaOffset.bottom) + 'px',
			// height: (area.top - areaOffset.bottom + sys.offsetBottom) + 'px',
			bottom: 0,
		}
	]);
	// 变更边框样式
	if(area.showBorder) {
		setStyle(e.instance, 'borderStyles', {
			left: (area.left + areaOffset.left) + 'px',
			top: (area.top + areaOffset.top) + 'px',
			width: (area.width + areaOffset.right - areaOffset.left) + 'px',
			height: (area.height + areaOffset.bottom - areaOffset.top) + 'px',
		});
	}

	// 变更参考线样式
	if(area.showGrid) {
		setStyle(e.instance, 'gridStylesList', [
			{
				'border-width': '1px 0 0 0',
				left: (area.left + areaOffset.left) + 'px',
				right: (area.right + areaOffset.right) + 'px',
				top: (area.top + areaOffset.top + (area.height + areaOffset.bottom - areaOffset.top) / 3 - 0.5) + 'px',
				width: (area.width + areaOffset.right - areaOffset.left) + 'px'
			},
			{
				'border-width': '1px 0 0 0',
				left: (area.left + areaOffset.left) + 'px',
				right: (area.right + areaOffset.right) + 'px',
				top: (area.top + areaOffset.top + (area.height + areaOffset.bottom - areaOffset.top) * 2 / 3 - 0.5) + 'px',
				width: (area.width + areaOffset.right - areaOffset.left) + 'px'
			},
			{
				'border-width': '0 1px 0 0',
				top: (area.top + areaOffset.top) + 'px',
				bottom: (area.bottom + areaOffset.bottom) + 'px',
				left: (area.left + areaOffset.left + (area.width + areaOffset.right - areaOffset.left) / 3 - 0.5) + 'px',
				height: (area.height + areaOffset.bottom - areaOffset.top) + 'px'
			},
			{
				'border-width': '0 1px 0 0',
				top: (area.top + areaOffset.top) + 'px',
				bottom: (area.bottom + areaOffset.bottom) + 'px',
				left: (area.left + areaOffset.left + (area.width + areaOffset.right - areaOffset.left) * 2 / 3 - 0.5) + 'px',
				height: (area.height + areaOffset.bottom - areaOffset.top) + 'px'
			}
		]);
	}

	// 变更四个伸缩角样式
	if(area.showAngle) {
		setStyle(e.instance, 'angleStylesList', [
			{
				'border-width': area.angleBorderWidth + 'px 0 0 ' + area.angleBorderWidth + 'px',
				left: (area.left + areaOffset.left - area.angleBorderWidth) + 'px',
				top: (area.top + areaOffset.top - area.angleBorderWidth) + 'px',
			},
			{
				'border-width': area.angleBorderWidth + 'px ' + area.angleBorderWidth + 'px 0 0',
				left: (area.right + areaOffset.right - area.angleSize) + 'px',
				top: (area.top + areaOffset.top - area.angleBorderWidth) + 'px',
			},
			{
				'border-width': '0 0 ' + area.angleBorderWidth + 'px ' + area.angleBorderWidth + 'px',
				left: (area.left + areaOffset.left - area.angleBorderWidth) + 'px',
				top: (area.bottom + areaOffset.bottom - area.angleSize) + 'px',
			},
			{
				'border-width': '0 ' + area.angleBorderWidth + 'px ' + area.angleBorderWidth + 'px 0',
				left: (area.right + areaOffset.right - area.angleSize) + 'px',
				top: (area.bottom + areaOffset.bottom - area.angleSize) + 'px',
			}
		]);
	}

	// 变更圆角样式
	if(area.radius > 0) {
		var radius = area.radius;
		if(area.width === area.height && area.radius >= area.width / 2) { // 圆形
			radius = (area.width / 2);
		} else { // 圆角矩形
			if(area.width !== area.height) { // 限制圆角半径不能超过短边的一半
				radius = Math.min(area.width / 2, area.height / 2, radius);
			}
		}
		setStyle(e.instance, 'circleBoxStyles', {
			left: (area.left + areaOffset.left) + 'px',
			top: (area.top + areaOffset.top) + 'px',
			width: (area.width + areaOffset.right - areaOffset.left) + 'px',
			height: (area.height + areaOffset.bottom - areaOffset.top) + 'px'
		});
		setStyle(e.instance, 'circleStyles', {
			'box-shadow': '0 0 0 ' + Math.max(area.width, area.height) + 'px rgba(51, 51, 51, 0.8)',
			'border-radius': radius + 'px'
		});
	}
};
/**
 * 缩放图片
 * @param {Object} e 布局信息
 */
function scaleImage(e) {
	// console.log('scaleImage', e)
	var last = scale;
	scale = Math.min(Math.max(e.scale + scale, minScale), img.maxScale);
	if(last !== scale) {
		img.width = img.oldWidth * scale;
		img.height = img.oldHeight * scale;
		// 参考问题：有一个长4000px、宽4000px的四方形ABCD，A点的坐标固定在(-2000,-2000)，
		// 			该四边形上有一个点E，坐标为(-100,-300)，将该四方形复制一份并缩小到90%后，
		// 			新四边形的A点坐标为多少时可使新四边形的E点与原四边形的E点重合？
		// 预期效果：从图中选取某点（参照物）为中心点进行缩放，缩放时无论图像怎么变化，该点位置始终固定不变
		// 计算方法：以相同起点先计算缩放前后两点间的距离，再加上原图像偏移量即可
		e.x = (e.x - offset.x) * (1 - scale / last);
		e.y = (e.y - offset.y) * (1 - scale / last);
		changeImageRect(e);
		return true;
	}
	return false;
};
/**
 * 获取触摸点在哪个角
 * @param {number} x 触摸点x轴坐标
 * @param {number} y 触摸点y轴坐标
 * @return {number} 角的位置：0=无；1=左上；2=右上；3=左下；4=右下；
 */
function getToucheAngle(x, y) {
	// console.log('getToucheAngle', x, y, JSON.stringify(area))
	var o = area.angleBorderWidth; // 需扩大触发范围则把 o 值加大即可
	var oy = sys.navigation ? 0 : sys.windowTop;
	if(y >= area.top - o + oy && y <= area.top + area.angleSize + o + oy) {
		if(x >= area.left - o && x <= area.left + area.angleSize + o) {
			return 1; // 左上角
		} else if(x >= area.right - area.angleSize - o && x <= area.right + o) {
			return 2; // 右上角
		}
	} else if(y >= area.bottom - area.angleSize - o + oy && y <= area.bottom + o + oy) {
		if(x >= area.left - o && x <= area.left + area.angleSize + o) {
			return 3; // 左下角
		} else if(x >= area.right - area.angleSize - o && x <= area.right + o) {
			return 4; // 右下角
		}
	}
	return 0; // 无触摸到角
};
/**
 * 重置数据
 */
function resetData() {
	offset = { x: 0, y: 0 };
	scale = 1;
	minScale = 1;
	rotate = 0;
};
function getTouchs(touches) {
	var result = [];
	var len = touches ? touches.length : 0
	for (var i = 0; i < len; i++) {
		result[i] = {
			pageX: touches[i].pageX,
			// h5无标题栏时，窗口顶部距离仍为标题栏高度，且触摸点y轴坐标还是有标题栏的值，即减去标题栏高度的值
			pageY: touches[i].pageY + sys.windowTop
		};
	}
	return result;
};
export default {
	data() {
		return {
			imageStyles: {},
			maskStylesList: [{}, {}, {}, {}],
			borderStyles: {},
			gridStylesList: [{}, {}, {}, {}],
			angleStylesList: [{}, {}, {}, {}],
			circleBoxStyles: {},
			circleStyles: {}
		}
	},
	created() {
		// 监听 PC 端鼠标滚轮
		// #ifdef H5
		window.addEventListener('mousewheel', (e) => {
			var touchs = getTouchs([e])
			img.src && scaleImage({
				instance: this.getInstance(),
				check: true,
				// 鼠标向上滚动时，deltaY 固定 -100，鼠标向下滚动时，deltaY 固定 100
				scale: e.deltaY > 0 ? -0.05 : 0.05,
				x: touchs[0].pageX,
				y: touchs[0].pageY
			});
		});
		// #endif
	},
	methods: {
		getInstance() {
			// #ifdef APP-PLUS
			return this.$ownerInstance;
			// #endif
			// #ifdef H5
			return this;
			// #endif
		},
		/**
		 * 初始化：观察数据变更
		 * @param {Object} newVal 新数据
		 * @param {Object} oldVal 旧数据
		 * @param {Object} o 组件实例对象
		 */
		initObserver: function(newVal, oldVal, o, i) {
			// console.log('initObserver', newVal, oldVal, o, i)
			if(newVal && (!img.src || timestamp !== newVal.timestamp)) {
				timestamp = newVal.timestamp;
				img = newVal.img;
				sys = newVal.sys;
				area = newVal.area;
				resetData();
				img.src && changeImageRect({
					instance: this.getInstance(),
					x: (sys.windowWidth - img.width) / 2,
					y: (sys.windowHeight + sys.windowTop - sys.offsetBottom - img.height) / 2
				});
				changeAreaRect({
					instance: this.getInstance()
				});
			}
		},
		/**
		 * 鼠标滚轮滚动
		 * @param {Object} e 事件对象
		 * @param {Object} o 组件实例对象
		 */
		mousewheel: function(e, o) {
			// h5平台 wheel 事件无法判断滚轮滑动方向，需使用 mousewheel
		},
		/**
		 * 触摸开始
		 * @param {Object} e 事件对象
		 * @param {Object} o 组件实例对象
		 */
		touchstart: function(e, o) {
			if(!img.src) return;
			touches = getTouchs(e.touches);
			activeAngle = area.showAngle ? getToucheAngle(touches[0].pageX, touches[0].pageY) : 0;
			if(touches.length === 1 && activeAngle !== 0) {
				touchType = 'stretch'; // 伸缩裁剪区域
			} else {
				touchType = '';
			}
			// console.log('touchstart', e, activeAngle)
		},
		/**
		 * 触摸移动
		 * @param {Object} e 事件对象
		 * @param {Object} o 组件实例对象
		 */
		touchmove: function(e, o) {
			if(!img.src) return;
			// console.log('touchmove', e, o)
			e.touches = getTouchs(e.touches);
			if(touchType === 'stretch') { // 触摸四个角进行拉伸
				var point = e.touches[0];
				var start = touches[0];
				var x = point.pageX - start.pageX;
				var y = point.pageY - start.pageY;
				if(x !== 0 || y !== 0) {
					var maxX = area.width * (1 - area.minScale);
					var maxY = area.height * (1 - area.minScale);
					// console.log(x, y, maxX, maxY)
					touches[0] = point;
					switch(activeAngle) {
						case 1: // 左上角
							x += areaOffset.left;
							y += areaOffset.top;
							if(x >= 0 && y >= 0) { // 有效滑动
								if(x > y) { // 以x轴滑动距离为缩放基准
									if(x > maxX) x = maxX;
									y = x * area.height / area.width;
								} else { // 以y轴滑动距离为缩放基准
									if(y > maxY) y = maxY;
									x = y * area.width / area.height;
								}
								areaOffset.left = x;
								areaOffset.top = y;
							}
							break;
						case 2: // 右上角
							x += areaOffset.right;
							y += areaOffset.top;
							if(x <= 0 && y >= 0) { // 有效滑动
								if(-x > y) { // 以x轴滑动距离为缩放基准
									if(-x > maxX) x = -maxX;
									y = -x * area.height / area.width;
								} else { // 以y轴滑动距离为缩放基准
									if(y > maxY) y = maxY;
									x = -y * area.width / area.height;
								}
								areaOffset.right = x;
								areaOffset.top = y;
							}
							break;
						case 3: // 左下角
							x += areaOffset.left;
							y += areaOffset.bottom;
							if(x >= 0 && y <= 0) { // 有效滑动
								if(x > -y) { // 以x轴滑动距离为缩放基准
									if(x > maxX) x = maxX;
									y = -x * area.height / area.width;
								} else { // 以y轴滑动距离为缩放基准
									if(-y > maxY) y = -maxY;
									x = -y * area.width / area.height;
								}
								areaOffset.left = x;
								areaOffset.bottom = y;
							}
							break;
						case 4: // 右下角
							x += areaOffset.right;
							y += areaOffset.bottom;
							if(x <= 0 && y <= 0) { // 有效滑动
								if(-x > -y) { // 以x轴滑动距离为缩放基准
									if(-x > maxX) x = -maxX;
									y = x * area.height / area.width;
								} else { // 以y轴滑动距离为缩放基准
									if(-y > maxY) y = -maxY;
									x = y * area.width / area.height;
								}
								areaOffset.right = x;
								areaOffset.bottom = y;
							}
							break;
					}
					// console.log(x, y, JSON.stringify(areaOffset))
					changeAreaRect({
						instance: this.getInstance(),
					});
					// this.draw();
				}
			} else if (e.touches.length == 2) { // 双点触摸缩放
				var start = getDistanceByTouches(touches);
				var end = getDistanceByTouches(e.touches);
				scaleImage({
					instance: this.getInstance(),
					check: !area.bounce,
					scale: (end.c - start.c) / 100,
					x: end.x,
					y: end.y
				});
				touchType = 'scale';
			} else if(touchType === 'scale') {// 从双点触摸变成单点触摸 / 从缩放变成拖动
				touchType = 'move';
			} else {
				changeImageRect({
					instance: this.getInstance(),
					check: !area.bounce,
					x: e.touches[0].pageX - touches[0].pageX,
					y: e.touches[0].pageY - touches[0].pageY
				});
				touchType = 'move';
			}
			touches = e.touches;
		},
		/**
		 * 触摸结束
		 * @param {Object} e 事件对象
		 * @param {Object} o 组件实例对象
		 */
		touchend: function(e, o) {
			if(!img.src) return;
			if(touchType === 'stretch') { // 拉伸裁剪区域的四个角缩放
				// 裁剪区域宽度被缩放到多少
				var left = areaOffset.left;
				var right = areaOffset.right;
				var top = areaOffset.top;
				var bottom = areaOffset.bottom;
				var w = area.width + right - left;
				var h = area.height + bottom - top;
				// 图像放大倍数
				var p = scale * (area.width / w) - scale;
				// 复原裁剪区域
				areaOffset = { left: 0, right: 0, top: 0, bottom: 0 };
				changeAreaRect({
					instance: this.getInstance(),
				});
				scaleImage({
					instance: this.getInstance(),
					scale: p,
					x: area.left + left + (1 === activeAngle || 3 === activeAngle ? w : 0),
					y: area.top + top + (1 === activeAngle || 2 === activeAngle ? h : 0)
				});
			} else if (area.bounce) { // 检查边界并矫正，实现拖动到边界时有回弹效果
				changeImageRect({
					instance: this.getInstance(),
					check: true
				});
			}
		},
		/**
		 * 顺时针翻转图片90°
		 * @param {Object} e 事件对象
		 * @param {Object} o 组件实例对象
		 */
		rotateImage: function(e, o) {
			rotate = (rotate + 90) % 360;

			// 因图片宽高可能不等，翻转后图片宽高需足够填满裁剪区域
			var r = rotate / 90 % 2;
			minScale = 1;
			if(img.width < area.height) {
				minScale = area.height / img.oldWidth;
			} else if(img.height < area.width) {
				minScale = (area.width / img.oldHeight)
			}
			if(minScale !== 1) {
				scaleImage({
					instance: this.getInstance(),
					scale: minScale - scale,
					x: sys.windowWidth / 2,
					y: (sys.windowHeight - sys.offsetBottom) / 2
				});
			}

			// 由于拖动画布后会导致图片位置偏移，翻转时的旋转中心点需是图片区域+偏移区域的中心点
			// 翻转x轴中心点 = (超出裁剪区域右侧的图片宽度 - 超出裁剪区域左侧的图片宽度) / 2
			// 翻转y轴中心点 = (超出裁剪区域下方的图片宽度 - 超出裁剪区域上方的图片宽度) / 2
			var ox = ((offset.x + img.width - area.right) - (area.left - offset.x)) / 2;
			var oy = ((offset.y + img.height - area.bottom) - (area.top - offset.y)) / 2;
			changeImageRect({
				instance: this.getInstance(),
				check: true,
				x: -ox - oy,
				y: -oy + ox
			});
		}
	}
}
