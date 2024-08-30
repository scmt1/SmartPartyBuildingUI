# address-picker：基于uView的地区选择器组件

支持省市区三级联动，支持省，省市，省市区的选择，支持通过地区名、索引和地区id回显数据（优先级：地区名>索引>地区id）,欢迎加入摸鱼交流群：469187546,一起来摸鱼啊🚀

直接下载插件导入hbuilder后可直接使用,下载示例项目解读会更加清晰

```html
<template>
	<view class="content">
		<u-form>
			<u-form-item label="地址" prop="address" @click="addressShow = true;">
				<u--input v-model="address" disabled disabledColor="#ffffff" border="none"
					placeholder='请输入家庭地址'></u--input>
			</u-form-item>
		</u-form>
		<address-picker :show="addressShow" closeOnClickOverlay @confirm='confirmAddress' @cancel='addressShow=false'
			@close='addressShow = false' :address-data="addressData" :indexs="indexs" :areaId="areaId" :type="type"></address-picker>
	</view>
</template>
```

通过传入type控制选择器，1：省，2：省市，3：省市区

```javascript
<script>
	export default {
		data() {
			return {
				address: '',
				addressShow: false,
				indexs: [0, 0, 0],
				areaId: [1, 110000, 110101],
				addressData: ['北京市', '北京市', '东城区'],
				type: 3, //1-省，2-省市，3-省市区
			}
		},
		onLoad() {

		},
		methods: {
			confirmAddress(val) {
				console.log(val);
				this.address = val.value.join('')
				this.addressShow = false
			}
		}
	}
</script>

```

使用的uView的picker组件二次封装，所以props和方法都和picker组件一样，看不懂的可以去[picker组件查看](https://www.uviewui.com/components/picker.html)

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ce6dd2894c4539a4cb6a9ada0319d0~tplv-k3u1fbpfcp-watermark.image?](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ce6dd2894c4539a4cb6a9ada0319d0~tplv-k3u1fbpfcp-watermark.image?)

![https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acc5ac565eb342ccb2ed7eb54cdf0d21~tplv-k3u1fbpfcp-watermark.image?](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acc5ac565eb342ccb2ed7eb54cdf0d21~tplv-k3u1fbpfcp-watermark.image?)