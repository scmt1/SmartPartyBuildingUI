import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export const routes = [
    {
        path: "/dwgl",
        name: "首页",
        component: () => import("@/views/Home.vue"),
    },
    {
        path: "/dwgl/dygl",
        name: "党员管理",
        component: () => import("@/views/dj/partyMember/index.vue"),
    },
    {
        path: "/dwgl/dwgl",
        name: "党员首页",
        component: () => import("@/views/dj/partyMember/homePage.vue"),
    },
    {
        path: "/dwgl/personDetails",
        name: "党员详情",
        component: () => import("@/views/dj/partyMember/person_details.vue"),
    },
    {
        path: "/dwgl/personPortrait",
        name: "党员画像",
        component: () => import("@/views/dj/partyMember/personPortrait.vue"),
    },
    {
        path: "/dwgl/organization",
        name: "组织管理",
        component: () => import("@/views/dj/organization/index.vue"),
    },
    {
        path: "/dwgl/dept/organization",
        name: "组织信息",
        component: () => import("@/views/dj/organization/index.vue"),
    },
    {
        path: "/dwgl/organization/organization",
        name: "组织管理首页",
        component: () => import("@/views/dj/organization/organization.vue"),
    },
    {
        path: "/dwgl/list-add-edit-new",
        name: "组织管理",
        component: () => import("@/views/dj/organization/list-add-edit-new"),
    },
    {
        path: "/dwgl/organization/detail",
        name: "组织详情",
        component: () => import("@/views/dj/organization/detail"),
    },
    {
        path: "/dwgl/organizationwork",
        name: "组工管理",
        component: () => import("@/views/dj/organizationWork/index"),
    },
    {
        path: "/dwgl/dwgl/payFee",
        name: "支付概况",
        component: () => import("@/views/dj/payFee/deptPay"),
    },
    {
        path: "/dwgl/dwgl/payFeePerson",
        name: "党费缴纳",
        component: () => import("@/views/dj/payFee/index"),
    },
    {
        path: "/dwgl/dwgl/payFeeStandard",
        name: "党费标准",
        component: () => import("@/views/dj/payFee/payFeeStandard"),
    },
    {
        path: "/dwgl/dwgl/payFeeHistory",
        name: "历史党费查询",
        component: () => import("@/views/dj/payFee/history"),
    },
    {
        path: "/dwgl/dwgl/payFeeDetail",
        name: "缴费详情",
        component: () => import("@/views/dj/payFee/detail")
    },
    {
        path: "/dwgl/dwgl/allDetail",
        name: "缴费明细",
        component: () => import("@/views/dj/payFee/allDetailList")
    },
    {
        path: "/dwgl/addPartyMember",
        name: "党员新增",
        component: () => import("@/views/dj/partyMember/addPartyMember.vue"),
    },
    {
        path: "/dwgl/partyImport",
        name: "党员导入",
        component: () => import("@/views/dj/partyMember/partyImport.vue"),
    },
    {
        path: "/dwgl/partyMemberEcharts",
        name: "党员Echarts",
        component: () => import("@/views/dj/partyMember/partyMemberEcharts.vue"),
    },
    {
        path: "/dwgl/partyMemberRecover",
        name: "党员恢复",
        component: () => import("@/views/dj/partyMember/partyMemberRecover.vue"),
    },
    {
        path: "/dwgl/previewPDF",
        name: "党员PDF预览",
        component: () => import("@/views/dj/partyMember/previewPDF.vue"),
    },
    {
        path: "/dwgl/updatePerson",
        name: "党员修改",
        component: () => import("@/views/dj/partyMember/updatePerson.vue"),
    },
    {
        path: "/dwgl/organizationIntroduce",
        name: "支部概况",
        component: () => import("@/views/dj/windowOfBranch/organizationIntroduce/index.vue"),
    },
    {
        path: "/dwgl/partyMemberFlowOut",
        name: "党员流出",
        component: () => import("@/views/dj/partyMemberFlow/partyMemberFlowOut.vue"),
    },
    {
        path: "/dwgl/partyMemberDeptTransfer",
        name: "组织关系转移",
        component: () => import("@/views/dj/partyMember/PartyMemberDeptTransfer/index.vue"),
    },
    {
        path: "/dwgl/developParty",
        name: "发展党员",
        component: () => import("@/views/dj/developParty/index.vue"),
    },
    {
        path: "/dwgl/organizationLife",
        name: "组织生活首页",
        component: () => import("@/views/dj/windowOfBranch/organizationLife/organizationLife.vue"),
    },
    {
        path: "/dwgl/organizationLife/taizhang",
        name: "组织生活台账",
        component: () => import("@/views/dj/windowOfBranch/organizationLife/taizhang.vue"),
    },
    {
        path: "/dwgl/organizationLife/startMeeting",
        name: "部门组织生活详情",
        component: () => import("@/views/dj/windowOfBranch/organizationLife/startMeeting.vue"),
    },
    {
        path: "/dwgl/organizationLife/detailView",
        name: "部门组织生活会议详情",
        component: () => import("@/views/dj/windowOfBranch/organizationLife/detailView.vue"),
    },
    {
        path: "/dwgl/vote",
        name: "投票",
        component: () => import("@/views/dj/voteManage/index.vue"),
    },
    {
        path: "/dwgl/vote/votetStatistics",
        name: "投票排名",
        component: () => import("@/views/dj/voteManage/votetStatistics.vue"),
    },
    {
        path: '/dwgl/vote/voteDetail',
        name: '投票选项',
        component: () => import("@/views/dj/voteManage/voteDetail.vue")
    },
    {
        path: "/dwgl/organizationLife/meetingEcharts",
        name: "部门组织生活数据统计",
        component: () => import("@/views/dj/windowOfBranch/organizationLife/meetingEcharts.vue"),
    },
    /*{
        path: "/dwgl/topic",
        name: "专项答题",
        component: () => import("@/views/dj/topicManage/index.vue"),
    },*/
    {
        path: "/dwgl/topic/questBankManage",
        name: "题库管理",
        component: () => import("@/views/dj/topicManage/questionBank/questBankManage.vue"),
    },
    {
        path: "/dwgl/topic/testManage",
        name: "试题管理",
        component: () => import("@/views/dj/topicManage/test/testManage.vue"),
    },
    {
        path: "/dwgl/topic/exam",
        name: "考试中心",
        component: () => import("@/views/dj/topicManage/exam/index.vue"),
    },
    {
        path: "/dwgl/xxqg",
        name: "学习强国",
        component: () => import("@/views/dj/xxqg/index.vue"),
    },
    {
        path: "/dwgl/partyHonor/honorShow",
        name: "党内荣誉展示",
        component: () => import("@/views/dj/partyHonor/honorShow.vue"),
    },
    {
        path: "/dwgl/partyHonor/honorPass",
        name: "荣誉审核",
        component: () => import("@/views/dj/partyHonor/honorPass.vue"),
    },
    {
        path: "/dwgl/partyHonor/index",
        name: "党内荣誉管理",
        component: () => import("@/views/dj/partyHonor/index.vue"),
    },
    {
        path: "/dwgl/partyHonor/passRecord",
        name: "荣誉审核记录",
        component: () => import("@/views/dj/partyHonor/passRecord.vue"),
    },
    {
        path: "/dwgl/twoBestOneFirstTime/index",
        name: "两优一先时间设置",
        component: () => import("@/views/dj/twoBestOneFirstTime/index.vue"),
    },
    {
        path: "/dwgl/twoBestOneFirst/index",
        name: "两优一先列表",
        component: () => import("@/views/dj/twoBestOneFirst/index.vue"),
    },
    {
        path: "/dwgl/termDept",
        name: "换届信息",
        component: () => import("@/views/dj/windowOfBranch/changeTermDept/index.vue"),
    },
    {
        path: "/dwgl/dept/morePartyDynamics",
        name: "换届信息",
        component: () => import("@/views/dj/organization/morePartyDynamics.vue"),
    },
    {
        path: "/dwgl/loginLog",
        name: "登录日志",
        component: () => import("@/views/dj/loginLog/index.vue"),
    },
    {
        path: "/dwgl/deptButtonRole",
        name: "部门权限",
        component: () => import("@/views/dj/buttonRole/index.vue"),
    },
    {
        path: "/dwgl/twoBestOneFirst/timeIndex",
        name: "两优一先提交",
        component: () => import("@/views/dj/twoBestOneFirst/timeIndex.vue"),
    }
]

const router = new VueRouter({
    // base: window.__POWERED_BY_QIANKUN__ ? "/dwgl" : "/", //  base路由和注册子应用入口保持一致
    mode: "hash",
    scrollBehavior: () => ({y: 0}),
    routes
})

export default router
