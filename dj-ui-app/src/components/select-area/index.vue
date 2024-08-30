<template>
	<view class="box">
		<view class="content">
			<view class="title">
				<view style="flex: 1;">请选择所在地区</view>
				<view v-if="closeButton" @click="close" style="display: inline-block;">
					<u-icon name="close" color="#000" :size="'35rpx'"></u-icon>
				</view>
			</view>
			<view class="name">
				<template v-for="(item, index) in selectAreaName">
					<text @click="clickAreaName(index)" v-if="item != '请选择' && index < level" style="padding-right: 20rpx;">
						<text style="padding: 10rpx 0;">{{ item }}</text>
					</text>
					<text v-else-if="item == '请选择' && index < level" style="padding-right: 20rpx; color: red;">
						<text style="border-bottom: 1px solid red; padding: 10rpx 0;">{{ item }}</text>
					</text>
				</template>
			</view>
			
			<scroll-view :style="{'height': scrollHeight}" scroll-y="true" 
				:scroll-top="scrollTop" @scroll="scroll">
				<view style="font-size: 29rpx; padding: 20rpx 0; border-top: 1rpx solid rgb(245, 245, 246);" v-for="(item, index) in dataList" :key="index" @click="selectArea(item)">
					<text v-if="selectAreaId[level - 1] == item.id" style="color: red; font-weight: bold;">
						{{ item.name }}
					</text>
					<text v-else>
						{{ item.name }}
					</text>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
import {getAreaList} from '@/api/jcxfSysArea'

export default {
	props: {
		maxLevel: {
			type: Number,
			default: 4
		},
		closeButton: {
			type: Boolean,
			default: false
		},
		defaultAreaName: {
			type: Array,
			default: []
		},
		defaultAreaId: {
			type: Array,
			default: []
		},
	},
	data() {
		return {
			level: 1,
			id: '',
			dataList: [],
			selectAreaId: ['', '', '', ''],
			selectAreaName: ['请选择', '请选择', '请选择', '请选择'],
			scrollHeight: '',
			scrollTop: 0,
			oldScrollTop: 0
		}
	},
	mounted() {
		// 数据回显
		if (this.defaultAreaName && this.defaultAreaId && 
			this.defaultAreaName != null && this.defaultAreaId != null 
			&& this.defaultAreaName.length > 0 && this.defaultAreaId.length > 0) {
			this.level = this.defaultAreaId.length
			this.id = this.defaultAreaId[this.defaultAreaId.length - 2]
			
			for (let i = 0; i < this.defaultAreaName.length; i++) {
				this.selectAreaName[i] = this.defaultAreaName[i]
				this.selectAreaId[i] = this.defaultAreaId[i]
			}
		}
		
		this.$forceUpdate()
		
		this.getAreaData()
		this.$nextTick(() =>{
			const query = uni.createSelectorQuery().in(this)
			
			let boxHeight = 0
			let titleHeight = 0
			let nameHeight = 0
			query.select('.content').boundingClientRect((res) => {
				boxHeight = res.height
			}).exec()
			
			query.select('.title').boundingClientRect((res) => {
				titleHeight = res.height
			}).exec()
			
			query.select('.name').boundingClientRect((res) => {
				nameHeight = res.height
			}).exec()
			
			this.scrollHeight = boxHeight - titleHeight -nameHeight + 'px'
		})
	},
	methods: {
		scroll(e) {
			this.oldScrollTop = e.detail.scrollTop
		},
		goTop() {
			this.scrollTop = this.oldScrollTop
			this.$nextTick(() => {
				this.scrollTop = 0
			})
		},
		clickAreaName(index) {
			this.level = index + 1
			if (this.level == 1) {
				this.id = ''
			} else {
				this.id = this.selectAreaId[index - 1]
			}
			this.getAreaData()
			for (let i = index; i < this.maxLevel;i++) {
				this.selectAreaName[i] = '请选择'
				this.selectAreaId[i] = ''
			}
			this.goTop()
			this.$forceUpdate()
		},
		selectArea(item) {
			this.selectAreaId[item.level - 1] = item.id
			this.selectAreaName[item.level - 1] = item.name
			this.$forceUpdate()
			if (this.level == this.maxLevel) {
				this.confirm()
				return
			}
			if (this.level < 4) {
				this.level++
				this.id = item.id
				this.getAreaData()
			}
			this.goTop()
		},
		getAreaData() {
			let data = {
				level: this.level+'',
				id: this.id + ''
			}
			getAreaList(data).then(res => {
				if (res.code == '00000') {
					// 如果已经没有了次一级区域，则直接返回选中结果
					if (res.data.length == 0) {
						this.confirm()
					}
					this.dataList = res.data
					this.$forceUpdate()
				}
			})
		},
		confirm() {
			let areaName = ''
			let areaNameValue = []
			let areaIdValue = []
			let areaId = ''
			
			for (let i = 0; i < this.maxLevel; i++) {
				if (this.selectAreaName[i] != '请选择') {
					areaName += this.selectAreaName[i]
					areaNameValue.push(this.selectAreaName[i])
					areaIdValue.push(this.selectAreaId[i])
					areaId = this.selectAreaId[i]
				} else {
					areaId = this.selectAreaId[i - 1]
					break
				}
			}
			let data = {
				areaNameValue: areaNameValue,
				areaIdValue: areaIdValue,
				areaName: areaName,
				areaId: areaId
			}
			
			console.log(data)
			
			this.$emit("confirm", data)
		},
		close() {
			this.$emit("close")
		}
	}
}
</script>

<style lang="scss" scoped>
	.box {
		height: 70vh; padding: 30rpx; display: flex; flex-direction: column;
		
		.content {
			height: calc(70vh - 60rpx);
			overflow: hidden;
			
			.title {
				font-size: 30rpx; font-weight: bold;
				display: flex;
			}
			
			.name {
				padding: 40rpx 0;
			}
		}
		
	}
</style>