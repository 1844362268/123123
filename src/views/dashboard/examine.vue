<template>
  <a-card :bordered="false" class="acd">
    <a-form :form="form">
      <a-form-item style="display: none">
        <a-input type="hidden" v-decorator="['id']"></a-input>
      </a-form-item>
      <!-- 企业 -->
      <a-form-item label="企业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input type="text" disabled="disabled" :value="data.name"></a-input>
      </a-form-item>
      <!-- 联系方式 -->
      <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input disabled="disabled" :value="data.phone"></a-input>
      </a-form-item>
      <!-- 联系人 -->
      <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input disabled="disabled" :value="data.contact"></a-input>
      </a-form-item>
      <!-- 时间 -->
      <a-form-item label="试用期限" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-range-picker
          disabled="disabled"
          :value="[moment(this.data.trialStartTime, dateFormat), moment(this.data.trialEndTime, dateFormat)]"
          :format="dateFormat"
        ></a-range-picker>
      </a-form-item>
      <!-- 地址 -->
      <a-form-item label="企业地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea disabled="disabled" :value="data.address" :rows="4"></a-textarea>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button @click="handleCancel()">返回</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import EnterpriseApi from '@/api/enterprise.js'

import moment from 'moment'
export default {
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      uid: null,
      data: {},
      labelCol: {
        lg: { span: 7 },
        sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 10 },
        sm: { span: 17 }
      },
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.uid = this.$route.query.id
    EnterpriseApi.getAccount(this.uid)
      .then(res => {
        this.data = res.data
        return this.data
      })
      .catch(err => {
        alert(err)
      })
  },
  methods: {
    moment,
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
