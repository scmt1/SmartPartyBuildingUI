import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export const routes = [
    {
        path: "/tzgl/tradeUnion",
        name: "工会组织管理",
        component: () => import("@/views/dj/tradeUnion/index.vue"),
    },
    {
        path: "/tzgl",
        name: "工会组织管理",
        component: () => import("@/views/dj/tradeUnion/index.vue"),
    },
    {
        path: "/tzgl/teamInfo",
        name: "团组织管理",
        component: () => import("@/views/dj/teamInfo/index.vue"),
    },
    {
        path: "/tzgl/unitedDept",
        name: "党建统战",
        component: () => import("@/views/dj/unitedDept/index.vue"),
    }
]

const router = new VueRouter({
    // base: window.__POWERED_BY_QIANKUN__ ? "/dwgl" : "/", //  base路由和注册子应用入口保持一致
    mode: "hash",
    scrollBehavior: () => ({y: 0}),
    routes
})

export default router
