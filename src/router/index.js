import Vue from 'vue'
import Router from 'vue-router'
import CurrencyData from '@/components/CurrencyData'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CurrencyData',
      component: CurrencyData
    }
  ],
  mode: 'history'
})
