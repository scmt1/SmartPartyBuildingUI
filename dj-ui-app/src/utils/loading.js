import Vue from 'vue';
/*移除loading*/
const removeDom = (el) => {
	const ds = el.getElementsByClassName('el-loading-mask')[0];
	if(ds) {
		el.removeChild(ds);
		el.classList.remove('el-loading-parent-relative');
	}
}

/*插入loading*/
const insertDom = (el) => {
	let dom = `<div class="el-loading-mask">
		<div class="el-loading-spinner">
			<div class="el-loading-box">
				<svg viewBox="25 25 50 50" class="circular">
					<circle cx="50" cy="50" r="20" fill="none" class="path"> </circle>
				</svg>
				<p class="el-loading-text">加载中...</p>
			</div>
		</div>
	</div>`
	
	// el添加相对定位
	el.classList.add('el-loading-parent-relative');
	
	// 插入到被绑定的元素内部
	el.insertAdjacentHTML('afterbegin', dom);
	
	
}

// 更新是否显示
const toggleLoading = (el, binding) => {
	if(binding.value) {
		insertDom(el);
	}else {
		removeDom(el)
	}
}

Vue.directive('loading', {
	bind: function(el, binding, vnode) {
		toggleLoading(el, binding)
	},
	// 所在组件的Vnode更新时调用--比较更新前后的值
	update: function(el, binding) {
		if(binding.oldValue != binding.value) {
			toggleLoading(el, binding);
		}
	}
})