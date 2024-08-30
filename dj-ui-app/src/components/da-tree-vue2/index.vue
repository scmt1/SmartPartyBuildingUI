<template>
  <view class="da-tree">
    <scroll-view class="da-tree-scroll" :scroll-y="true" :scroll-x="false">
      <view
        class="da-tree-item"
        :class="{'is-show': item.show}"
        :style="{paddingLeft:item.level * indent + (item.isLeaf ? 40 : 0) + 'rpx'}"
        v-for="item in datalist"
        :key="item.key">
        <view
          v-show="!item.isLeaf"
          class="da-tree-item__icon"
          @click="handleExpandedChange(item)">
          <view :class="['da-tree-item__icon--arr','da-tree-loading','is-loading']" v-if="loadLoading && item.loading" />
          <slot name="expand-icon" :data="{ expanded: item.expand }" v-else><view :class="['da-tree-item__icon--arr','da-tree-arrow-down', {'is-right':!item.expand}]" /></slot>
        </view>
        <view
          class="da-tree-item__checkbox"
          :class="[`da-tree-item__checkbox--${checkboxPlacement}`,{'is--disabled': item.disabled}]"
          v-if="showCheckbox"
          @click="handleCheckChange(item)">
          <view class="da-tree-item__checkbox--icon da-tree-checkbox-checked" v-if="item.checkedStatus === isCheckedStatus" />
          <view class="da-tree-item__checkbox--icon da-tree-checkbox-indeterminate" v-else-if="item.checkedStatus === halfCheckedStatus" />
          <view class="da-tree-item__checkbox--icon da-tree-checkbox-outline" v-else />
        </view>
        <view
          class="da-tree-item__checkbox"
          :class="[`da-tree-item__checkbox--${checkboxPlacement}`,{'is--disabled': item.disabled}]"
          v-if="!showCheckbox && showRadioIcon"
          @click="handleRadioChange(item)">
          <view class="da-tree-item__checkbox--icon da-tree-radio-checked" v-if="item.checkedStatus === isCheckedStatus" />
          <view class="da-tree-item__checkbox--icon da-tree-radio-indeterminate" v-else-if="item.checkedStatus === halfCheckedStatus" />
          <view class="da-tree-item__checkbox--icon da-tree-radio-outline" v-else />
        </view>
        <view class="da-tree-item__label" :class="'da-tree-item__label--'+item.checkedStatus" @click="handleRadioChange(item)">
          <view class="da-tree-item__label--prefix">
            <slot name="prefix" :data="item"></slot>
          </view>
          <slot name="label" :data="item">{{ item.label }}</slot>
          <view class="da-tree-item__label--suffix">
            <slot name="suffix" :data="item"></slot>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  unCheckedStatus,
  halfCheckedStatus,
  isCheckedStatus,
  deepClone,
  getAllNodeKeys,
  getAllNodes
} from './utils'

