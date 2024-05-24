<template>
  <div class="settings flex items-center justify-between">
    <div class="layout">
      <div class="bubble flex items-center">
        <n-button quaternary circle @click="setAlign('left')">
          <template #icon>
            <Icon>
              <Iconify :icon="AlignLeftActive" v-if="align === 'left'" />
              <Iconify :icon="AlignLeft" v-else />
            </Icon>
          </template>
        </n-button>
        <n-button quaternary circle @click="setAlign('center')">
          <template #icon>
            <Icon>
              <Iconify :icon="AlignCenterActive" v-if="align === 'center'" />
              <Iconify :icon="AlignCenter" v-else />
            </Icon>
          </template>
        </n-button>

        <FullscreenSwitch />
        <ThemeSwitch />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { NButton } from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import { Icon as Iconify } from '@iconify/vue'
import { useThemeStore } from '@/stores/theme'
import ThemeSwitch from '@/app-layouts/common/Toolbar/ThemeSwitch.vue'
import FullscreenSwitch from '@/app-layouts/common/Toolbar/FullscreenSwitch.vue'

const AlignLeft = 'fluent:textbox-align-bottom-rotate-90-24-regular'
const AlignCenter = 'fluent:textbox-align-middle-rotate-90-24-regular'
const AlignRight = 'fluent:textbox-align-top-rotate-90-24-regular'
const AlignLeftActive = 'fluent:textbox-align-bottom-rotate-90-24-filled'
const AlignCenterActive = 'fluent:textbox-align-middle-rotate-90-24-filled'
const AlignRightActive = 'fluent:textbox-align-top-rotate-90-24-filled'

export type Align = 'left' | 'center' | 'right'

const emit = defineEmits<{
  (event: 'update:align', value: Align): void
}>()

const align = ref<Align>('left')

const activeColor = defineModel<string>('activeColor', { default: '' })

const themeStore = useThemeStore()

const colors = computed(() => themeStore.secondaryColors)
const primaryColor = computed(() => themeStore.primaryColor)

onMounted(() => {
  activeColor.value = primaryColor.value
  const storedAlign = localStorage.getItem('align') as Align
  if (storedAlign) {
    align.value = storedAlign
  }
})

function setAlign(value: Align) {
  align.value = value
  localStorage.setItem('align', value)
  emit('update:align', value)
}
</script>

<style lang="scss" scoped>
.settings {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-secondary-color);
  height: 44px;
  width: 150px;
  border-radius: 50px;
  padding: 5px;
  z-index: 1;

  @media (max-width: 800px) {
    width: 112px;
    .colors {
      display: none;
    }
  }
}
.bubble {
  padding: 1px;
  transition: all 0.3s;
  gap: 8px;
}
</style>
