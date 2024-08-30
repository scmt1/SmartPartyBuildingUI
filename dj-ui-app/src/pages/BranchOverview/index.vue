<template>
	<view class="introduce" v-loading="loading">
		<nav2 :config="config" :defaultIndex="defaultIndex" @changeType="changeType"></nav2>
		<Introduce :data="data" class="distance" v-if="defaultIndex == 0"></Introduce>
		<Position :data="data" class="distance" v-else-if="defaultIndex == 1"></Position>
	</view>
</template>

<script>
import nav2 from '@/components/nav/nav2.vue'
import Introduce from './introduce.vue'
import Position from './position.vue'
import {getDeptIntroduceById} from "@/api/tzSysDept"
import { mapGetters, createNamespacedHelpers } from 'vuex'
import util from "@/utils/util";
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name: 'index',
	components: {
		nav2,
		Introduce,
		Position
	},
	data() {
		return {
			defaultIndex: 0,
			config: [{
					name: '支部介绍',
					value: 0,
				},
				// {
				// 	name: '党建阵地',
				// 	value: 1,
				// },
			],
			data: {
				deptInfo: {},
				partyInfoList: []
			},
			positionList: []
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "支部概况"});
		} catch (error) {
			document.title = "支部概况";
		}*/
	},
	onReady() {
		this.getDeptIntroduce()
		this.setLoading(false);
	},
	computed: {
		...mapGetters([
			'userInfo'
		]),
		...mapState([
			'loading'
		])
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		changeType(index) {
			this.defaultIndex = index
		},
		getDeptIntroduce() {
			const deptId = this.userInfo.deptId
			getDeptIntroduceById(deptId).then(res =>{
				if (res.code == '00000') {
                    if(res.data.deptInfo && res.data.deptInfo.deptPhoto){
                        res.data.deptInfo.deptPhoto = res.data.deptInfo.deptPhoto.replace("http://10.4.117.31:7000", util.minionUrl);
                    }
                    if(res.data.partyInfoList.length > 0){
                        for (let i = 0; i < res.data.partyInfoList; i++) {
                            if(res.data.partyInfoList[i].avatar){
                                res.data.partyInfoList[i].avatar = res.data.partyInfoList[i].avatar.replace("http://10.4.117.31:7000", util.minionUrl);
                            }
                        }
                    }
                    if(res.data.activeAttachFiles.length > 0){
                        for (let i = 0; i < res.data.activeAttachFiles; i++) {
                            if(res.data.activeAttachFiles[i].photo){
                                res.data.activeAttachFiles[i].photo = res.data.activeAttachFiles[i].photo.replace("http://10.4.117.31:7000", util.minionUrl);
                            }
                        }
                    }
					this.data = res.data
				} else {
					uni.showToast({
					  icon: 'none',
					  title: res.msg,
					  duration: 2000
					})
				}
			})
		},
	}
}
</script>

<style lang="scss" scoped>
	.introduce {
		height: 100vh;
		display: flex;
		flex-direction: column;
		.distance {
			margin-top: 100rpx;
		}
	}
</style>