export default {
  name: 'DaTreeVue2',
  props: {
    /**
     * 树的数据
     */
    data: {
      type: Array,
      default: () => [],
    },
    /**
     * 默认选中的节点，注意单选时为单个key，多选时为key的数组
     */
    defaultCheckedKeys: {
      type: [Array, String, Number],
      default: null,
    },
    /**
     * 选择框的位置，可选 left/right
     */
    checkboxPlacement: {
      type: String,
      default: 'left',
    },
    /**
     * 是否默认展开全部
     */
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    /**
     * 默认展开的节点
     */
    defaultExpandedKeys: {
      type: Array,
      default: null,
    },
    /**
     * 子项缩进距离，默认40，单位rpx
     */
    indent: {
      type: Number,
      default: 40,
    },
    /**
     * 字段对应内容，默认为 {label: 'label',key: 'key', children: 'children', disabled: 'disabled'}
     */
    field: {
      type: Object,
      default: null,
    },
    /**
     * 是否开启多选，默认单选
     */
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示单选图标，默认显示
     */
    showRadioIcon: {
      type: Boolean,
      default: true,
    },
    /**
     * 单选时，只允许选中末级，默认可随意选中
     */
    onlyRadioLeaf: {
      type: Boolean,
      default: false,
    },
    /**
     * 多选时，是否执行父子不关联的任意勾选，默认父子关联
     */
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    /**
     * 为 true 时，空的 children 数组会显示展开图标
     */
    loadMode: {
      type: Boolean,
      default: false,
    },
    /**
     * 异步加载接口
     */
    loadApi: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      unCheckedStatus,
      halfCheckedStatus,
      isCheckedStatus,
      /** 原始的树数据 */
      dataRef: [],
      /** 处理前的一维树项数据 */
      flatDatalist: [],
      /** 处理后的一维树项数据 */
      datalist: [],
      /** 处理后的以key为键值的树项数据 */
      datamap: {},
      /** 默认的展开数据 */
      expandedKeys: [],
      /** 默认的已选数据 */
      checkedKeys: null,
      /** 加载状态 */
      loadLoading: false,
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function(v) {
        this.dataRef = deepClone(v)
        this.initData(v)
      },
    },
    defaultExpandedKeys: {
      // deep: true,
      immediate: true,
      handler: function(v) {
        if (v?.length) {
          this.expandedKeys = v
        } else {
          this.expandedKeys = []
        }

        // if (v) this.checkInitData(this.datalist)
      },
    },
    defaultCheckedKeys: {
      // deep: true,
      immediate: true,
      handler: function(v) {
        if (this.showCheckbox) {
          if (v?.length) {
            this.checkedKeys = v
          } else {
            this.checkedKeys = []
          }
        } else {
          if (v || v === 0) {
            this.checkedKeys = v
          } else {
            this.checkedKeys = null
          }
        }
        // this.checkInitData(this.datalist)
      },
    },
  },
  methods: {
    /**
     * 初始化数据结构
     */
    initData() {
      const data = deepClone(this.dataRef)
      this.flatDatalist = []
      this.datalist = []
      this.datamap = {}

      // clean tree
      this.handleTreeData(data)
      // flat tree
      this.datalist = this.checkInitData(this.flatDatalist)
      // console.log('init datalist', this.datalist)
      // console.log('init flatDatalist', this.flatDatalist)
      // console.log('init datamap', this.datamap)
    },

    /**
     * 转换为节点数据
     * @param data
     * @param parent
     * @param level
     */
    handleTreeData(data = [], parent = null, level = 0) {
      return data.reduce((prev, cur, index) => {
        const key = cur[this.field?.key || 'key']
        const children = cur[this.field?.children || 'children'] || null
        const newItem = this.createNewItem(cur, index, parent, level)
        this.datamap[key] = newItem
        this.flatDatalist.push(newItem)

        const hasChildren = children && children.length > 0
        if (hasChildren) {
          const childrenData = this.handleTreeData(children, newItem, level + 1)
          newItem.children = childrenData
          const childrenKeys = childrenData.reduce((p, k) => {
            const keys = k.childrenKeys
            p.push(...keys, k.key)
            return p
          }, [])
          newItem.childrenKeys = childrenKeys
        }
        prev.push(newItem)
        return prev
      }, [])
    },

    /**
     * 创建节点
     * @param item
     * @param index
     * @param parent
     * @param level
     */
    createNewItem(item, index, parent, level) {
      const key = item[this.field?.key || 'key']
      const label = item[this.field?.label || 'label']
      const children = item[this.field?.children || 'children'] || null
      let disabled = item[this.field?.disabled || 'disabled'] || false
      const hasChildren = children && children.length > 0
      const hasEmptyChildren = children && children.length === 0
      let isLeaf = !hasChildren
      let expand = this.defaultExpandAll
      if (this.loadMode && hasEmptyChildren) {
        isLeaf = false
        expand = false
      }

      if (!isLeaf && this.onlyRadioLeaf && !this.showCheckbox) {
        disabled = true
      }

      const parentKey = parent ? parent.key : null
      const show = this.defaultExpandAll ? true : level === 0

      const newItem = {
        key,
        parentKey,
        label,
        isLeaf,
        level,
        expand,
        show,
        disabled,
        loading: false,
        indexs: [index],
        checkedStatus: unCheckedStatus,
        parentKeys: [],
        childrenKeys: [],
        children: [],
        originItem: item,
      }

      if (parent) {
        newItem.parentKeys = [parent.key, ...parent.parentKeys]
        newItem.indexs = [...parent.indexs, index]
      }

      return newItem
    },

    /**
     * 处理初始化内容
     * @param list
     */
    checkInitData(list) {
      let checkedKeyList = null
      let expandedKeyList = [...(this.expandedKeys || []), ...(this.defaultExpandedKeys || [])]
      if (this.showCheckbox) {
        checkedKeyList = [...new Set([...(this.checkedKeys || []), ...(this.defaultCheckedKeys || [])])]
        expandedKeyList = [...expandedKeyList, ...checkedKeyList]
      } else {
        checkedKeyList = this.checkedKeys || this.defaultCheckedKeys || null
        expandedKeyList.push(checkedKeyList)
      }

      this.handleCheckState(list, checkedKeyList)

      // 处理初始显示
      // 同时把选中的节点也显示出来
      expandedKeyList = [...new Set(expandedKeyList)]
      if (!this.defaultExpandAll) {
        this.handleExpandState(list, expandedKeyList, true)
      }

      return list
    },

    /**
     * 处理选中
     * @param list
     * @param checkedKeyList
     */
    handleCheckState(list, checkedKeyList, checked = true) {
      if (this.showCheckbox) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (checkedKeyList?.includes(item.key) && !item.disabled) {
            this.handleExpandParentNode(item, checked)
            this.checkTheChecked(item, checked)
          }
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.key === checkedKeyList && !item.disabled) {
            this.checkTheRadio(item, checked)
            break
          }
        }
      }
    },

    /**
     * 处理父节点展开
     * @param item
     * @param expand
     */
    handleExpandParentNode(item, expand = true) {
      if (!expand) return

      if (item?.parentKeys?.length) {
        item.parentKeys.forEach(pk => {
          if (!this.datamap[pk].expand) {
            this.datamap[pk].expand = true
          }
        })
      }
    },

    /**
     * 处理节点展开
     * @param list
     * @param expandedKeyList
     * @param expand
     */
    handleExpandState(list, expandedKeyList, expand = true) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (expand === true) {
          // 处理展开
          if (expandedKeyList?.includes(item.key)) {
            item.expand = true
            this.handleExpandParentNode(item, true)
          }
        } else {
          // 处理收起
          if (expandedKeyList?.includes(item.key)) {
            item.expand = false
            if (item?.childrenKeys?.length) {
              item.childrenKeys.forEach(ck => {
                this.datamap[ck].expand = false
                this.datamap[ck].show = false
              })
            }
          }
        }
      }

      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.level > 0) {
          const parentItem = this.datamap[item.parentKey]
          if (parentItem) {
            if (parentItem.expand && parentItem.show) {
              item.show = true
            }
          }
        }
      }
    },

    /**
     * 点击选框
     * @param item
     */
    handleCheckChange(item) {
      const { childrenKeys, parentKeys, checkedStatus, originItem = null, disabled = false } = item
      if (!this.showCheckbox) return
      if (disabled) return

      // 当前
      item.checkedStatus = checkedStatus === isCheckedStatus ? unCheckedStatus : isCheckedStatus

      // 子类
      if (!this.checkStrictly) {
        childrenKeys.forEach(k => {
          const childrenItem = this.datamap[k]
          childrenItem.checkedStatus = item.checkedStatus
        })
      }

      // 父类
      if (!this.checkStrictly) {
        parentKeys.forEach(k => {
          const parentItem = this.datamap[k]
          parentItem.checkedStatus = this.getParentCheckedStatus(parentItem)
        })
      }

      const hasCheckedKeys = []
      for (let i = 0; i < this.datalist.length; i++) {
        const k = this.datalist[i]
        if (k.checkedStatus === isCheckedStatus) {
          hasCheckedKeys.push(k.key)
        }
      }

      if (hasCheckedKeys?.length) this.checkedKeys = [...hasCheckedKeys]

      this.$emit('change', hasCheckedKeys, originItem)
    },

    /**
     * 点击单选
     * @param item
     */
    handleRadioChange(item) {
      const { parentKeys, checkedStatus, key, originItem = null, disabled = false } = item

      if (this.showCheckbox) return
      if (disabled) return

      // 重置所有选择
      if (this.datalist?.length) {
        for (let i = 0; i < this.datalist.length; i++) {
          const k = this.datalist[i]
          k.checkedStatus = unCheckedStatus
        }
      }

      parentKeys.forEach(k => {
        const parentItem = this.datamap[k]
        parentItem.checkedStatus = this.getParentCheckedStatus(parentItem)
      })

      // 当前
      item.checkedStatus = checkedStatus === isCheckedStatus ? unCheckedStatus : isCheckedStatus

      this.checkedKeys = key
      this.$emit('change', key, originItem)
    },

    checkTheChecked(item, checked = true) {
      const { childrenKeys, parentKeys, disabled = false } = item
      if (disabled) return
      // 当前
      item.checkedStatus = checked ? isCheckedStatus : unCheckedStatus

      if (!this.checkStrictly) {
        // 子类
        childrenKeys.forEach(k => {
          const childrenItem = this.datamap[k]
          childrenItem.checkedStatus = childrenItem.disabled ? childrenItem.checkedStatus : item.checkedStatus
        })

        // 父类
        parentKeys.forEach(k => {
          const parentItem = this.datamap[k]
          parentItem.checkedStatus = this.getParentCheckedStatus(parentItem)
        })
      }
    },

    checkTheRadio(item) {
      const { parentKeys, isLeaf, disabled = false } = item
      if (disabled) return

      // 限制末节点选中，但当前非末节点
      if (this.onlyRadioLeaf && !isLeaf) {
        console.error(`DaTree: 限制了末节点选中，当前[${item.label}]非末节点`)
        return
      }

      if (this.datalist?.length) {
        for (let i = 0; i < this.datalist.length; i++) {
          const k = this.datalist[i]
          k.checkedStatus = unCheckedStatus
        }
      }

      parentKeys.forEach(k => {
        const parentItem = this.datamap[k]
        parentItem.checkedStatus = this.getParentCheckedStatus(parentItem)
      })

      // 当前
      item.checkedStatus = isCheckedStatus
    },

    /**
     * 点击展开收起
     * @param item
     */
    async handleExpandedChange(item) {
      const { expand, originItem = null, loading = false } = item
      if (this.loadLoading && loading) return

      this.checkExpandedChange(item)

      // 异步
      const currentItem = await this.loadExpandNode(item)
      item.expand = !expand

      this.$emit('expand', !expand, currentItem || originItem || null)
    },

    /**
     * 检查展开状态
     * @param item
     */
    checkExpandedChange(item) {
      const { expand, childrenKeys, children = null } = item

      if (expand) {
        if (childrenKeys?.length) {
          childrenKeys.forEach(k => {
            if (this.datamap[k]) {
              this.datamap[k].show = false
              this.datamap[k].expand = false
            }
          })
        }
      } else {
        if (children?.length) {
          const childrenKeys = children.map(k => k.key)
          childrenKeys.forEach(k => {
            if (this.datamap[k]) {
              this.datamap[k].show = true
            }
          })
        }
      }
    },

    /**
     * 加载异步数据
     * @param item
     */
    async loadExpandNode(item) {
      const { expand, key, indexs, children = null } = item

      let currentItem = null
      if (!expand && this.loadMode && (!children || children.length === 0)) {
        if (typeof this.loadApi === 'function') {
          this.expandedKeys.push(key)

          this.loadLoading = true
          item.loading = true

          const currentNode = deepClone(item)
          const apiRes = await this.loadApi(currentNode)
          const copyData = deepClone(this.dataRef)
          let currentTree = copyData
          for (let i = 0; i < indexs.length; i++) {
            const curIdx = indexs[i]
            if (i === 0) {
              currentTree = currentTree[curIdx] || []
            } else {
              currentTree = currentTree[this.field?.children || 'children'][curIdx] || []
            }
          }
          let newRes = null
          if (apiRes?.length) {
            newRes = apiRes
          }
          currentTree[this.field?.children || 'children'] = newRes
          this.dataRef = copyData

          let hasCheckedKeys
          if (this.showCheckbox) {
            hasCheckedKeys = []
            for (let i = 0; i < this.datalist.length; i++) {
              const k = this.datalist[i]
              if (k.checkedStatus === isCheckedStatus) {
                hasCheckedKeys.push(k.key)
              }
            }
          } else {
            for (let i = 0; i < this.datalist.length; i++) {
              const k = this.datalist[i]
              if (k.checkedStatus === isCheckedStatus) {
                hasCheckedKeys = k.key
                break
              }
            }
          }

          currentItem = currentTree
          this.loadLoading = false
          item.loading = false
          this.initData()
        }
      }

      return currentItem
    },

    /**
     * 获取父类的选中状态
     * @param item
     */
    getParentCheckedStatus(item) {
      if (!item) {
        return unCheckedStatus
      }

      if (item.disabled) {
        return item.checkedStatus || unCheckedStatus
      }

      // 单选时，父类永远为半选
      if (!this.showCheckbox) {
        return halfCheckedStatus
      }

      const { children } = item
      // 子类全选中
      const childrenCheckedAll = children.every(k => k.checkedStatus === isCheckedStatus)
      if (childrenCheckedAll) {
        return isCheckedStatus
      }

      // 子类全不选中
      const childrenUncheckedAll = children.every(k => k.checkedStatus === unCheckedStatus)
      if (childrenUncheckedAll) {
        return unCheckedStatus
      }

      return halfCheckedStatus
    },
    /**
     * 返回已选的 key
     */
    getCheckedKeys() {
      return getAllNodeKeys(this.datalist, 'checkedStatus', isCheckedStatus)
    },
    /**
     * 根据key设置已选
     * @param keys 多选时为key的数组，单选时为key
     * @param checked 多选时为key的数组，单选时为key
     */
    setCheckedKeys(keys, checked = true) {
      if (!Array.isArray(keys) && this.showCheckbox) {
        console.error('DaTree: setCheckedKeys 第一个参数非数组，传入的是:', keys)
        return
      }
      const list = this.datalist
      if (checked === false) {
        let newCheckedKeys
        if (this.showCheckbox) {
          newCheckedKeys = []
          for (let i = 0; i < this.checkedKeys.length; i++) {
            const ck = this.checkedKeys[i]
            if (!keys.includes(ck)) {
              newCheckedKeys.push(ck)
            }
          }
          newCheckedKeys = [...new Set(newCheckedKeys)]
        } else {
          // 单选时，必须至少勾选一个，所以单选不支持取消选中。
          newCheckedKeys = null
        }
        this.checkedKeys = newCheckedKeys
        this.handleCheckState(list, keys, false)
      } else {
        this.handleCheckState(list, keys, true)

        if (this.showCheckbox) {
          this.checkedKeys = [...new Set([...(this.checkedKeys || []), ...(keys || [])])]
          this.handleExpandState(list, keys, true)
        } else {
          // 单选时如果为数组则拿第一个
          if (Array.isArray(keys)) {
            keys = keys[0]
          }
          this.checkedKeys = keys || this.defaultCheckedKeys || this.checkedKeys || null
          this.handleExpandState(list, [keys], true)
        }
      }
    },
    /**
     * 返回半选的 key
     */
    getHalfCheckedKeys() {
      return getAllNodeKeys(this.datalist, 'checkedStatus', halfCheckedStatus)
    },
    /**
     * 返回已展开的 key
     */
    getExpandedKeys() {
      return getAllNodeKeys(this.datalist, 'expand', true)
    },
    /**
     * 根据key展开/收起
     * @param keys key的数组
     * @param expand true为展开/false为收起
     */
    setExpandedKeys(keys, expand = true) {
      if (!Array.isArray(keys)) {
        console.error('DaTree: setExpandedKeys 第一个参数非数组，传入的是:', keys)
        return
      }
      const list = this.datalist
      if (expand === false) {
        const newExpandedKeys = []
        for (let i = 0; i < this.expandedKeys.length; i++) {
          const ek = this.expandedKeys[i]
          if (!keys.includes(ek)) {
            newExpandedKeys.push(ek)
          }
        }
        this.expandedKeys = [...new Set(newExpandedKeys)]
        this.handleExpandState(list, keys, false)
      } else {
        this.expandedKeys = [...new Set([...(this.expandedKeys || []), ...(keys || [])])]
        this.handleExpandState(list, keys, true)
      }
    },
    /**
     * 返回已选的节点
     */
    getCheckedNodes() {
      return getAllNodes(this.datalist, 'checkedStatus', isCheckedStatus)
    },
    /**
     * 返回半选的节点
     */
    getHalfCheckedNodes() {
      return getAllNodes(this.datalist, 'checkedStatus', halfCheckedStatus)
    },
    /**
     * 返回已展开的节点
     */
    getExpandedNodes() {
      return getAllNodes(this.datalist, 'expand', true)
    },
  },
}
</script>

