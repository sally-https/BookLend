<template>
  <div class="page-auth">
    <Settings v-model:align="align" v-model:activeColor="activeColor" />

    <div class="flex wrapper justify-center">
      <div class="image-box basis-2/3" v-if="align === 'right'">
        <div class="image-slider">
          <div v-for="(image, index) in images" :key="index" :class="{ active: index === currentSlide }" class="image-slide">
            <div class="image-container">
              <img :src="image.url" :alt="image.alt" />
            </div>
          </div>
        </div>
      </div>
      <div class="form-box basis-1/3 flex items-center justify-center" :class="{ centered: align === 'center' }">
        <div class="form-wrap">
          <div class="title mb-4">Join BookLend</div>
          <div class="text mb-12">Borrow from the only Library you can trust📚</div>
          <div class="form">
            <n-form ref="formRef" :model="model" :rules="rules">
              <n-form-item path="studentId" label="Student ID" class="mb-2">
                <n-input
                  v-model:value="model.studentId"
                  type="text"
                  @keydown.enter="register"
                  placeholder="201212***"
                  size="large"
                  autocomplete="on"
                />
              </n-form-item>
              <n-form-item path="name" label="Name" class="mb-2">
                <n-input
                  v-model:value="model.name"
                  type="text"
                  @keydown.enter="register"
                  placeholder="John Doe"
                  size="large"
                  autocomplete="on"
                />
              </n-form-item>
              <n-form-item path="phone" label="Phone Number" class="mb-2">
                <n-input
                  v-model:value="model.phone"
                  type="text"
                  @keydown.enter="register"
                  placeholder="0123456789"
                  size="large"
                  autocomplete="on"
                />
              </n-form-item>
              <n-form-item path="password" label="Password" class="mb-2">
                <n-input
                  v-model:value="model.password"
                  @keydown.enter="register"
                  type="password"
                  placeholder="******"
                  size="large"
                  autocomplete="on"
                />
              </n-form-item>
              <n-button type="primary" class="!w-full" @click="register" size="large" :loading="loading" :disabled="loading">
                Register
              </n-button>
            </n-form>
          </div>
          <div class="sign-text text-center mt-10">
            <div class="sign-text">
              Already have an account?
              <n-button text @click="goToLogin()" type="primary" size="large">Login</n-button>
            </div>
          </div>
        </div>
      </div>
      <div class="image-box basis-2/3" v-if="align === 'left'">
        <div class="image-slider">
          <div v-for="(image, index) in images" :key="index" :class="{ active: index === currentSlide }" class="image-slide">
            <div class="image-container">
              <img :src="image.url" :alt="image.alt" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userPost } from '@/plugins/http'
import { type FormInst, useMessage, type FormRules, NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import Settings, { type Align } from '@/components/AuthForm/Settings.vue'
import { ref, onMounted } from 'vue'

const loading = ref(false)
const align = ref<Align>('left')
const activeColor = ref('')
interface ModelType {
  studentId: string
  name: string
  phone: string
  password: string
}

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<ModelType>({
  studentId: '',
  name: '',
  phone: '',
  password: '',
})
const rules: FormRules = {
  studentId: [
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
  name: [
    {
      required: true,
      trigger: ['blur'],
      message: 'Name is required',
    },
  ],
  phone: [
    {
      required: true,
      trigger: ['blur'],
      message: 'Phone Number is required',
    },
  ],
  password: [
    {
      required: true,
      trigger: ['blur'],
      message: 'Password is required',
    },
    {
      min: 8,
      message: 'Password must be at least 8 characters',
      trigger: ['blur'],
    },
  ],
}

const images = ref([
  {
    url: 'https://www.nileuniversity.edu.ng/wp-content/uploads/2021/05/picture5.png',
    alt: 'Image 1',
  },
  {
    url: 'https://www.nileuniversity.edu.ng/wp-content/uploads/2021/05/picture4.png',
    alt: 'Image 2',
  },
  {
    url: 'https://www.nileuniversity.edu.ng/wp-content/uploads/2021/05/picture8.png',
    alt: 'Image 3',
  },
])

const currentSlide = ref(0)

function goToLogin() {
  router.push({ path: '/login' })
}

async function register() {
  try {
    loading.value = true
    await formRef.value?.validate()
    const response = await userPost('/student-register', {
      student_id: model.value.studentId,
      name: model.value.name,
      phone: model.value.phone,
      password: model.value.password,
    })
    if (response.status === 200) {
      localStorage.setItem('isLogged', 'true')
      localStorage.setItem('role', response.data.role)
      localStorage.setItem('accessToken', response.data.token)
      localStorage.setItem('StudentData', JSON.stringify(response.data.student))
      message.success('User Registered Successfully')
      router.push({ name: 'StudentDashboard', replace: true })
    } else {
      // Handle specific error messages
      if (response.data.errors) {
        const errors = response.data.errors
        Object.keys(errors).forEach((key) => {
          message.error(errors[key][0])
        })
      } else {
        message.error('An error occurred during registration.')
      }
    }
  } catch (error) {
    console.error('Error occurred during registration:', error)
    message.error('An error occurred during registration. Please try again later.')
  } finally {
    loading.value = false
  }
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % images.value.length
}

onMounted(() => {
  setInterval(nextSlide, 3000) // Change slide every 3 seconds
})
</script>

<style lang="scss" scoped>
@import './main.scss';

.page-auth {
  height: 100vh;

  .wrapper {
    height: 100%;

    .form-box {
      padding: 2rem;
    }

    .image-box {
      position: relative;
      overflow: hidden;

      .image-slider {
        height: 100%;

        .image-slide {
          height: 100%;
          display: none;

          &.active {
            display: block;
          }

          .image-container {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
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
}
</style>
