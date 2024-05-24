<template>
  <n-dropdown :options="options" placement="bottom-end" @select="handleSelect">
    <n-avatar class="cursor-pointer" round :size="32" color="black" :style="{ color: 'white' }">
      {{ getInitials(userData?.name) }}
    </n-avatar>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { NAvatar, NDropdown } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useRouter } from 'vue-router'
import { ref, h, onMounted } from 'vue'

const UserIcon = 'ion:person-outline'
const LogoutIcon = 'ion:log-out-outline'
const DocsIcon = 'ion:book-outline'

defineOptions({
  name: 'Avatar',
})

const router = useRouter()
const options = ref([{ label: 'Logout', key: 'route-Logout', icon: renderIcon(LogoutIcon) }])

const userData = ref<{ name: string; role: 'student' | 'admin' } | null>(null)

onMounted(() => {
  // Retrieve the user data from local storage
  const savedStudentData = localStorage.getItem('StudentData')
  const savedAdminData = localStorage.getItem('AdminData')

  if (savedStudentData) {
    userData.value = { ...JSON.parse(savedStudentData), role: 'student' }
  } else if (savedAdminData) {
    userData.value = { ...JSON.parse(savedAdminData), role: 'admin' }
  }
})

function handleSelect(key: string) {
  if (key.indexOf('route-') === 0) {
    const path = key.split('route-')[1]
    router.push({ name: path })
  }
}

function getInitials(name?: string) {
  if (name) {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
    return initials.toUpperCase()
  }
  return ''
}
</script>