<style lang="scss" scoped>
.da-tree {
  width: 100%;
  height: 100%;

  &-scroll {
    width: 100%;
    height: 100%;
  }

  &-item {
    display: flex;
    align-items: center;
    height: 0;
    padding: 0;
    overflow: hidden;
    font-size: 28rpx;
    line-height: 1;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s linear;

    &.is-show {
      height: auto;
      padding: 12rpx 24rpx;
      visibility: visible;
      opacity: 1;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40rpx;
      height: 40rpx;
      overflow: hidden;

      &--arr {
        width: 20rpx;
        height: 20rpx;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;

        &.is-right {
          transform: rotate(-90deg);
        }

        &.is-loading {
          animation: IconLoading 1s linear 0s infinite;
        }
      }
    }

    &__checkbox {
      width: 40rpx;
      height: 40rpx;
      overflow: hidden;

      &--left {
        order: 0;
      }

      &--right {
        order: 1;
      }

      &--icon {
        width: 40rpx;
        height: 40rpx;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;
      }

      &.is--disabled {
        cursor: not-allowed;
        opacity: 0.35;
      }
    }

    &__label {
      flex: 1;
      margin-left: 4rpx;
      color: #555;

      &--2 {
        color: #007aff;
      }
    }
  }
}

@keyframes IconLoading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// 灰色加载
.da-tree-loading {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTE0NC4yMDUgMjAyLjQ5NmExMzYuNjc4IDEzNi42NzggMCAxMDI3My4zNTcgMCAxMzYuNjc4IDEzNi42NzggMCAxMC0yNzMuMzU3IDB6TTQxLjcyOCA0OTIuOTAyYTExOS41NzggMTE5LjU3OCAwIDEwMjM5LjE1NSAwIDExOS41NzggMTE5LjU3OCAwIDEwLTIzOS4xNTUgMHpNMTQ0LjIzIDc0OS4xNThhMTAyLjUwMiAxMDIuNTAyIDAgMTAyMDUuMDA1IDAgMTAyLjUwMiAxMDIuNTAyIDAgMTAtMjA1LjAwNSAwek00MzUuMiA4NjEuOTI2YTg5LjYgODkuNiAwIDEwMTc5LjIgMCA4OS42IDg5LjYgMCAxMC0xNzkuMiAwem0yODkuODQzLTk1LjY2NmE4NS40MjcgODUuNDI3IDAgMTAxNzAuODU1IDAgODUuNDI3IDg1LjQyNyAwIDEwLTE3MC44NTUgMHptMTM2LjcwNC0yOTAuNDMzYTY4LjMyNiA2OC4zMjYgMCAxMDEzNi42NTMgMCA2OC4zMjYgNjguMzI2IDAgMTAtMTM2LjY1MyAwek03NTkuMjIgMjE5LjU3MWE1MS4yNTEgNTEuMjUxIDAgMTAxMDIuNTAyIDAgNTEuMjUxIDUxLjI1MSAwIDEwLTEwMi41MDMgMHpNNTEyIDg1LjM3NmEzNC4xNzYgMzQuMTc2IDAgMTA2OC4zNTIgMCAzNC4xNzYgMzQuMTc2IDAgMTAtNjguMzUyIDB6Ii8+PC9zdmc+');
  opacity: 0.7;
}

