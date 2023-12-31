import {createRouter, createWebHistory} from "vue-router";
import PubSub from "pubsub-js";
import {toFindCookie} from "@/components/js/cookie";

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
        }
    ]
})

export default router