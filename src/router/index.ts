import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import { Layout } from '@/types/theme.d'
import { authCheck } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/student-dashboard',
      name: 'StudentDashboard',
      component: Dashboard,
      meta: { title: 'Student Dashboard', auth: true, roles: ['student'] },
    },

    {
      path: '/admin-dashboard',
      name: 'AdminDashboard',
      component: Dashboard,
      meta: { title: 'Admin Dashboard', auth: true, roles: ['admin'] },
    },
    {
      path: '/manage-students',
      name: 'ManageStudents',
      component: () => import('@/views/Admin/ManageStudents.vue'),
      meta: { title: 'Manage Students', auth: true, roles: ['admin'] },
    },
    {
      path: '/manage-books',
      name: 'ManageBooks',
      component: () => import('@/views/Admin/ManageBooks.vue'),
      meta: { title: 'Manage Books', auth: true, roles: ['admin'] },
    },
    {
      path: '/returned-books',
      name: 'ReturnedBooks',
      component: () => import('@/views/Admin/ReturnedBooks.vue'),
      meta: { title: 'Returned Books', auth: true, roles: ['admin'] },
    },
    {
      path: '/borrowed-books',
      name: 'BorrowedBooks',
      component: () => import('@/views/Admin/BorrowedBooks.vue'),
      meta: { title: 'Borrowed Books', auth: true, roles: ['admin'] },
    },
    {
      path: '/manage-books',
      name: 'manage-books',
      component: () => import('@/views/Books.vue'),
      meta: { title: 'Books', auth: true, roles: ['student'] },
    },
    {
      path: '/library',
      name: 'Library',
      component: () => import('@/views/Library/Library.vue'),
      meta: { title: 'Library', auth: true, roles: ['student'] },
    },
    {
      path: '/admin-dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/Admin/Dashboard.vue'),
      meta: { title: 'Admin Dashboard', auth: true, roles: ['admin'] },
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/Auth/Login.vue'),
      meta: { title: 'Login', forceLayout: Layout.Blank, checkAuth: true },
    },
    {
      path: '/admin-login',
      name: 'AdminLogin',
      component: () => import('@/views/Auth/AdminLogin.vue'),
      meta: { title: 'Login', forceLayout: Layout.Blank, checkAuth: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Auth/Register.vue'),
      meta: { title: 'Register', forceLayout: Layout.Blank, checkAuth: true },
    },
    {
      path: '/verify',
      name: 'Verify',
      component: () => import('@/views/Auth/Login.vue'),
      meta: { title: 'Verify Identity', forceLayout: Layout.Blank, checkAuth: true },
      beforeEnter: (to, from, next) => {
        if (to.query.school_id) {
          next()
        } else {
          next({ name: 'Login' })
        }
      },
    },
    {
      path: '/logout',
      name: 'Logout',
      redirect: '/login',
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/Auth/Login.vue'),
      meta: { forceLayout: Layout.Blank, checkAuth: true },
    },
  ],
})

router.beforeEach((route) => {
  return authCheck(route, router)
})

export default router