// 灰色三角
.da-tree-arrow-down {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDE3MDcgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjEzLjM3NSIgaGVpZ2h0PSIxMjgiPjxwYXRoIGQ9Ik0xMjIuODcgMi4yMjRMODUxLjk4NyAwbDczMi45MzMgNi40NzJjNDQuNTUzIDAgODMuNzE4IDIuNDExIDk2LjczMSAxMi4zNzUgMzEuNDIgMjQuMDU0IDI3Ljk4NiA3My4xODQgMCAxMDEuMDQ2TDkwNS44NzQgOTY5LjM1N2MtMTQuNzg3IDE0Ljg1LTM0LjUyNCAyMS4yLTUzLjk0NiAyMC4yNDYtMTkuNDI2Ljk1Ni0zOS4xMDEtNS4zOTUtNTMuOTUyLTIwLjI0NkwyMi4yIDExOS44OTVjLTI3LjkyMi0yNy44NjItMzAuOTctNzYuNTQzIDAtMTAwLjk4QzM2LjYwOCA3LjU1MiA2MS42ODQgMi4yMjQgMTIyLjg3IDIuMjI0eiIgZmlsbD0iIzhhOGE4YSIvPjwvc3ZnPg==');
}

// 多选-灰色选择边框
.da-tree-checkbox-outline {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTgwOS45ODQgMTI4cTM0LjAwNSAwIDU5Ljk5IDI1Ljk4NHQyNS45ODMgNTkuOTl2NTk2LjAxcTAgMzQuMDA1LTI1Ljk4NCA1OS45OXQtNTkuOTg5IDI1Ljk4M2gtNTk2LjAxcS0zNC4wMDYgMC01OS45OS0yNS45ODRUMTI4IDgwOS45ODR2LTU5Ni4wMXEwLTM0LjAwNiAyNS45ODQtNTkuOTlUMjEzLjk3NCAxMjhoNTk2LjAxem0wIDg2LjAxNmgtNTk2LjAxdjU5Ni4wMWg1OTYuMDF2LTU5Ni4wMXoiIGZpbGw9IiM4YThhOGEiLz48L3N2Zz4=');

  // 颜色太深了，减淡一点
  opacity: 0.4;
}

