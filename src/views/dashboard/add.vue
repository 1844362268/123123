<template>
  <a-card :bordered="false" class="acd">
    <a-spin :spinning="showLoading">
      <a-form :form="form" @submit="handleSubmit" >

        <a-form-item style="display: none">
          <a-input type="hidden" v-decorator="['id']"></a-input>
        </a-form-item>
        <!-- 企业 -->
        <a-form-item label="企业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: rules.name}]"
            placeholder="请输入企业名称"></a-input>
        </a-form-item>
        <!-- 联系方式 -->
        <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['phone', {rules: rules.phone}]"
            placeholder="联系方式即为登录账号">
          </a-input>
        </a-form-item>
        <!-- 联系人 -->
        <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['contact', {rules: rules.contact}]"
            placeholder="请输入联系人">
          </a-input>
        </a-form-item>
        <!-- 时间 -->
        <a-form-item label="试用期限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker
            v-decorator="['date', {rules: rules.date}]"
            :format="dateFormat"
          />
        </a-form-item>
        <!-- 地址 -->
        <a-form-item label="企业地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="['address', {rules: rules.address}]"
            placeholder="请输入企业详细地址"
            :rows="4"></a-textarea>
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button @click="handleCancel()">取消</a-button>
          <a-button style="margin-left: 8px" htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>

import SingleUpload from '@/components/Upload/SingleUpload'
// import RoleApi from '@/api/role'
import EnterpriseApi from '@/api/enterprise.js'
// eslint-disable-next-line no-unused-vars
import pick from 'lodash.pick'
// import PageHeader from '@/components/PageHeader'
// import moment from 'moment'
// const phoneRegx = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/

export default {
  components: {
    SingleUpload
  },
  data () {
    // const id = this.$route.query.id
    return {
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      roles: [],
      labelCol: {
        lg: { span: 7 }, sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 10 }, sm: { span: 17 }
      },
      showLoading: false,
      rules: {
        name: [{ required: true, message: '用户名不能为空' }, { max: 30, message: '最大长度不超过30字节' }],
        phone: [{ required: true, message: '请输入联系方式' }],
        contact: [{ required: true, message: '请输入正确的手机号' }],
        date: [{ required: true, message: '请选择试用期限' }],
        address: [{ required: true, max: 100, message: '请输入企业详细地址' }]
      },
      form: this.$form.createForm(this)
    }
  },

  methods: {
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this
      this.showLoading = true
      const validateFieldsKey = ['name', 'phone', 'contact', 'date', 'address']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const addParams = { ...values }
          // console.log(addParams)
          var trialStartTime = addParams.date[0].format('YYYY-MM-DD')
          var trialEndTime = addParams.date[1].format('YYYY-MM-DD')
          const addp = { ...addParams, trialStartTime, trialEndTime }
          EnterpriseApi.addAccount(addp)
            .then(res => {
              console.log(res)
              this.showLoading = false
              this.$message.success('添加用户成功')
              this.$router.push('/dashboard')
            })
            .catch(err => alert(err))
        }
      })
    },
    handleCancel () {
      this.$router.go(-1)
    }
  }
}
</script>
<style>
.acd{
  height: 700px;
}
.ant-card-body{
padding-top: 5% !important;
}
</style>
