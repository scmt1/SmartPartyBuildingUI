<template>
    <el-dialog :visible.sync="visible" width="80%" :title="title" append-to-body :close-on-click-modal="false" top="1vh">
        <div class="modal-content">
            <div class="body">
                <el-form :model="dataForm" ref="dataForm" :rules="shopDetailRule" :disabled="disabled">
                    <div class="row">
                        <div class="col-sm-6">
                            <el-form-item label="所属上级:" v-if="type==3 && parentId!=0" :label-width="labelWidth">
                                {{ parentName }}
                            </el-form-item>
                            <el-form-item :label="'党组织名称:'" prop="name" :label-width="labelWidth">
                                <el-input v-model="dataForm.name" size="small" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item :label="'党组织联系人:'" prop="partyOrgContact" :label-width="labelWidth"
                                          class="label">
                                <el-input v-model="dataForm.partyOrgContact" size="small" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item prop="type" :label="'组织类别'" :label-width="labelWidth">
                                <el-select v-model="dataForm.type" :placeholder="'组织类别:'" prop="type" size="small"
                                           class="input-row">
                                    <el-option v-for="(item,index) in typeNameList" :label=item.label
                                               :value="Number(item.itemValue)" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'党组织所在单位情况:'" prop="partyOrgSituation" :label-width="labelWidth"
                                          class="label">
                                <el-select v-model="dataForm.partyOrgSituation" :placeholder="'党组织所在单位情况:'"
                                           size="small" class="input-row">
                                    <el-option v-for="(item,index) in partyOrgSituationList" :label=item.label
                                               :value="Number(item.itemValue)" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'单位名称:'" prop="unitName" :label-width="labelWidth">
                                <el-input v-model="dataForm.unitName" size="small" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item :label="'单位类别:'" prop="partyOrgType" :label-width="labelWidth">
                                <el-select v-model="dataForm.partyOrgType" :placeholder="'单位类别:'" prop="partyOrgType"
                                           size="small" class="input-row">
                                    <el-option v-for="(item,index) in partyOrgTypeList" :label=item.label
                                               :value="Number(item.itemValue)" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'单位建立党组织情况:'" prop="unitOrgSituation" :label-width="labelWidth"
                                          class="label">
                                <el-select v-model="dataForm.unitOrgSituation" :placeholder="'单位建立党组织情况:'"
                                           prop="unitOrgSituation" size="small" class="input-row">
                                    <el-option v-for="(item,index) in unitOrgSituationList" :label=item.label
                                               :value="Number(item.itemValue)" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <!--                        <el-form-item :label="'是否基层党委:'" prop="basicPartyCommittee" :label-width="labelWidth" class="label">
                                                        <el-select v-model="dataForm.basicPartyCommittee" :placeholder="'请选择:'" size="small" class="input-row">
                                                            <el-option label="否" :value="'0'"></el-option>
                                                            <el-option label="是" :value="'1'"></el-option>
                                                        </el-select>
                                                    </el-form-item>-->
                            <el-form-item :label="'是否退休支部:'" prop="veteran" :label-width="labelWidth" class="label">
                                <el-select v-model="dataForm.veteran" :placeholder="'请选择:'" size="small"
                                           class="input-row">
                                    <el-option label="否" :value="'0'"></el-option>
                                    <el-option label="是" :value="'1'"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'党组织所在单位代码:'" prop="unitCode" :label-width="labelWidth" class="label">
                                <el-input v-model="dataForm.unitCode" size="small" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item :label="'组织名称-首字母拼音:'" prop="pyName" :label-width="labelWidth" class="label">
                                <el-input v-model="dataForm.pyName" size="small" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item :label="'党组织所处区域:'" prop="dizhi" :label-width="labelWidth" class="label">
                                <el-input v-model="dataForm.deptRegion" placeholder="工作单位区域" autocomplete="off"
                                          size="small"
                                          class="input-row" :disabled="true"></el-input>
                                <!--                            <v-region-selects v-model="areaId" @change="regionChange" :town="true"/>-->
                                <select-area ref="selectAreaRef" v-if="visible" @selected="regionSelected" :values="dataForm.deptRegionIds"></select-area>
                            </el-form-item>
                            <el-form-item label="组织图片:" :label-width="labelWidth" class="label">
                                <el-upload
                                        v-loading="uploading"
                                        class="avatar-uploader"
                                        :action="'#'"
                                        :show-file-list="false"
                                        accept='.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP'
                                        :before-upload="beforeImageUpload">
                                    <img v-if="dataForm.deptPhoto && dataForm.deptPhoto.length"
                                         :src="dataForm.deptPhoto"
                                         class="avatar" v-loading="uploading">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item :label="'组织介绍:'" prop="pyName" :label-width="labelWidth" class="label">
                                <el-input v-model="dataForm.deptIntroduction" size="small" rows="5"
                                          type="textarea"
                                          maxlength="1000" class="input-row"></el-input>
                            </el-form-item>

                        </div>

                        <div class="col-sm-6">
                            <el-form-item :label="'机构级别:'" prop="deptType" :label-width="labelWidth">
                                <el-select v-model="dataForm.deptType" :placeholder="'机构级别'" prop="deptType"
                                           size="small"
                                           class="input-row">
                                    <el-option v-for="(item,index) in deptTypeList" :label=item.label
                                               :value="Number(item.itemValue)" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'党组织书记:'" prop="partyOrgManager" :label-width="labelWidth">
                                <el-input v-model="dataForm.partyOrgManager" size="small" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item :label="'电话号码:'" prop="phone" :label-width="labelWidth">
                                <el-input v-model="dataForm.phone" size="small" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item :label="'组建方式:'" prop="partyOrgCreateType" :label-width="labelWidth">
                                <el-select v-model="dataForm.partyOrgCreateType" :placeholder="'组建方式'"
                                           prop="partyOrgCreateType" size="small" class="input-row">
                                    <el-option v-for="(item,index) in partyOrgCreateTypeList" :label=item.label
                                               :value="Number(item.itemValue)" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'批准建立日期:'" prop="createDate" :label-width="labelWidth">
                                <el-input v-model="dataForm.createDate" size="small" class="input-row"
                                          :disabled=true></el-input>
                            </el-form-item>
                            <el-form-item :label="'组织类型:'" prop="organizationTypeName" :label-width="labelWidth">
                                <el-select v-model="dataForm.organizationType" :placeholder="'组织类型'"
                                           prop="organizationType"
                                           size="small" class="input-row">
                                    <el-option v-for="(item,index) in organizationTypeList" :label="item.label"
                                               :value="Number(item.itemValue)" :key="index"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item :label="'组织标签:'" prop="deptLabel" :label-width="labelWidth">
                                <div style="display: flex;">
                                    <div style="flex: 1">
                                        <el-input v-model="dataForm.deptLabel" size="small"
                                                  class="input-row"></el-input>
                                    </div>
                                    <div style="margin-left: 5px;">
                                        <el-button type="primary" size="small" @click="select(isSelects)">选择</el-button>
                                    </div>
                                </div>
                                <div v-if="isSelects">
                                    <CheckboxGroup v-model="checkBox" @on-change="onCheckboxChange">
                                        <Checkbox label="优秀党组织" border></Checkbox>
                                        <Checkbox label="创新党组织" border></Checkbox>
                                    </CheckboxGroup>
                                </div>
                            </el-form-item>
                            <el-form-item :label="'地址:'" prop="address" :label-width="labelWidth">
                                <el-input v-model="dataForm.address" size="small" class="input-row"
                                          show-overflow-tooltip></el-input>
                            </el-form-item>
                            <el-form-item :label="'地址搜索:'" prop="pyName" :label-width="labelWidth" class="label">
                                <div style="display: flex">
                                    <div style="flex: 1;">
                                        <el-input size="small" v-model.trim="searchLocation" placeholder="请输入地址搜索"
                                                  maxlength="30" clearable class="input-row"/>
                                    </div>
                                    <div style="margin-left: 5px;">
                                        <el-button :loading="getLocationLoading" size="small" type="primary"
                                                   @click="getLocation">搜索
                                        </el-button>
                                    </div>
                                </div>
                            </el-form-item>

                            <el-form-item :label="'地图:'" :label-width="labelWidth" class="label">
                                <div id="gao-de-map" class="map" v-if="zhanshi"></div>
                            </el-form-item>

                            <el-form-item :label="'管理员手机号:'" prop="managePhone" :label-width="labelWidth" class="label">
                                <el-input v-model="dataForm.managePhone" size="small" rows="5" placeholder="多个手机号用英文逗号,隔开"
                                          type="textarea"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="modal-footer">
                <el-button size="small" @click="handleClose">关闭</el-button>
                <el-button size="small" type="primary" @click="save" v-if="!disabled">保存</el-button>
            </div>
            <span slot="footer" class="dialog-footer"></span>
            <cropper ref="cropper" :auto-crop-width="300" :auto-crop-height="300" :fixed="false"
                     @cropperResult="cropperResult"></cropper>
        </div>
    </el-dialog>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {addTzSysDept, getTzSysDept} from "@/api/jcxfSysDept";
