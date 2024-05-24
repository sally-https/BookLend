import { renderIcon } from '@/utils'
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { type MenuMixedOption } from 'naive-ui/es/menu/src/interface'
import {
  HomeSimple as HomeIcon,
  Book as BookIcon,
  BookSolid as LibraryIcon,
  CubeReplaceFace as ManageStudentsIcon,
  BookStack as BorrowedBooksIcon,
  OpenBook as ReturnedBooksIcon,
} from '@iconoir/vue'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function getItems(mode: 'vertical' | 'horizontal', collapsed: boolean): MenuMixedOption[] {
  const userRole = localStorage.getItem('role')

  if (userRole === 'student') {
    return [
      {
        label: () => h(RouterLink, { to: { name: 'StudentDashboard' } }, { default: () => 'Home' }),
        key: 'StudentDashboard',
        icon: () => h(HomeIcon),
      },
      {
        label: () => h(RouterLink, { to: { name: 'manage-books' } }, { default: () => 'Books' }),
        key: 'Books',
        icon: () => h(BookIcon),
      },
      {
        label: () => h(RouterLink, { to: { name: 'Library' } }, { default: () => 'Library' }),
        key: 'Library',
        icon: () => h(LibraryIcon),
      },
    ]
  } else if (userRole === 'admin') {
    return [
      {
        label: () => h(RouterLink, { to: { name: 'AdminDashboard' } }, { default: () => 'Home' }),
        key: 'AdminDashboard',
        icon: () => h(HomeIcon),
      },
      {
        label: () => h(RouterLink, { to: { name: 'ManageStudents' } }, { default: () => 'Manage Students' }),
        key: 'ManageStudents',
        icon: () => h(ManageStudentsIcon),
      },
      {
        label: () => h(RouterLink, { to: { name: 'ManageBooks' } }, { default: () => 'Manage Books' }),
        key: 'ManageBooks',
        icon: () => h(BookIcon),
      },
      {
        label: () => h(RouterLink, { to: { name: 'BorrowedBooks' } }, { default: () => 'Borrowed Books' }),
        key: 'BorrowedBooks',
        icon: () => h(BorrowedBooksIcon),
      },
      {
        label: () => h(RouterLink, { to: { name: 'ReturnedBooks' } }, { default: () => 'Returned Books' }),
        key: 'ReturnedBooks',
        icon: () => h(ReturnedBooksIcon),
      },
    ]
  } else {
    // Handle unknown user role or return default menu items
    return []
  }
}
