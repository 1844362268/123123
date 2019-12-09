<template>
  <a-card :bordered="false" class="acd">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item style="display: none">
        <a-input type="hidden" v-decorator="['id']"></a-input>
      </a-form-item>
      <!-- 企业 -->
      <a-form-item label="企业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-decorator="['name', {rules: rules.name},]" placeholder="请输入企业名称"></a-input>
      </a-form-item>
      <!-- 联系方式 -->
      <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-decorator="['phone', {rules: rules.phone}]" placeholder="联系方式即为登录账号"></a-input>
      </a-form-item>
      <!-- 联系人 -->
      <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-decorator="['contact', {rules: rules.contact}]" placeholder="请输入联系人"></a-input>
      </a-form-item>
      <!-- 时间 -->
      <a-form-item label="试用期限" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-range-picker v-decorator="['date', {rules: rules.date}]" :format="dateFormat" />
      </a-form-item>
      <!-- 地址 -->
      <a-form-item label="企业地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea
          v-decorator="['address', {rules: rules.adress}]"
          placeholder="请输入企业详细地址"
          :rows="4"
        ></a-textarea>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button @click="handleCancel()">取消</a-button>
        <a-button style="margin-left: 8px" htmlType="submit" type="primary">保存</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import SingleUpload from '@/components/Upload/SingleUpload'
import EnterpriseApi from '@/api/enterprise.js'

import moment from 'moment'
export default {
  components: {
    SingleUpload
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      data: {},
      labelCol: {
        lg: { span: 7 },
        sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 10 },
        sm: { span: 17 }
      },
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
  created () {
    this.uid = this.$route.query.id
    EnterpriseApi.getAccount(this.uid)
      .then(res => {
        this.data = res.data
        // console.log(this.data)
        this.form.setFieldsValue({
          id: this.data.id,
          name: this.data.name,
          phone: this.data.phone,
          contact: this.data.contact,
          date: [moment(this.data.trialStartTime, this.dateFormat), moment(this.data.trialEndTime, this.dateFormat)],
          address: this.data.address
        })
        return this.data
      })
      .catch(err => {
        alert(err)
      })
  },

  methods: {
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this

      const validateFieldsKey = ['name', 'phone', 'contact', 'date', 'address', 'id']
      // console.log(this.uid)
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const addParams = { ...values }
          console.log(addParams)
          var trialStartTime = addParams.date[0].format('YYYY-MM-DD')
          var trialEndTime = addParams.date[1].format('YYYY-MM-DD')
          EnterpriseApi.updateAccount({ ...addParams, trialStartTime, trialEndTime })
            .then(res => {
              this.$message.success('修改成功')
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
.acd {
  height: 700px;
}
.ant-card-body {
  padding-top: 5% !important;
}
</style>
