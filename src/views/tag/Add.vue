<template>
  <a-modal
    title="新增标签"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @ok="handleSubmit"
    @cancel="hide"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form">
        <a-form-item label="技术方向" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="java"
            v-decorator="['techName']">
            <a-select-option value="1">java</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="技能标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: rules.skillTagName}]"
            placeholder="请输入技能标签"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import TagApi from '@/api/tag'

export default {
  props: {
    toadd: {
      type: Object,
      default: function () {
        return {}
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
      rules: {
        skillTagName: [{ required: true, message: '技能标签不能为空' }, { max: 30, message: '最大长度不超过30字节' }]
      },
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    hide () {
      this.visible = false
      this.form.resetFields()
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.showLoading = true
      const validateFieldsKey = ['techName', 'name']
      validateFields(validateFieldsKey, (errors, values) => {
        if (!errors) {
          var addparams = { ...values }
          TagApi.add(addparams).then(res => {
            this.$emit('parentMethod')
            this.handleSuccess()
          })
        }
        this.showLoading = false
      })
    },
    handleSuccess () {
      this.visible = false
      // this.$emit('ok')
      this.form.resetFields()
    }
  }
}
</script>
