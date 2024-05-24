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
          <div class="title mb-4">Welcome Back, Admin</div>
          <div class="text mb-12">Manage the BookLend system efficiently</div>
          <div class="form">
            <n-form ref="formRef" :model="model" :rules="rules">
              <n-form-item path="email" label="Email" class="mb-5">
                <n-input
                  v-model:value="model.email"
                  type="text"
                  @keydown.enter="login"
                  placeholder="admin@example.com"
                  size="large"
                  autocomplete="on"
                />
              </n-form-item>
              <n-form-item path="password" label="Password" class="mb-5">
                <n-input
                  v-model:value="model.password"
                  @keydown.enter="login"
                  type="password"
                  placeholder="******"
                  size="large"
                  autocomplete="on"
                />
              </n-form-item>
              <n-button type="primary" class="!w-full" @click="login" size="large" :loading="loading" :disabled="loading">
                Login as Admin
              </n-button>
            </n-form>
          </div>
          <div class="sign-text text-center mt-10">
            <div class="sign-text">
              Are you a Student?
              <n-button text @click="goToStudentLogin()" type="primary" size="large">Sign in as Student</n-button>
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
  email: string
  password: string
}

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<ModelType>({
  email: '',
  password: '',
})
const rules: FormRules = {
  email: [
    {
      required: true,
      trigger: ['blur'],
      message: 'Email is required',
    },
    {
      type: 'email',
      message: 'Please enter a valid email address',
      trigger: ['blur'],
    },
  ],
  password: [
    {
      required: true,
      trigger: ['blur'],
      message: 'Password is required',
    },
  ],
}

const images = ref([
  {
    url: 'https://www.nileuniversity.edu.ng/wp-content/uploads/2021/05/picture8.png',
    alt: 'Image 1',
  },
  {
    url: 'https://www.nileuniversity.edu.ng/wp-content/uploads/2021/05/picture5.png',
    alt: 'Image 2',
  },
  {
    url: 'https://www.nileuniversity.edu.ng/wp-content/uploads/2021/05/picture4.png',
    alt: 'Image 3',
  },
])

const currentSlide = ref(0)

function goToStudentLogin() {
  router.push({ path: '/student-login' })
}

async function login() {
  try {
    loading.value = true
    await formRef.value?.validate()
    const response = await userPost('/admin-login', {
      email: model.value.email,
      password: model.value.password,
    })
    if (response.status === 200) {
      localStorage.setItem('isLogged', 'true')
      localStorage.setItem('role', response.data.role)
      localStorage.setItem('accessToken', response.data.token)
      localStorage.setItem('AdminData', JSON.stringify(response.data.admin))
      message.success('Admin Logged In Successfully')
      router.push({ name: 'AdminDashboard', replace: true })
    } else {
      // Handle specific error messages
      if (response.data.errors) {
        const errors = response.data.errors
        Object.keys(errors).forEach((key) => {
          message.error(errors[key][0])
        })
      } else if (response.data.message === 'Invalid email or password.') {
        message.error('Invalid email or password.')
      } else {
        message.error('An error occurred during login.')
      }
    }
  } catch (error) {
    console.error('Error occurred during login:', error)
    message.error('An error occurred during login. Please try again later.')
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
