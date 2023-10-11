import {createRouter, createWebHistory} from "vue-router";
import PubSub from "pubsub-js";

const index = ref()
const setUp = ref()

const userNameValue = ref()

const cookies = document.cookie.split("; ");
for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "userName") {
        userNameValue.value = value
    }
}

if(userNameValue.value === undefined){
    index.value = import("@/components/home.vue")
    setUp.value = import("@/components/home.vue")
}else {
    index.value = import("@/components/index.vue")
    setUp.value = import("@/components/setUp.vue")
}

PubSub.subscribe('home', function (msg, data) {
    // console.log('data',data)
    if(data){
        index.value = import("@/components/index.vue")
        setUp.value = import("@/components/setUp.vue")
    }else{
        index.value = import("@/components/home.vue")
        setUp.value = import("@/components/home.vue")
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