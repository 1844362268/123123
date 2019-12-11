<template>
  <div class="wp">
    <div class="fu">
      <div class="dr">
        <img src="../../assets/622f0b9d779fcf120df98862767e515ad215853732e0f-jEMbeM_fw658.png" alt />
      </div>
      <div class="dl">
        <div class="du">
          <img src="../../assets/logo.png" alt />
          <p>企业云笔试运营平台</p>
        </div>
        <div class="dw">
          <a-form
            id="formLogin"
            class="user-layout-login"
            ref="formLogin"
            :form="form"
            @submit="handleSubmit"
          >
            <a-alert
              v-if="isLoginError"
              type="error"
              showIcon
              style="margin-bottom: 24px;"
              message="账户或密码错误"
            />
            <a-form-item class="af1">
              <a-input
                size="large"
                type="text"
                placeholder="账户: jeffie9"
                v-decorator="[
                  'username',
                  {rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }],
                   validateTrigger: 'change'}
                ]"
              >
                <user-icon type="iconxingzhuang6" slot="prefix" />
              </a-input>
            </a-form-item>

            <a-form-item class="af2">
              <a-input
                size="large"
                type="password"
                autocomplete="false"
                placeholder="密码: 123456"
                v-decorator="[
                  'password',
                  {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
                ]"
              >
                <user-icon type="iconxingzhuang9" slot="prefix" />
              </a-input>
            </a-form-item>

            <a-form-item class="che">
              <a-checkbox v-decorator="['rememberMe']" :checked="checked" @change="onChange" >记住密码</a-checkbox>
            </a-form-item>

            <a-form-item class="login-button">
              <a-button
                size="large"
                type="primary"
                htmlType="submit"
                style="width:100%"
                :loading="state.loginBtn"
                :disabled="state.loginBtn"
              >登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  data () {
    return {
      checked: true,
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0
      }
    }
  },
  created () {
    if (localStorage.getItem('remember')) {
      this.checked = true
    }
  },
  mounted () {
    this.getlocalStorage()
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    onChange (e) {
      this.checked = e.target.checked
    },
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password', 'rememberMe']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password
          Login(loginParams)
            .then(res => {
              console.log(loginParams)
              if (loginParams.rememberMe === true || loginParams.rememberMe === undefined) {
                this.setlocalStorage(loginParams.name, loginParams.password, loginParams.remember)
              } else {

              }
              this.loginSuccess(res)
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    setlocalStorage (name, pwd, reb) {
      localStorage.siteName = name
      localStorage.sitePassword = pwd
      localStorage.remember = reb
    },
    getlocalStorage () {
      this.form.setFieldsValue({
        username: localStorage.getItem('siteName'),
        password: localStorage.getItem('sitePassword')
      })
    },
    // rememberMe () {
    //   if (this.form.getFieldsValue('rememberMe') !== false) {
    //     this.getlocalStorage()
    //   } else {
    //     this.form.resetFields()
    //   }
    // },
    loginSuccess (res) {
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }

  }
}
</script>

<style lang="less" scoped>
.wp {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url(../../assets/dcc7da51ba557bc2fb1f8affd1778f2.png) no-repeat center / cover;
  .fu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: #ffffff;
    width: 56%;
    height: 68%;
    box-shadow: 0px 0px 35px 0px rgba(214, 214, 214, 0.75);
  }
  .warning {
    position: absolute;
    left: 50%;
    top: 2%;
    float: left;
  }
  .dr {
    float: left;
    width: 48%;
    height: 100%;
    position: relative;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 100%;
    }
  }
  .dl {
    padding-left: 3%;
    padding-right: 7%;
    margin-top: 5%;
    float: right;
    width: 50%;
    .du {
      margin-top: -10px;
      margin-bottom: 40px;
      position: relative;
      p {
        margin-bottom: 50px;
      }
      img {
        margin-left: 60%;
        margin-bottom: 10%;
        margin-top: -5%;
        left: 48%;
        width: 50%;
      }
      p {
        text-align: center;
        color: #222;
        font-size: 18px;
      }
    }

    .dw {
      margin-top: -20px;
    }
    .af1 {
      margin-top: -20px;
    }
    .af2 {
      margin-bottom: 10px;
    }
    .che {
      margin-top: -10px;
      margin-left: 10px;
    }
    // .login-button {
    //   margin-top: -20px;
    // }
  }
}
</style>
