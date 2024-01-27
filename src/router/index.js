import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Index',
            component: () => import("@/components/Index.vue")
        },
        {
            path: '/W001',
            name: 'W001',
            component: () => import("@/components/W001.vue")
        },
        {
            path: '/W002',
            name: 'W002',
            component: () => import("@/components/W002.vue")
        }
    ]
})

export default router