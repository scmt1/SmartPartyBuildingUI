<template>
    <div class="container1">
        <div class="header" style="height: 33px;display: flex;justify-content: space-between">
            <div style="display: flex;">
                <div class="square"></div>
                <div class="header-font">组织详情</div>
            </div>
            <div>
                <el-button size="small" icon="el-icon-back" type="danger" style="margin-left:20px"
                           @click="returnLast">返回
                </el-button>
            </div>
        </div>
        <div class="main">
            <div class="main-left">
                <div class="box-card" ref="mainLeftBox1" v-resize="gaoDeMapBoxResize">
                    <div class="box-card-top" style="display: flex;">
                        <div style="width: 50%; display: inline-block;">
                            <img :src="deptPic && deptPic !=null && deptPic != ''? base + deptPic:indexImg" style="width: 100%;">
                        </div>
                        <div class="header-font">
                            <div style="font-weight: 700;">
                                {{ dataForm.name }}
                            </div>
                            <div class="box-row">
                                <div class="text-label">
                                    本届起始时间：
                                </div>
                                <div class="text-item">
                                    {{ form.thisFinishTime }}
                                </div>
                            </div>
                            <div class="box-row">
                                <div class="text-label">
                                    本届届满时间：
                                </div>
                                <div class="text-item">
                                    {{ form.thisChangeTime }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 15px">
                        <div class="point"></div>
                        <div class="detail">基本信息</div>
                    </div>
                    <div class="box-card-down">
                        <div class="row-border">
                            <div class="row" style="padding-top: 15px;">
                                <div class="row-item" style="width: 60%;">
                                    <div class="row-label" style="width: 180px;">党组织联系人：</div>
                                    <div class="row-text">{{ dataForm.partyOrgContact }}</div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">党组织书记：</div>
                                    <div class="row-text">{{ dataForm.partyOrgManager }}</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="row-item" style="width: 60%;">
                                    <div class="row-label" style="width: 180px;">党组织所在单位代码：</div>
                                    <div class="row-text">{{ dataForm.unitCode }}</div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">电话号码：</div>
                                    <div class="row-text">{{ dataForm.phone }}</div>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom: 15px;display: block;">
                                <div class="row-item" style="width: 100%;">
                                    <div class="row-label" style="width: 180px;">单位名称：</div>
                                    <div class="row-text">
                                        <el-tooltip class="item" effect="dark" :content="dataForm.unitName" placement="top-start">
                                            <span>{{ dataForm.unitName }}</span>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-card2" ref="mainLeftBox2" v-resize="gaoDeMapBoxResize">
                    <div style="display: flex;">
                        <div class="point"></div>
                        <div class="detail">详细信息</div>
                    </div>
                    <div class="box-card-down">
                        <div class="row-border">
                            <div class="row" style="padding-top: 15px;">
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">组织类别：</div>
                                    <div class="row-text" style="width: 220px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                        <el-tooltip class="item" effect="dark" :content="convertFiled(dataForm.type, 'type') ? convertFiled(dataForm.type, 'type') : '&#45;&#45;'" placement="top-start">
                                            <span>{{
                                                    convertFiled(dataForm.type, 'type') ? convertFiled(dataForm.type, 'type') : '&#45;&#45;'
                                                }}</span>
                                        </el-tooltip>
                                    </div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 180px;">党组织所在单位情况：</div>
                                    <div class="row-text">{{
                                            convertFiled(dataForm.partyOrgSituation, 'partyOrgSituation') ?
                                                convertFiled(dataForm.partyOrgSituation, 'partyOrgSituation') : '&#45;&#45;'
                                        }}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">单位类别：</div>
                                    <div class="row-text">{{
                                            convertFiled(dataForm.partyOrgType, 'partyOrgType') ? convertFiled(dataForm.partyOrgType,
                                                'partyOrgType') : '&#45;&#45;'
                                        }}
                                    </div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 180px;">单位建立党组织情况：</div>
                                    <div class="row-text">{{
                                            convertFiled(dataForm.unitOrgSituation, 'unitOrgSituation') ?
                                                convertFiled(dataForm.unitOrgSituation, 'unitOrgSituation') : '&#45;&#45;'
                                        }}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">党组织所处区域：</div>
                                    <div class="row-text">{{ dataForm.deptRegion }}</div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 180px;">机构级别：</div>
                                    <div class="row-text">{{
                                            convertFiled(dataForm.deptType, 'deptType') ? convertFiled(dataForm.deptType, 'deptType')
                                                : '&#45;&#45;'
                                        }}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">商户号：</div>
                                    <div class="row-text">
                                        {{
                                            dataForm.shopCode && dataForm.shopCode.length > 0 ? dataForm.shopCode : '暂无'
                                        }}
                                    </div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 180px;">是否退休支部：</div>
                                    <div class="row-text">{{ dataForm.veteran == 0 ? '否' : '是' }}</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">组建方式：</div>
                                    <div class="row-text">{{
                                            convertFiled(dataForm.partyOrgCreateType, 'partyOrgCreateType') ?
                                                convertFiled(dataForm.partyOrgCreateType, 'partyOrgCreateType') : '&#45;&#45;'
                                        }}
                                    </div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 180px;">批准建立日期：</div>
                                    <div class="row-text" style="width: 50%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                        <el-tooltip class="item" effect="dark" :content="dataForm.createDate" placement="top-start">
                                            <span>{{ dataForm.createDate }}</span>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom:15px">
                                <div class="row-item">
                                    <div class="row-label" style="width: 150px;">组织类型：</div>
                                    <div class="row-text">{{
                                            convertFiled(dataForm.organizationType, 'organizationType') ?
                                                convertFiled(dataForm.organizationType, 'organizationType') : '&#45;&#45;'
                                        }}
                                    </div>
                                </div>
                                <div class="interval"></div>
                                <div class="row-item">
                                    <div class="row-label" style="width: 180px;">组织标签：</div>
                                    <div class="row-text">{{ dataForm.deptLabel }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="main-right">
                <el-card class="box-card1">
                    <div class="box-card-top" ref="boxCard" v-resize="gaoDeMapBoxResize">
                        <div class="box-card-top-item">
                            <div><img :src="orgTotal" class="box-img"></div>
                            <div class="box-card-one">
                                <div class="box-card-right-text">党员总数</div>
                                <div class="box-card-right-number">{{ partyTotal }}</div>
                            </div>
                        </div>
                        <div class="box-card-top-item">
                            <div><img :src="orgChild" class="box-img"></div>
                            <div class="box-card-one">
                                <div class="box-card-right-text">下级党组织数</div>
                                <div class="box-card-right-number">{{ nextNum }}</div>
                            </div>
                        </div>
                        <div class="box-card-top-item">
                            <div><img :src="orgBase" class="box-img"></div>
                            <div class="box-card-one">
                                <div class="box-card-right-text">基层党组织总数</div>
                                <div class="box-card-right-number">{{ totalBase }}</div>
                            </div>
                        </div>
                        <div class="box-card-top-item">
                            <div><img :src="shortTime1" class="box-img"></div>
                            <div class="box-card-one">
                                <div class="box-card-right-text">临时党支部数</div>
                                <div class="box-card-right-number">{{ timedangzhi }}</div>
                            </div>
                        </div>
                        <div class="box-card-top-item">
                            <div><img :src="shortTime2" class="box-img"></div>
                            <div class="box-card-one">
                                <div class="box-card-right-text">临时联合党支部数</div>
                                <div class="box-card-right-number">{{ timeunitdangzhi }}</div>
                            </div>
                        </div>
                    </div>
                </el-card>
                <div ref="gaoDeMapBox"
                     style="margin-top: 10px; flex: 1; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); padding: 20px;">
                    <div id="gao-de-map" :style="'width: 100%; height: ' + gaoDeMapHeight"></div>
                </div>
            </div>
        </div>

    </div>

</template>


<script>
import AMapLoader from '@amap/amap-jsapi-loader';

import {getDictByType, getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import defaultImg from "@/assets/defaultImg.png"
import orgTotal from "@/assets/organization/orgTotal.png"
import orgChild from "@/assets/organization/orgChild.png"
import orgBase from "@/assets/organization/orgBase.png"
import shortTime1 from "@/assets/organization/shortTime1.png"
import shortTime2 from "@/assets/organization/shortTime2.png"
import indexImg from "@/assets/defaultImg.png"
import {getBaseInfoById, getTzSysDept, getDeptIntroduceById} from "@/api/jcxfSysDept";
import {treeDataTranslate} from '@/utils/index'
import {queryPartyMemberList} from "@/api/jcxfPartyMember";
import util from '@/libs/util'

export default {
    name: "detail",
    data() {
        return {
            gaoDeMapHeight: '450px',
            key: util.key,
            infoWindow: '',
            circle: null,
            map: null,
            center: {
                lat: 28.8776683, lng: 105.44852407
            },
            zoom: 13,
            defaultImg: defaultImg,
            orgTotal: orgTotal,
            orgChild: orgChild,
            orgBase: orgBase,
            shortTime1: shortTime1,
            shortTime2: shortTime2,
            indexImg: indexImg,
            organizationTypeList: [],
            demonstrativePartyOrgList: [
                {label: '无', value: 0},
                {label: '中央先进党组织', value: 1},
                {label: '省级先进党组织', value: 2},
                {label: '市级先进党组织', value: 3},
                {label: '县级先进党组织', value: 4}
            ],
            partyOrgCreateTypeList: [],
            typeNameList: [],
            partyOrgSituationList: [],
            partyOrgTypeList: [],
            unitOrgSituationList: [],
            deptTypeList: [],
            dangweiNum: 0,
            dangzongNum: 0,
            dangzhiNum: 0,
            unitdangzhi: 0,
            timedangzhi: 0,
            timeunitdangzhi: 0,
            totalBase: 0,
            nextNum: 0,
            partyTotal: 0,
            dataForm: {
                id: ''
            },
            form: {
                thisFinishTime: '',
                thisChangeTime: ''
            },
            deptPic: '',
            base: util.jcxfUrl
        }
    },
    directives: {
        resize: { // 指令的名称
            bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
                let width = '', height = ''

                function isReize() {
                    const style = document.defaultView.getComputedStyle(el)
                    if (width !== style.width || height !== style.height) {
                        binding.value({width: style.width, height: style.height})  // 关键(这传入的是函数,所以执行此函数)
                    }
                    width = style.width;
                    height = style.height;
                }

                el.__vueSetInterval__ = setInterval(isReize, 300)
            },
            unbind(el) {
                clearInterval(el.__vueSetInterval__)
            }
        }
    },
    mounted() {
        this.id = this.$route.query.id
        this.type = this.$route.query.type
        this.init()
        /*this.$nextTick(() =>{
            let _this = this
            window.addEventListener('resize', function () {
                _this.gaoDeMapBoxResize()
            })
        })*/

    },
    methods: {
        gaoDeMapBoxResize() {
            if (this.$refs.mainLeftBox1 && this.$refs.mainLeftBox2 && this.$refs.boxCard) {
                let height = this.$refs.mainLeftBox1.offsetHeight + this.$refs.mainLeftBox2.offsetHeight - this.$refs.boxCard.offsetHeight
                this.gaoDeMapHeight = Number(height - 74) + 'px'
            }
        },
        returnLast() {
            this.$router.push({
                path: '/dwgl/organization/organization',
                query: {deptId: this.id}
            })
        },
        initMap() {
            var that = this
            AMapLoader.load({
                key: this.key,             // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: [
                    'AMap.Scale',
                    "AMap.Circle", //圆形
                    "AMap.Marker", //标记点
                    'AMap.ToolBar',
                    'AMap.InfoWindow',
                    'AMap.ControlBar'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap) => {
                this.map = new AMap.Map("gao-de-map", {  //设置地图容器id
                    viewMode: "3D",    //是否为3D地图模式
                    zoom: this.zoom,
                    //初始化地图级别
                    center: [that.dataForm.longitude || 105.44852407, that.dataForm.latitude || 28.8776683], //初始化地图中心点位置（北京）
                });

                this.map.addControl(new AMap.Scale()) // 添加左下角的比例尺
                let toolBar = new AMap.ToolBar({
                    position: {
                        bottom: '20px',
                        right: '35px'
                    }
                })
                let controlBar = new AMap.ControlBar({
                    position: {
                        bottom: '100px',
                        right: '10px'
                    }
                })
                this.circle = new AMap.Circle({
                    center: [that.dataForm.longitude, that.dataForm.latitude], // 圆心位置
                    radius: 0, // 圆半径 米
                    fillColor: 'rgba(103,182,255,.5)', //圆形填充颜色
                    strokeColor: '#5898ff', //描边颜色
                    strokeWeight: 2, // 描边宽度
                });
                //地图添加圆形
                this.map.add(this.circle);
                //getCenter 获取圆形中心点
                var MakCenter = this.circle.getCenter()
                let makerList = []
                //信息窗口实例
                this.infoWindow = new AMap.InfoWindow({
                    anchor: "bottom-left",
                    offset: new AMap.Pixel(0, -30),
                    // content: document.getElementById('myInfoWindow')
                });
                //圆形中心点添加标记点
                this.marker = new AMap.Marker({
                    map: this.map, //要显示该marker的地图对象
                    position: MakCenter, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    topWhenClick: true, //鼠标点击时marker是否置顶，默认false
                });

                this.marker.content = this.dataForm.name
                this.marker.on("click", this.markerClick)
                this.marker.emit('click', {target: this.marker});// 此处是设置默认出现信息窗体
                makerList.push(this.marker)


                this.map.add(this.marker); //添加  点标记
                this.map.addControl(toolBar) // 添加右下角的放大缩小
                this.map.addControl(controlBar) // 方向盘
            }).catch(e => {

            })

            this.$nextTick(() => {
                this.gaoDeMapBoxResize()
            })
        },
        // 控制标记的信息窗体的显示
        markerClick(e) {
            // 标注的点击事件
            this.infoWindow.setContent(e.target.content);
            this.infoWindow.open(this.map, e.target.getPosition());
        },
        //获取右边党组织相关信息
        getBaseInfo() {
            // this.getDataById()
            getBaseInfoById(this.dataForm.id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.partyTotal = data.data.partyNum
                    this.nextNum = data.data.downTotal
                    this.totalBase = data.data.baseTotal
                    this.timedangzhi = data.data.lsdzb
                    this.timeunitdangzhi = data.data.lsdlhzb
                }
            })
        },
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'partyOrgType') {
                this.partyOrgTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'organizationType') {
                this.organizationTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'partyOrgSituation') {
                this.partyOrgSituationList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'unitOrgSituation') {
                this.unitOrgSituationList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'partyOrgCreateType') {
                this.partyOrgCreateTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'type') {
                this.typeNameList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'deptType') {
                this.deptTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'demonstrativePartyOrg') {
                this.demonstrativePartyOrgList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        getDict(ret, type) {
            let tmp = []
            getDictByCode(type).then(res => {
                let result = res.data.data

                if (ret === 1) {
                    this.typeNameList = result
                } else if (ret === 2) {
                    this.partyOrgSituationList = result
                } else if (ret === 3) {
                    this.partyOrgTypeList = result
                } else if (ret === 4) {
                    this.unitOrgSituationList = result
                } else if (ret === 5) {
                    this.deptTypeList = result
                } else if (ret === 6) {
                    this.partyOrgCreateTypeList = result
                } else if (ret === 7) {
                    this.organizationTypeList = result
                } else if (ret === 8) {
                    this.demonstrativePartyOrgList = result
                }
            })
            return tmp
        },
        getBase() {
            getDeptIntroduceById(this.dataForm.id).then(res => {
                if (res.data.code == '00000') {
                    const data = res.data.data
                    this.form.thisFinishTime = data.thisFinishTime
                    this.form.thisChangeTime = data.thisChangeTime
                    if (this.form.thisFinishTime != null) {
                        this.form.thisFinishTime = this.dealWithTime(this.form.thisFinishTime)
                    } else {
                        this.form.thisFinishTime = '暂无'
                    }
                    if (this.form.thisChangeTime != null) {
                        this.form.thisChangeTime = this.dealWithTime(this.form.thisChangeTime)
                    } else {
                        this.form.thisChangeTime = '暂无'
                    }
                    this.deptPic = data.deptInfo.deptPhoto
                }
            })
        },
        dealWithTime(time) {
            let newTime = new Date(time)
            let month = newTime.getMonth() + 1
            month = month < 10 ? '0' + month : month

            let date = newTime.getDate()
            date = date < 10 ? '0' + date : date

            return newTime.getFullYear() + '-' + month + '-' + date
        },
        init() {
            this.dataForm.id = this.id || null
            this.getDict(1, 'partyType')
            this.getDict(2, 'partyOrgSituation')
            this.getDict(3, 'partyOrgType')
            this.getDict(4, 'unitOrgSituation')
            this.getDict(5, 'deptType')
            this.getDict(6, 'partyOrgCreateType')
            this.getDict(7, 'organizationType')
            this.getBaseInfo()
            this.getBase();
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    getTzSysDept(this.dataForm.id).then(res => {
                        const data = res.data.data
                        this.dataForm = data
                        this.initMap()
                    })
                }
            })

        }
    }
}
</script>