import util from '@/libs/util'
import SelectArea from "@/components/selectArea.vue";
import {uploadFile} from "@/api/minionFile";
import cropper from "@/views/dj/components/cropper";
// 设置安全密钥
window._AMapSecurityConfig = {
    securityJsCode: 'eb47b4085f17b50dbe349488578df047',
}
export default {
    name: 'list-add-edit-new',
    components: {SelectArea, cropper},
    data() {
        return {
            searchLocation: '',
            ruleForm: {},
            searchVal: '',
            address: '',
            markers: [],
            position: {},
            lnglat: [],
            input: '',
            placeSearch: null,
            auto: null,
            key: util.key,
            infoWindow: '',
            circle: null,
            map: null,
            center: {
                lat: 28.8776683, lng: 105.44852407
            },
            zoom: 13,
            labelWidth: '170px',
            areaId: {
                province: '',
                city: '',
                area: '',
                town: ''
            },
            type: '',
            parentId: '',
            parentName: '',
            checkBox: [],
            location: '',
            placeInfo: {
                lat: 0, lng: 0
            },
            zhanshi: true,
            organizationTypeList: [],
            partyOrgCreateTypeList: [],
            typeNameList: [],
            partyOrgSituationList: [],
            partyOrgTypeList: [],
            unitOrgSituationList: [],
            deptTypeList: [],
            isSubmit: false,
            title: '',
            // 定位
            show: false,
            // 省市区
            disabled: false,
            isSelects: false,
            visible: false,
            getLocationLoading: false,
            uploading: false,
            dataForm: {
                name:'',
                deptRegion: '',
                parentId: '',
                id: '',
                deptType: '',
                partyOrgCreateType: '',
                unitOrgSituation: '',
                demonstrativePartyOrgName: '',
                typeName: '631',
                type: '',
                partyOrgContact: '',
                partyOrgSituationName: '',
                partyOrgSituation:'',
                unitName: '',
                partyOrgTypeName: '',
                partyOrgType: '',
                unitCode: '',
                address: '',
                pyName: '',
                partyOrgManager: '',
                phone: '',
                partyOrgCreateTypeName: '',
                createDate: '',
                organizationTypeName: '',
                organizationType: '',
                // shopCode: '',
                deptLabel: '',
                veteran:'',
                managePhone:""
            },
            shopDetailRule: {
                name: [
                    {required: true, message: '\'党组织名称不能为空\'', trigger: 'change'}
                ],
                partyOrgCreateType: [
                    {required: true, message: '\'组建方式不能为空\'', trigger: 'change'}
                ],
                partyOrgContact: [
                    {required: true, message: '\'党组织联系人不能为空\'', trigger: 'change'}
                ],

                typeName: [
                    {required: true, message: '\'组织类别不能为空\'', trigger: 'change'}
                ],
                partyOrgSituation: [
                    {required: true, message: '\'党组织所在单位情况不能为空\'', trigger: 'change'}
                ],
                unitName: [
                    {required: true, message: '\'单位名称不能为空\'', trigger: 'change'}
                ],
                partyOrgType: [
                    {required: true, message: '\'单位类别不能为空\'', trigger: 'change'}
                ],
                unitOrgSituation: [
                    {required: true, message: '\'单位建立党组织情况不能为空\'', trigger: 'change'}
                ],
                unitCode: [
                    {required: true, message: '\'党组织所在单位代码不能为空\'', trigger: 'change'}
                ],
                deptType: [
                    {required: true, message: '\'机构级别不能为空\'', trigger: 'change'}
                ],
                partyOrgManager: [
                    {required: true, message: '\'党组织书记不能为空\'', trigger: 'change'}
                ],
                phone: [
                    {required: true, message: '\'电话号码不能为空\'', trigger: 'change'},
                    {
                        type: 'string',
                        message: '联系电话有误！',
                        trigger: 'blur',
                        pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/
                    }
                ],
                partyOrgCreateTypeName: [
                    {required: true, message: '\'组建方式不能为空\'', trigger: 'change'}
                ],
                organizationType: [
                    {required: true, message: '\'组织类型不能为空\'', trigger: 'change'}
                ],
                type: [
                    {required: true, message: '\'组织类别不能为空\'', trigger: 'change'}
                ],
                veteran: [
                    {required: true, message: '\'请选择是否退休支部\'', trigger: 'change'}
                ]
            }
        }
    },
    mounted() {

    },
    methods: {
        openDialog(id, type, parentId, parentName){
            this.id = id
            this.type = type
            this.init(parentId, parentName)
        },
        beforeImageUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt5M = file.size / 1024 / 1024 < 5

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!')
            }
            if (!isLt5M) {
                this.$message.error('上传图片大小不能超过 5MB!')
            }
            this.$refs.cropper.init(file)
            return false
        },
        cropperResult(file) {
            this.uploading = true
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.dataForm.deptPhoto = res.data.url
                        this.uploading = false
                    }
                })
            }
        },
        getLocation() {
            this.getLocationLoading = true
            const geocoder = new AMap.Geocoder({
                city: '泸州' // 城市设为北京，默认：“全国”
            })
            geocoder.getLocation(this.searchLocation, (status, result) => {
                if (status === 'complete' && result.geocodes.length) {
                    const lnglat = result.geocodes[0].location
                    this.$set(this.ruleForm, 'longitude', result.geocodes[0].location.lng)
                    this.$set(this.ruleForm, 'latitude', result.geocodes[0].location.lat)
                    this.$set(this.ruleForm, 'coordinate', result.geocodes[0].location.lng + ',' + result.geocodes[0].location.lat)
                    this.marker.setPosition(lnglat)
                    this.map.add(this.marker)
                    this.map.setFitView(this.marker)
                } else {
                    console.error('根据地址查询位置失败')
                }
                this.getLocationLoading = false
            })
        },
        initMap() {
            let that = this
            AMapLoader.load({
                key: this.key,             // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: [
                    'AMap.Scale',
                    "AMap.Circle", //圆形
                    "AMap.Marker", //标记点
                    'AMap.ToolBar',
                    'AMap.InfoWindow',
                    'AMap.ControlBar',
                    'AMap.AutoComplete',
                    'AMap.PlaceSearch',
                    'AMap.Geolocation',
                    'AMap.Geocoder'
                ],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap) => {
                this.map = new AMap.Map("gao-de-map", {  //设置地图容器id
                    viewMode: "3D",    //是否为3D地图模式
                    zoom: this.zoom,
                    //初始化地图级别
                    center: [that.dataForm.longitude || 105.44852407, that.dataForm.latitude || 28.8776683], //初始化地图中心点位置（北京）
                    resizeEnable: true
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
                    center: [that.dataForm.longitude || 105.44852407, that.dataForm.latitude || 28.8776683], // 圆心位置
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

                if (this.dataForm.name && this.dataForm.name.length > 0) {
                    this.marker.content = this.dataForm.name
                    this.marker.on("click", this.markerClick)
                    this.marker.emit('click', {target: this.marker});// 此处是设置默认出现信息窗体
                    makerList.push(this.marker)
                }

                this.map.add(this.marker); //添加  点标记
                this.map.addControl(toolBar) // 添加右下角的放大缩小
                this.map.addControl(controlBar) // 方向盘

                // 关键字查询
                this.searchMap();
                // 监听鼠标点击事件
                this.map.on("click", this.clickMapHandler);

            }).catch(e => {

            })
        },
        // 点击地图事件获取经纬度，并添加标记
        clickMapHandler(e) {
            this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
            this.setMarker(this.lnglat);
            this.dataForm.longitude = e.lnglat.getLng()
            this.dataForm.latitude = e.lnglat.getLat()
            // 点击地图上的位置，根据经纬度转换成详细地址
            let geocoder = new AMap.Geocoder({});
            let that = this;
            let tmp = this.lnglat
            geocoder.getAddress(tmp, function (status, result) {
                if (status === "complete" && result.regeocode) {
                    that.address = result.regeocode.formattedAddress;
                } else {

                }
            });
            this.position = {
                longitude: e.lnglat.getLng(),
                latitude: e.lnglat.getLat(),
                address: that.address,
            };
            that.dataForm.address = that.address
            // this.input = that.address //把查询到的地址赋值到输入框
        },
        //  添加标记
        setMarker(lnglat) {
            this.removeMarker();
            let marker = new AMap.Marker({
                position: lnglat,
            });
            marker.setMap(this.map);
            this.markers.push(marker);
        },
        // 删除之前后的标记点
        removeMarker() {
            if (this.markers) {
                this.map.remove(this.markers);
            }
        },
        // 关键字查询
        searchMap() {
            // 搜索框自动完成类
            this.auto = new AMap.AutoComplete({
                input: "tipinput", // 使用联想输入的input的id
            })
            //构造地点查询类
            this.placeSearch = new AMap.PlaceSearch({
                map: this.map,
            });
            // 当选中某条搜索记录时触发
            this.auto.on("select", this.selectSite);
        },
        //当选中某条搜索记录时触发
        selectSite(e) {
            if (e.poi.location) {
                this.lnglat = [e.poi.location.lng, e.poi.location.lat];
                this.placeSearch.setCity(e.poi.adcode);
                this.placeSearch.search(e.poi.name); //关键字查询
                let geocoder = new AMap.Geocoder({});
                let that = this;
                geocoder.getAddress(this.lnglat, function (status, result) {
                    if (status === "complete" && result.regeocode) {
                        let province = result.regeocode.addressComponent.province;
                        let city = result.regeocode.addressComponent.city;
                        //自己想要赋的值，根据自己的做修改
                        let form = {
                            province: province,
                            city: city,
                            address: e.poi.name,
                            coordinate: ''
                        }
                        that.dataForm.address = province + city + e.poi.name
                        // debugger
                        that.$set(that.form, "province", province);
                        that.$set(that.form, "city", city);
                        that.$set(that.form, "address", e.poi.name);
                    } else {
                    }
                });
            } else {
                this.$message.error("查询地址失败，请重新输入地址");
            }
        },
        // 控制标记的信息窗体的显示
        markerClick(e) {
            // 标注的点击事件
            this.infoWindow.setContent(e.target.content);
            this.infoWindow.open(this.map, e.target.getPosition());
        },
        onCheckboxChange(e) {
            this.dataForm.deptLabel = ''
            for (let i = 0; i < e.length; i++) {
                this.dataForm.deptLabel += (i + 1) + '.' + e[i] + '\xa0\xa0\xa0'
            }
        },
        regionSelected(event) {
            this.dataForm.deptRegion = event.areaName
            this.dataForm.deptRegionIds = event.deptRegionIds
            this.dataForm.areaId = event.areaId
        },
        // regionChange(e) {
        //     let areaId = ''
        //     let values = ''
        //     if (e) {
        //         // var dat = data.province.value ? data.province.value : '' + data.city !== undefined ? ',' + data.city.value : '' + data.area !== undefined ? ',' + data.area.value : '' + data.town !== undefined ? ',' + data.town.value : ''
        //         if (e.province) {
        //             values = e.province.value
        //             areaId = e.province.key
        //             this.areaId.province = e.province.key
        //
        //         }
        //         if (e.city) {
        //             values += e.city.value
        //             areaId += e.city.key
        //             this.areaId.city = e.city.key
        //
        //         }
        //         if (e.area) {
        //             values += e.area.value
        //             areaId += e.area.key
        //             // this.form.formList[i].addressName = values;
        //             this.areaId.area = e.area.key
        //
        //         }
        //         if (e.town) {
        //             values += e.town.value
        //             areaId += e.town.key
        //             // this.form.formList[i].addressName = values;
        //             this.areaId.town = e.town.key
        //         }
        //     }
        //     //this.dataForm.areaId = areaId
        //     this.dataForm.deptRegion = values
        // },
        getDict(type) {
            getDictByCode(type).then(res => {
                let result = res.data.data
                if (type == "partyType") {
                    this.typeNameList = result
                } else if (type == 'partyOrgSituation') {
                    this.partyOrgSituationList = result
                } else if (type == 'partyOrgType') {
                    this.partyOrgTypeList = result
                } else if (type == 'unitOrgSituation') {
                    this.unitOrgSituationList = result
                } else if (type == 'deptType') {
                    this.deptTypeList = result
                } else if (type == 'partyOrgCreateType') {
                    this.partyOrgCreateTypeList = result
                } else if (type == 'organizationType') {
                    this.organizationTypeList = result
                }
            })
        },
        save() {
            if (this.type == 3 && this.parentId == '') {
                this.$message({
                    message: '请选择该机构的父级机构',
                    type: 'error',
                    //duration: 1000
                })
                return
            }
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    return
                }

                // this.dataListLoading = true
                let token = JSON.parse(window.sessionStorage.getItem('token'))
                this.dataForm.token = token.token
                let data = this.dataForm
                addTzSysDept({data: data}).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            //duration: 1000
                        })
                        this.visible = false
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'error',
                            //duration: 1000
                        })
                    }
                    this.$emit('changeOrganization')
                }).catch((e) => {
                    this.isSubmit = false
                })
            })
        },
        select(isSelect) {
            this.isSelects = !isSelect
        },
        handleClose() {
            this.visible = false
        },
        init(parentId, parentName) {
            let id = this.id
            let type = this.type
            if (type == 0) {
                this.title = '编辑'
                this.disabled = false
            } else if (type == 1) {
                this.title = '查看'
                this.disabled = true
            } else if (type == 3) {
                this.title = '新增'
                this.parentId = parentId
                this.dataForm.parentId = parentId
                this.parentName = parentName
            }
            this.dataForm.id = id || null
            this.visible = true
            this.isSubmit = false
            this.getDict('partyType')
            this.getDict('partyOrgSituation')
            this.getDict('partyOrgType')
            this.getDict('unitOrgSituation')
            this.getDict('deptType')
            this.getDict('partyOrgCreateType')
            this.getDict('organizationType')
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    getTzSysDept(this.dataForm.id).then(res => {
                        const data = res.data.data
                        this.dataForm = data
                        this.initMap();
                        this.$nextTick(() => {
                            this.$refs.selectAreaRef.setData(this.dataForm.regionIds)
                        })
                    })
                } else {
                    this.initMap();
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
#inputs {
    width: 100px;
    margin-right: 10px
}

