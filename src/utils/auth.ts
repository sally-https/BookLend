import { type RouteMetaAuth } from '@/types/auth.d'
import { type RouteLocationNormalized, type Router } from 'vue-router'

export function authCheck(route: RouteLocationNormalized, router: Router) {
  const meta: RouteMetaAuth = route.meta
  const { checkAuth, authRedirect, auth, roles } = meta
  const isLogged = localStorage.getItem('isLogged') === 'true'
  const userRole = localStorage.getItem('role')

  if (route?.redirectedFrom?.name === 'Logout') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('isLogged')
    localStorage.removeItem('role')
    localStorage.removeItem('StudentData')
    localStorage.removeItem('AdminData')
    // Redirect to the login page using router.push()
    router.push('/')
    return false
  }

  if (auth === true) {
    if (!isLogged) {
      // Redirect to the login page using router.push()
      router.push({ path: '/', query: route.query })
      return false
    }

    if (roles && !roles.includes(userRole)) {
      // User role is not authorized for the route
      if (userRole === 'student') {
        // Redirect to the student dashboard
        router.push('/student-dashboard')
      } else if (userRole === 'admin') {
        // Redirect to the admin dashboard
        router.push('/admin-dashboard')
      } else {
        // Redirect to the login page for unknown roles
        router.push('/')
      }
      return false
    }
  }

  if (checkAuth === true) {
    if (isLogged) {
      if (userRole === 'student') {
        return authRedirect || '/student-dashboard'
      } else if (userRole === 'admin') {
        return authRedirect || '/admin-dashboard'
      }
    }
  }
}
