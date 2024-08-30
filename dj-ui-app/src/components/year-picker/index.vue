<template>
	<view>
		<u-picker :show="show" ref="uPicker" :title="title" :itemHeight="itemHeight"
			:cancelText="cancelText" :cancelColor="cancelColor" :confirmText="confirmText" :confirmColor="confirmColor"
			:loading="loading" :visibleItemCount="visibleItemCount" :defaultIndex="indexs" :columns="columns"
			:closeOnClickOverlay="closeOnClickOverlay" @confirm="confirm" @close="close" @cancel="cancel"
			@change="changeHandler">
		</u-picker>
	</view>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: () => false
		},
		title: {
			type: String,
			default: () => ""
		},
		itemHeight: {
			type: [String, Number],
			default: () => 70
		},
		cancelText: {
			type: String,
			default: () => "取消"
		},
		cancelColor: {
			type: String,
			default: () => "#909193"
		},
		confirmText: {
			type: String,
			default: () => "确认"
		},
		confirmColor: {
			type: String,
			default: () => "#3c9cff"
		},
		visibleItemCount: {
			type: [String, Number],
			default: () => 5
		},
		loading: {
			type: Boolean,
			default: () => false
		},
		indexs: Array,
		closeOnClickOverlay: Boolean,
	},
	data() {
		return {
			columns: [],
			time: null
		}
	},
	mounted() {
		this.formatData()
	},
	methods: {
		formatData() {
			this.columns = []
			let data = new Date()
			let year = data.getFullYear() - 30
			let columns = []
			for (let i = 0; i < 31; i++) {
				columns.push(year)
				year++
			}
			this.time = data.getFullYear()
			this.columns.push(columns)
		},
		changeHandler(e) {
			this.time = e.value
		},
		confirm(e) {
			this.$emit("confirm", this.time)
		},
		close() {
			this.$emit("close")
		},
		open() {
			this.$emit("open")
			this.formatData()
		},
		cancel() {
			this.$emit("cancel")
		}
	}
}
</script>

<style>
</style>
