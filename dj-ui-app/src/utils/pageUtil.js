export const distinctData = (ids, infoList) => {
	let data = []
	if (ids.length == 0) {
		for (let i = 0; i < infoList.length; i++) {
			data.push(infoList[i])
			ids.push(infoList[i].id)
		}
	} else {
		for (let i = 0; i < infoList.length; i++) {
			if (ids.indexOf(infoList[i].id < 0)) {
				data.push(infoList[i])
				ids.push(infoList[i].id)
			}
		}
	}
	return {resultData: data, ids: ids}
}

export const getLoadmoreStatus = (data, nextResult) => {
	if (nextResult.records.length == 0 || nextResult.total == 0 || data.length == nextResult.total) {
		return 'nomore'
	} else {
		return 'loadmore'
	}
}

export const getLoadmoreStatus2 = (data, nextLength, nextTotal) => {
	if (nextLength == 0 || nextTotal == 0 || data.length == nextTotal) {
		return 'nomore'
	} else {
		return 'loadmore'
	}
}
