<template>
  <a-modal
    :footer="null"
    title="修改登录密码"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @cancel="hide"
    wrapClassName="web"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form" class="af" >
        <a-form-item label="原登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            type="password"
            v-decorator="['password', {rules:[{ required: true, message: '密码不能为空' }]}]"
            placeholder="原登录密码"
          ></a-input>
        </a-form-item>
        <a-form-item label="新登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            type="password"
            autocomplete="false"
            placeholder="请输入6-20位数字、字母"
            v-decorator="['newPassWord', {rules: [{ required: true, message: '密码不能为空' },{ min:6,max: 20, message: '请输入6位以上数字或字母' }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
        <a-form-item label="确认登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            type="password"
            autocomplete="false"
            placeholder="确认密码"
            v-decorator="['newPassWord2', {rules: [{ validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
        <a-form-item class="btn">
          <a-button class="sbtn" @click.stop.prevent="handleSubmit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-spin>

  </a-modal>
</template>

<script>
import SetApi from '@/api/set'
export default {
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
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // 显示
    show (params) {
      this.visible = true
    },
    // 隐藏
    hide () {
      this.visible = false
      this.form.resetFields()
    },
    // 密码

    // 确认密码
    async handlePasswordCheck (rule, value, callback) {
      const password = await this.form.getFieldValue('newPassWord')
      if (!value) {
        callback(new Error('密码不能为空'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
        return false
      }
    },
    // 保存
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      const op = this.form.getFieldValue('password')
      const np = localStorage.getItem('sitePassword')
      if (op && op !== np) {
        this.$message.error('原密码不正确')
        return false
      }
      this.showLoading = true
      const validateFieldsKey = ['password', 'newPassWord', 'newPassWord2']
      validateFields(validateFieldsKey, (errors, values) => {
        if (!errors) {
          delete values.newPassWord2
          console.log(values)
          SetApi.reset(values)
            .then(res => {
              localStorage.removeItem('pro__Access-Token')
              localStorage.removeItem('sitePassword')
              localStorage.removeItem('siteName')
              this.$router.push('/user/login')
              this.handleSuccess()
            })
            .catch(err => this.requestFailed(err))
        }
        this.showLoading = false
      })
    },
    handleSuccess () {
      this.$message.success('修改成功', 1)
      this.visible = false
      this.form.resetFields()
    },
    requestFailed (err) {
      this.$message.error(err)
      this.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.web {
  .ant-modal-header {
    background: red;
    border-radius: 8px 8px 0px 0px;
    padding: 16px 269px;
  }
  .ant-modal-title {
    color: red;
    margin-left: 248px;
  }
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
.sbtn {
  width: 240px;
  height: 40px;
  background: rgba(0, 140, 251, 1);
  border-radius: 4px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
</style>
