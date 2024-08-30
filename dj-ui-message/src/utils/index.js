import Vue from 'vue'
import router from '@/router'

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 将数组中的parentId列表取出，倒序排列
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function idList (data, val, id = 'id', children = 'children') {
  let res = []
  idListFromTree(data, val, res, id)
  return res
}

/**
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
function idListFromTree (data, val, res = [], id = 'id', children = 'children') {
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    if (element[children]) {
      if (idListFromTree(element[children], val, res, id, children)) {
        res.push(element[id])
        return true
      }
    }
    if (element[id] === val) {
      res.push(element[id])
      return true
    }
  }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('Authorization_vs')
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass (ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass (ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass (ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
* 清除详情富文本自带样式
*/
export function formatHtml (content) {
  content = content.replace(/\\<img/gi, '<img style="width:100% !important;height:auto !important;margin:0;display:flex;" ')
  content = content.replace(/style="/gi, 'style="max-width:100% !important;table-layout:fixed;word-wrap:break-word;word-break;break-word;')
 // content = content.replace(/\<table/gi, '<table style="table-layout:fixed;word-wrap:break-word;word-break;break-all;" ');
 // content = content.replace(/\<td/gi, '<td  cellspacing="0" cellpadding="0" border="0" style="display:block;vertical-align:top;margin: 0px; padding: 0px; border: 0px;outline-width:0px;" ');
  content = content.replace(/width=/gi, 'sss=')
  content = content.replace(/height=/gi, 'sss=')
  content = content.replace(/class=/gi, 'sss=')
  content = content.replace(/ \/\\>/gi, ' style="max-width:100% !important;height:auto !important;margin:0;display:block;" \\/\\>')
  return content
}

// 计算每个sku后面有多少项
export function getLevels (tree) {
  const level = []
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].tagItems) {
      level[i] = tree[i + 1].tagItems.length * level[i + 1] || 1
    } else {
      level[i] = 1
    }
  }
  return level
}

/**
 * 笛卡尔积运算
 * @param  {[type]} tree   [description]
 * @param  {Array}  stocks [description]
 * @param defaultObj
 * @return {{}}        [description]
 */
export function flatten (tree, stocks = [], defaultObj) {
  // 返回结果
  const result = []
  // sku的数据
  let skuLen = 0
  // 记录已存在的stock的数据
  const stockMap = {}
  // sku等级关系
  const level = getLevels(tree)
  // 没有参数时
  if (tree.length === 0) {
    if (stocks && stocks.length === 1 && (!stocks[0].properties || stocks[0].properties === '')) {
      return stocks
    } else {
      return [Object.assign({}, defaultObj)]
    }
  }
  // 计算sku数据
  tree.forEach(sku => {
    const { tagItems } = sku
    if (!tagItems || tagItems.length === 0) return true
    skuLen = (skuLen || 1) * tagItems.length
  })
  // 根据已有的stocks生成一个map
  stocks.forEach(stock => {
    const { properties, ...attr } = stock
    stockMap[properties] = attr
  })
  // 生成笛卡尔积
  for (let i = 0; i < skuLen; i++) {
    const mapKey = []
    const mapKeyEn = []
    const temp = {}
    tree.forEach((sku, column) => {
      const { tagItems } = sku
      let item = {}
      if (!tagItems || tagItems.length === 0) return true
      if (tagItems.length > 1) {
        // 计算当前sku的行数
        const row = parseInt(i / level[column], 10) % tagItems.length
        item = tree[column].tagItems[row]
      } else {
        item = tree[column].tagItems[0]
      }
      if (item.pic) {
        temp.pic = item.pic
      }
      if (!sku['tagName'] || !item['propValue']) return
      mapKey.push(`${sku['tagName']}:${item['propValue']}`)
      mapKeyEn.push(`${sku['tagNameEn']}:${item['propValueEn']}`)
    })
    const { ...data } = stockMap[mapKey.join(';')] || {}
    temp.properties = mapKey.join(';')
    temp.propertiesEn = mapKeyEn.join(';')
    // 从map中找出存在的sku并保留其值
    result.push({ ...defaultObj, ...data, ...temp })
  }
  return result
}

/**
 * 将数字转换为万，千万、亿等
 * @param value 数字值
 */
 export function bigNumberTransform (value) {
  const newValue = ['', '', '']
  let fr = 1000
  let num = 3
  let text1 = ''
  let fm = 1
  while (value / fr >= 1) {
    fr *= 10
    num += 1
    // console.log('数字', value / fr, 'num:', num)
  }
  if (num <= 4) { // 千
    newValue[0] = parseInt(value / 1000) + ''
    newValue[1] = 'k'
  } else if (num <= 8) { // 万
    text1 = parseInt(num - 4) / 3 > 1 ? 'kw' : 'w'
    // tslint:disable-next-line:no-shadowed-variable
    fm = text1 === 'w' ? 10000 : 10000000
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + ''
    } else {
      newValue[0] = parseFloat(value / fm).toFixed(2) + ''
    }
    newValue[1] = text1
  } else if (num <= 16) { // 亿
    text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
    text1 = (num - 8) / 4 > 1 ? '万亿' : text1
    text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
    // tslint:disable-next-line:no-shadowed-variable
    fm = 1
    if (text1 === '亿') {
      fm = 100000000
    } else if (text1 === '千亿') {
      fm = 100000000000
    } else if (text1 === '万亿') {
      fm = 1000000000000
    } else if (text1 === '千万亿') {
      fm = 1000000000000000
    }
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + ''
    } else {
      newValue[0] = parseFloat(value / fm).toFixed(2) + ''
    }
    newValue[1] = text1
  }
  if (value < 1000) {
    newValue[0] = value + ''
    newValue[1] = ''
  }
  return newValue.join('')
}
