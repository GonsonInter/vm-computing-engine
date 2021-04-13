import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import DBManage from '../views/DBManage'
import Formulations from "@/views/Formulations";
import Computings from "@/views/Computings";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/dbmanage',
    children: [
      { path: '/dbmanage', name: 'DBManage', component: DBManage},
      { path: '/formulations', name: 'Formulations', component: Formulations},
      { path: '/computing', name: 'Computings', component: Computings}
    ]
  },

]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