// 多选-蓝色选中
.da-tree-checkbox-checked {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTQyNS45ODQgNzI2LjAxNmwzODQtMzg0LTU5Ljk5LTYxLjk5NS0zMjQuMDEgMzI0LjAxMS0xNTIuMDIxLTE1Mi4wMjFMMjEzLjk3MyA1MTJ6bTM4NC01OTguMDE2cTM2LjAxIDAgNjEuMDEzIDI1Ljk4NFQ4OTYgMjEzLjk3NHY1OTYuMDFxMCAzNC4wMDUtMjUuMDAzIDU5Ljk5dC02MS4wMTMgMjUuOTgzaC01OTYuMDFxLTM2LjAxMSAwLTYxLjAxNC0yNS45ODR0LTI1LjAwMy01OS45ODl2LTU5Ni4wMXEwLTM0LjAwNiAyNS4wMDMtNTkuOTlUMjEzLjk3MyAxMjhoNTk2LjAxMXoiIGZpbGw9IiMwMDdhZmYiLz48L3N2Zz4=');
}

// 多选-蓝色半选中
.da-tree-checkbox-indeterminate {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTcyNi4wMTYgNTUzLjk4NHYtODQuMDFoLTQyNy45OXY4NC4wMWg0MjcuOTl6TTgwOS45ODQgMTI4cTM0LjAwNSAwIDU5Ljk5IDI1Ljk4NHQyNS45ODMgNTkuOTl2NTk2LjAxcTAgMzQuMDA1LTI1Ljk4NCA1OS45OXQtNTkuOTg5IDI1Ljk4M2gtNTk2LjAxcS0zNC4wMDYgMC01OS45OS0yNS45ODRUMTI4IDgwOS45ODR2LTU5Ni4wMXEwLTM0LjAwNiAyNS45ODQtNTkuOTlUMjEzLjk3NCAxMjhoNTk2LjAxeiIgZmlsbD0iIzAwN2FmZiIvPjwvc3ZnPg==');
}

