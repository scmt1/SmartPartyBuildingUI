import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export const routes = [
    {
        path: "/message",
        name: "首页概览",
        component: () => import("@/views/dj/home/Home.vue")
    },
    {
        path: "/message/mission" ,
        name: "任务发送统计" ,
        component: () => import("@/views/dj/statistics/mission/index.vue")
    },
    {
        path: "/message/detail",
        name: "发送详情统计",
        component: () => import("@/views/dj/statistics/detail/index.vue")
    },
    {
        path: "/message/customMessage",
        name: "自定义发送",
        component: () => import("@/views/dj/customMessage/index.vue")
    },
    {
        path: "/message/templateMessage",
        name: "模板发送",
        component: () => import("@/views/dj/templateMessage/index.vue")
    },
    {
        path: "/message/autoMessage",
        name: "自动发送",
        component: () => import("@/views/dj/autoMessage/index.vue")
    },
    {
        path: "/message/autoMessageRole",
        name: "自动发送任务权限管理",
        component: () => import("@/views/dj/autoMessage/autoMessageRole.vue")
    },
    {
        path: "/message/autoMessageDefaultTemplate",
        name: "自定义基础模板管理",
        component: () => import("@/views/dj/autoMessage/autoMessageDefaultTemplate.vue")
    },
    {
        path: "/message/customUserGroup",
        name: "自定义用户组管理",
        component: () => import("@/views/dj/customUserGroup/index.vue")
    },
    {
        path: "/message/customMessageSign",
        name: "自定义签名管理",
        component: () => import("@/views/dj/customMessageSign/index.vue")
    },
    {
        path: "/message/birthday",
        name: "生日短信统计",
        component: () => import("@/views/dj/statistics/birthday/index.vue")
    },
]

const router = new VueRouter({
    // base: window.__POWERED_BY_QIANKUN__ ? "/dwgl" : "/", //  base路由和注册子应用入口保持一致
    mode: "hash",
    scrollBehavior: () => ({y: 0}),
    routes
})

export default router