.el-dialog_header {
    ::v-deep.el-dialog__header {
        padding: 1px;
        /*padding-bottom: 1px;*/
    }

}

.map {
    width: 100%;
    margin: auto;
    height: 300px;
}

.modal-content {
    background: white;
    padding: 0 15px;

    .modal-header {
        padding: 15px 15px;
        text-align: center;

        .modal-title {
            font-size: 26px;
        }
    }

    .body {
        width: 95%;
        margin: auto;

        .row {
            display: flex;

            .col-sm-6 {
                width: 50%;

                .label {
                    ::v-deep.el-form-item__label {
                        line-height: 18px;
                    }
                }


                .el-form-item {
                    line-height: 20px;

                    .input-row {
                        width: 100%;
                    }
                }
            }
        }
    }

    .modal-footer {
        padding: 15px;
        text-align: right;
        border-top: 1px solid #e5e5e5;
        margin: auto;

        .btn-white {
            border-radius: 3px;
            letter-spacing: 1px;
            color: inherit;
            background: white;
            border: 1px solid #e7eaec;

            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
        }

        .btn-blue {
            border-radius: 3px;
            letter-spacing: 1px;

            color: #FFFFFF;
            margin-left: 5px;
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-color: #3d86e7 !important;
            border-color: #3d86e7 !important;
        }
    }

    .avatar-uploader ::v-deep .el-upload {
        border: 1px dashed #d9d9d9 !important;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 330px;
        height: 175px;
        line-height: 175px;
        text-align: center;
    }

    .avatar {
        width: 330px;
        height: 175px;
        display: block;
    }
}
</style>