// 单选-灰色选择边框
.da-tree-radio-outline {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTUxMiA4NTQuMDE2cTEzOS45OSAwIDI0MC45ODEtMTAwLjk5MnQxMDAuOTkyLTI0MC45ODFUNzUyLjk4MSAyNzEuMDYgNTEyIDE3MC4wNyAyNzEuMDE5IDI3MS4wNjEgMTcwLjAyNyA1MTIuMDQzdDEwMC45OTIgMjQwLjk4MVQ1MTIgODU0LjAxNnptMC03NjhxMTc2IDAgMzAxLjAxMyAxMjUuMDEzdDEyNS4wMTQgMzAxLjAxNC0xMjUuMDE0IDMwMS4wMTNUNTEyIDkzOC4wNjkgMjEwLjk4NyA4MTMuMDU2IDg1Ljk3MyA1MTIuMDQzdDEyNS4wMTQtMzAxLjAxNFQ1MTIgODYuMDE2eiIgZmlsbD0iIzhhOGE4YSIvPjwvc3ZnPg==');

  // 颜色太深了，减淡一点
  opacity: 0.4;
}

// 单选-蓝色选中
.da-tree-radio-checked {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTUxMiA4NTQuMDE2cTEzOS45OSAwIDI0MC45ODEtMTAwLjk5MnQxMDAuOTkyLTI0MC45ODFUNzUyLjk4MSAyNzEuMDYgNTEyIDE3MC4wNyAyNzEuMDE5IDI3MS4wNjEgMTcwLjAyNyA1MTIuMDQzdDEwMC45OTIgMjQwLjk4MVQ1MTIgODU0LjAxNnptMC03NjhxMTc2IDAgMzAxLjAxMyAxMjUuMDEzdDEyNS4wMTQgMzAxLjAxNC0xMjUuMDE0IDMwMS4wMTNUNTEyIDkzOC4wNjkgMjEwLjk4NyA4MTMuMDU2IDg1Ljk3MyA1MTIuMDQzdDEyNS4wMTQtMzAxLjAxNFQ1MTIgODYuMDE2em0wIDIxMS45NjhxODguMDIxIDAgMTUwLjk5NyA2My4wMTlUNzI2LjAxNiA1MTJ0LTYzLjAxOSAxNTAuOTk3VDUxMiA3MjYuMDE2dC0xNTAuOTk3LTYzLjAxOVQyOTcuOTg0IDUxMnQ2My4wMTktMTUwLjk5N1Q1MTIgMjk3Ljk4NHoiIGZpbGw9IiMwMDdhZmYiLz48L3N2Zz4=');
}