<style lang="scss" scoped>
.interval {
    width: 10px;
}

.point {
    /*position: absolute;*/
    margin: auto 0;
    width: 8px;
    height: 8px;
    //border-radius: 100%;
    background: #ff0000;
    /*box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);*/
}

.detail {
    margin-left: 10px;
    font-size: 18px;
    //font-weight: bold;
    color: #bc4b54;
    font-weight: 700;
}

.box-card-right-text {
    margin-top: 10px;
    font-size: 16px;
    color: #333333;
    font-weight: normal;
    max-width: 150px;
    text-align: center;
}

.box-card-right-number {
    margin-top: 5px;
    font-size: 20px;
    color: transparent;
    background: linear-gradient(180deg, rgba(240, 54, 57, 1) 0%, rgba(219, 87, 75, 1) 100%);
    -webkit-background-clip: text;
    font-weight: bold;
    text-align: center;
}

.text-item {
    font-weight: normal;
}

.text-label {
    font-size: 18px;
    font-weight: 400;
    color: #858585;
}

.header-font {
    margin-left: 15px;
    font-size: 22px;
}

.container1 {
    padding: 15px 30px;
    background: white;
    font-family: 微软雅黑;

    .header {
        height: 100%;
        display: flex;
        box-shadow: 0px 0px 0px 0px #e3e4e5 !important;

        .square {
            margin: auto 0;
            width: 10px;
            height: 10px;
            background: #fd4233;
        }


    }

    .main {
        display: flex;
        margin-top: 15px;

        .main-left {
            width: 50%;
            min-width: 750px;
            .box-card {
                width: 100%;
                text-align: left;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                padding: 20px;

                .box-card-top {
                    .box-row {
                        display: flex;
                        padding: 10px 0px 0px 0px;
                        font-size: 18px;
                    }
                }

                .box-card-down {
                    padding: 3px;
                    margin-top: 5px;

                    .row-border {
                        box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.1);
                        padding: 0 20px 5px 20px;
                        /*box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);*/
                        .row {
                            display: flex;
                            padding: 5px 0px 5px 5px;

                            .row-item {
                                display: flex;
                                width: calc(50% - 5px);

                                .row-label {
                                    font-size: 18px;
                                    font-weight: 400;
                                    color: #858585;
                                    text-align: end;
                                }

                                .row-text {
                                    word-break: break-all;
                                    font-size: 18px;
                                    font-weight: 400;
                                }
                            }

                        }
                    }

                }

            }

            .box-card2 {
                width: 100%;
                margin-top: 15px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                padding: 20px;

                .box-card-down {
                    padding: 3px;
                    margin-top: 5px;
                    text-align: left;

                    .row-border {
                        box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.1);
                        /*box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);*/
                        padding: 5px 20px 5px 20px;

                        .row {
                            display: flex;
                            padding: 5px 0px 5px 5px;

                            .row-item {
                                display: flex;
                                width: calc(50% - 5px);

                                .row-label {
                                    font-size: 18px;
                                    font-weight: 400;
                                    color: #858585;
                                    text-align: end;
                                }

                                .row-text {
                                    margin-left: 5px;
                                    font-size: 18px;
                                    font-weight: 400;
                                }
                            }
                        }
                    }

                }

            }
        }

        .main-right {
            width: 45%;
            margin-left: 40px;
            display: flex;
            flex-direction: column;

            .box-card1 {
                width: 100%;

                .box-card-top {
                    display: flex;
                    //padding: 10px 0px 10px 60px;

                    .box-card-top-item {
                        width: 20%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        .box-card-one {
                            padding: 0 10px;

                        }

                        .box-img {
                            //display: inline-block;
                            // cursor: pointer;
                            height: 35px;
                            //width: 48px;
                            margin: auto 0;
                        }
                    }

                }

                /*.box-card-down {
                    display: flex;
                    padding: 10px 0px 10px 150px;

                    .box-card-down-item {
                        width: 50%;
                        display: flex;

                        .box-card-one {
                            margin-left: 10px;
                        }

                        .box-img {
                            display: inline-block;
                            cursor: pointer;
                            width: 30px;
                            height: 35px;
                            margin: auto 0;
                        }
                    }
                }*/

            }

            .main-left-map {
                margin-top: 10px;
            }

        }
    }
}
</style>
