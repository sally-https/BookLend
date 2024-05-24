<template>
  <div class="page-auth">
    <Settings v-model:align="align" v-model:activeColor="activeColor" v-if="!isLogged" />

    <div class="flex wrapper justify-center" v-if="!isLogged">
      <div class="image-box basis-2/3" v-if="align === 'right'"></div>
      <div class="form-box basis-1/3 flex items-center justify-center" :class="{ centered: align === 'center' }">
        <div class="form-wrap">
          <div class="title mb-4">Verify Identity</div>
          <div class="text mb-12">Borrow from the only Library you can trust📚</div>
          <div class="form">
            <n-form ref="formRef" :model="model" :rules="rules">
              <n-form-item path="school_id" label="Student ID">
                <n-input
                  v-model:value="model.school_id"
                  @keydown.enter="getVcode"
                  placeholder="201212***"
                  size="large"
                  autocomplete="on"
                  style="width: calc(60% - 5px); margin-right: 10px"
                />
                <n-button type="primary" @click="getVcode" style="width: calc(40% - 5px); margin-left: 10px" size="large">
                  Request Code
                </n-button>
              </n-form-item>
            </n-form>
          </div>
        </div>
      </div>
      <div class="image-box basis-2/3" v-if="align === 'left'"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { post } from '@/plugins/http'
import { type FormInst, type FormValidationError, useMessage, type FormRules, NForm, NFormItem, NInput, NButton, NCheckbox } from 'naive-ui'
import { useRouter } from 'vue-router'
import Settings, { type Align } from '@/components/AuthForm/Settings.vue'
import { ref, computed, onBeforeMount, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { FormType } from '@/components/AuthForm/index.vue'

const props = defineProps<{
  formType?: FormType
}>()
const { formType } = toRefs(props)

const route = useRoute()
const align = ref<Align>('left')
const activeColor = ref('')
const type = ref<FormType | undefined>(formType.value || undefined)

const authStore = useAuthStore()
const isLogged = computed(() => authStore.isLogged)

onBeforeMount(() => {
  if (route.query.step) {
    const step = route.query.step as FormType
    type.value = step
  }
})

interface ModelType {
  school_id: string | null
}

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<ModelType>({
  school_id: '',
})
const rules: FormRules = {
  school_id: [
    {
      required: true,
      trigger: ['blur'],
      message: 'Student ID is required',
    },
    {
      pattern: /^\d{9}$/, // Regular expression for exactly 9 digits
      message: 'Student ID must be exactly 9 digits',
      trigger: ['blur'],
    },
  ],
}
interface ApiError {
  response?: {
    data?: {
      message?: string
      errors?: {
        [key: string]: string[]
      }
    }
  }
}

function signIn(e: Event) {
  e.preventDefault()
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      try {
        const response = await post('/api/signin', {
          school_id: model.value.school_id,
        })

        if (response.status === 200 && response.data.success) {
          router.push({ path: '/', replace: true, query: { school_id: model.value.school_id } })
        } else {
          message.error('Invalid credentials')
        }
      } catch (error) {
        console.error('Error occurred during sign in:', error)
        message.error('An error occurred during sign in. Please try again later.')
      }
    } else {
      message.error('Invalid credentials')
    }
  })
}

async function getVcode() {
  try {
    await formRef.value?.validate()
    if (model.value.school_id === null) return message.error('Student ID is required')
    const response = await post('/verify-student', {
      school_id: model.value.school_id,
    })
    if (response.status === 200) {
      message.success('A Verification code has been sent to your school email')
      router.push({ path: '/verify', query: { school_id: model.value.school_id } })
    } else {
      // Check for specific error messages
      if (response.data.errors) {
        const errors = response.data.errors
        if (errors.school_id) {
          message.error(errors.school_id[0])
        } else {
          message.error('An error occurred during verification code request.')
        }
      } else if (response.data.message === 'Another verification code cannot be generated.') {
        message.error('Another verification code cannot be generated at this time.')
      } else {
        message.error('An error occurred during verification code request.')
      }
    }
  } catch (error: unknown) {
    console.error('Error occurred during verification code request:', error)
    if (isApiError(error)) {
      const errorData = error.response?.data
      if (errorData?.message === 'Another verification code cannot be generated.') {
        message.error('Another verification code cannot be generated at this time.')
      } else {
        message.error('An error occurred during verification code request. Please try again later.')
      }
    } else {
      message.error('Kindly make sure you input your student ID correctly')
    }
  }
  function isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'response' in error
  }
}
</script>

<style lang="scss" scoped>
@import './main.scss';

.page-auth {
  .wrapper {
    .image-box {
      background-color: v-bind(activeColor);
    }
  }
}
.form-wrap {
  width: 100%;
  min-width: 270px;
  max-width: 400px;

  .logo {
    :deep(img) {
      max-height: 37px;
    }
  }

  .title {
    font-size: 36px;
    font-family: var(--font-family-display);
    line-height: 1.2;
    font-weight: 700;
  }

  .text {
    font-size: 18px;
    line-height: 1.3;
    color: var(--fg-secondary-color);
  }

  .social-btns {
    .b-icon {
      margin-right: 16px;

      img {
        display: block;
        height: 20px;
      }
    }
  }
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition:
    opacity 0.2s ease-in-out,
    transform 0.3s ease-in-out;
}

.form-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.form-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