// 单选-蓝色半选中
.da-tree-radio-indeterminate {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTY0MCA1MTJxMCA1Mi4wMS0zOC4wMTYgODkuOTg0VDUxMiA2NDB0LTg5Ljk4NC0zOC4wMTZUMzg0IDUxMnQzOC4wMTYtODkuOTg0VDUxMiAzODR0ODkuOTg0IDM4LjAxNlQ2NDAgNTEyek01MTIgODU0LjAxNnExMzkuOTkgMCAyNDAuOTgxLTEwMC45OTJ0MTAwLjk5Mi0yNDAuOTgxVDc1Mi45ODEgMjcxLjA2IDUxMiAxNzAuMDcgMjcxLjAxOSAyNzEuMDYxIDE3MC4wMjcgNTEyLjA0M3QxMDAuOTkyIDI0MC45ODFUNTEyIDg1NC4wMTZ6bTAtNzY4cTE3NiAwIDMwMS4wMTMgMTI1LjAxM3QxMjUuMDE0IDMwMS4wMTQtMTI1LjAxNCAzMDEuMDEzVDUxMiA5MzguMDY5IDIxMC45ODcgODEzLjA1NiA4NS45NzMgNTEyLjA0M3QxMjUuMDE0LTMwMS4wMTRUNTEyIDg2LjAxNnoiIGZpbGw9IiMwMDdhZmYiLz48L3N2Zz4=');
}
</style>
