import {createRouter, createWebHistory} from "vue-router";
import PubSub from "pubsub-js";

const index = ref(import("@/components/index.vue"))
const setUp = ref(import("@/components/setUp.vue"))

PubSub.subscribe('home', function (msg, data) {
    // console.log('data',data)
    if(data){
        index.value = import("@/components/index.vue")
        setUp.value = import("@/components/setUp.vue")
    }

})


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
            component: ()=> index.value
        },
        {
            path: '/setUp',
            name: 'setUp',
            component: ()=> setUp.value
        }
    ]
})

export default router