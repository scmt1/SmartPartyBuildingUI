import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export const routes = [
    {
        path: "/lesson",
        name: "课程管理",
        component: () => import("@/views/dj/studyOnline/studyManage/StudyVideo/index.vue"),
    },
   /* {
        path: "/lesson",
        name: "首页",
        component: () => import("@/views/Home.vue"),
    },*/
    {
        path: "/lesson/fileManage",
        name: "学习文件管理",
        component: () => import("@/views/dj/studyOnline/studyManage/fileManage/index.vue"),
    },

    {
        path: "/lesson/videoColumn",
        name: "课程类型管理",
        component: () => import("@/views/dj/studyOnline/studyManage/videoColumn/index.vue"),
    },
    {
        path: "/lesson/dataView",
        name: "数据展示",
        component: () => import("@/views/dj/studyOnline/studyManage/StudyVideo/dataView.vue"),
    }
]

const router = new VueRouter({
    // base: window.__POWERED_BY_QIANKUN__ ? "/dwgl" : "/", //  base路由和注册子应用入口保持一致
    mode: "hash",
    scrollBehavior: () => ({y: 0}),
    routes
})

export default router
