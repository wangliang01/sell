import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'goods',
            component: (resolve) => {
                require(['components/goods/goods'], resolve)
            },
            redirect: '/goods'

        }, {
            path: '/goods',
            name: 'goods',
            component: (resolve) => {
                require(['@/components/goods/goods'], resolve)
            }
        }, {
            path: '/ratings',
            name: 'ratings',
            component: (resolve) => {
                require(['@/components/ratings/ratings'], resolve)
            }
        }, {
            path: '/seller',
            name: 'seller',
            component: (resolve) => {
                require(['@/components/seller/seller'], resolve)
            }
        }
    ],
    linkActiveClass: 'active'
})
