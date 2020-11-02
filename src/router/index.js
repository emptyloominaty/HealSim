import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Healing Simulation',
    component: Home
  },
  {
    path: '/remsim',
    name: 'Renewing Mist Simulation',
    component: function () {
      return import('../views/remSim.vue')
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: function () {
      return import('../views/settings.vue')
    }
  },
  {
    path: '/heals',
    name: 'Heals',
    component: function () {
      return import('../views/heals.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
