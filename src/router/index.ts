import { createRouter, createWebHistory } from 'vue-router'

const CustomerPage = () => import('../reservation-management/customer/page.vue')
const ReservationPage = () => import('../reservation-management/reservation/page.vue')
const TablePage = () => import('../reservation-management/table/page.vue')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/customers'
        },
        {
            path: '/customers',
            name: 'customers',
            component: CustomerPage
        },
        {
            path: '/reservations',
            name: 'reservations',
            component: ReservationPage
        },

        {
            path: '/tables',
            name: 'tables',
            component: TablePage
        }
    ]
})

export default router