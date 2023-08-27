import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import("@/components/home.vue")
        },
        {
            path: '/index',
            name: 'index',
            component: ()=> import("@/components/index.vue")
        },
        {
            path: '/setUp',
            name: 'setUp',
            component: ()=> import("@/components/setUp.vue")
        }
    ]
})

export default router