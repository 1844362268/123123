<template>
  <a-modal
    :footer="null"
    title="修改手机号"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @cancel="hide"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form" class="af" >
        <!-- 旧手机号 -->
        <a-form-item label="原手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span v-decorator="['phone']">{{ phoenNumber }}</span>
          <br />
          <a-button
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            class="getCaptcha1"
            :disabled="state1.smsSendBtn"
            @click.stop.prevent="getCaptcha1"
            v-text="!state1.smsSendBtn && '获取验证码'||(state1.time+' s后重新发送')"></a-button>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item label="验证码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['captcha',{rules: [{ required: true,len:6, message: '请输入六位数字验证码' },{ validator: this.codeCheck1 }], validateTrigger: 'blur'} ]"
            placeholder="请输入验证码"></a-input>
        </a-form-item>
        <!-- 新手机号 -->
        <a-form-item label="新手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['newPhone', {rules:[{ required: true, len: 11, message: '请输入正确的手机号' }, { validateTrigger: ['change', 'blur'] }]}]" placeholder="请输入手机号"></a-input>
          <a-button
            class="getCaptcha2"
            :disabled="state2.smsSendBtn"
            @click.stop.prevent="getCaptcha2"
            v-text="!state2.smsSendBtn && '获取验证码'||(state2.time+' s后重新发送')"></a-button>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item label="验证码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['newCaptcha',{rules: [{ required: true,len:6, message: '请输入六位数字验证码' },{ validator: this.codeCheck2 }], validateTrigger: 'blur'}]" placeholder="请输入验证码"></a-input>
        </a-form-item>
        <!-- 提交 -->
        <a-form-item class="btn" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-button class="btn2" @click.stop.prevent="handleSubmit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import SetApi from '@/api/set'

export default {
  props: {
    tophone: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      state1: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      state2: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      tel: '',
      phoenNumber: '',
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this)
    }
  },

  methods: {
    show (params) {
      this.visible = true
      // 编辑赋值
      var tel = this.tophone
      tel = '' + tel
      var reg = /^(\d{3})\d*(\d{4})$/
      var tel1 = tel.replace(reg, '$1****$2')
      this.phoenNumber = tel1
    },
    hide () {
      this.visible = false
      this.form.resetFields()
    },
    // 验证码
    getCaptcha1 (e) {
      e.preventDefault()
      const { form: { validateFields }, state1 } = this
      this.form.setFieldsValue({
        phone: this.tophone
      })
      const validateFieldsKey = ['phone']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          state1.smsSendBtn = true
          console.log(values)
          SetApi.getCaptcha(values)
            .then(res => {
              console.log(res)
              this.$message.success('已发送验证码到' + `${this.phoenNumber}`)
            })
            .catch(err => console.log(err))
          const interval1 = window.setInterval(() => {
            if (state1.time-- <= 0) {
              state1.time = 60
              state1.smsSendBtn = false
              window.clearInterval(interval1)
            }
          }, 1000)
        }
      }
      )
    },
    async codeCheck1 (rule, value, callback) {
      if (value) {
        const params = { phone: `${this.tophone}`, captcha: value }
        // console.log(params)
        await SetApi.checkDate(params)
          .then(res => {
            console.log(res)
            // this.$message.success('验证码正确')
          })
          .catch(err => {
            console.log(err)
            callback(new Error('验证码错误'))
            // this.requestFailed(err)
          })
      }
    },
    getCaptcha2 (e) {
      e.preventDefault()
      const { form: { validateFields }, state2 } = this
      validateFields(['newPhone'], { force: true }, (err, values) => {
        if (!err) {
          const code = { phone: values.newPhone }
          console.log(code)
          state2.smsSendBtn = true
          SetApi.getCaptcha(code)
            .then(res => {
              console.log(res)
              this.$message.success('已发送验证码到' + `${values.newPhone}`)
            })
            .catch(err => console.log(err))
          const interval2 = window.setInterval(() => {
            if (state2.time-- <= 0) {
              state2.time = 60
              state2.smsSendBtn = false
              window.clearInterval(interval2)
            }
          }, 1000)
        }
      }
      )
    },
    async codeCheck2 (rule, value, callback) {
      if (value) {
        const phone = this.form.getFieldValue('newPhone')
        const params = { phone: phone, captcha: value }
        console.log(params)
        await SetApi.checkDate(params)
          .then(res => {
            // this.$message.success('验证码正确')
          })
          .catch(err => {
            console.log(err)
            callback(new Error('验证码错误'))
          })
      }
    },
    // 提交
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      // this.showLoading = true
      this.form.setFieldsValue({
        phone: this.tophone
      })
      const validateFieldsKey = ['phone', 'captcha', 'newPhone', 'newCaptcha']
      validateFields(validateFieldsKey, (errors, values) => {
        if (!errors) {
          console.log(values)
          SetApi.upDate(values)
            .then(res => {
              console.log(res)
              this.$emit('parentMethod')
              this.handleSuccess()
            })
            .catch(err => console.log(err))
        }
      })
    },
    handleSuccess () {
      this.$message.success('修改成功', 1)
      localStorage.removeItem('siteName')
      localStorage.removeItem('sitePassword')
      this.visible = false

      this.form.resetFields()
    }
    // requestFailed (err) {
    //   this.$notification['error']({
    //     message: '错误',
    //     description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
    //     duration: 1
    //   })
    // }
  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 10px;
}
.af {
  position: relative;
  padding-bottom: 100px;
}
.btn {
  position: absolute;
  bottom: 1%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.btn2 {
  width: 240px;
  height: 40px;
  background: rgba(0, 140, 251, 1);
  border-radius: 4px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}

.getCaptcha1 {
      width: 128px;
      height: 32px;
      display: block;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(205, 205, 205, 1);
      border-radius: 4px;
    }
.getCaptcha2 {
      width: 128px;
      height: 32px;
      display: block;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(205, 205, 205, 1);
      border-radius: 4px;
    }
</style>
