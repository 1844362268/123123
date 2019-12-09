<template>
  <a-modal
    class="am"
    title="编辑标签"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @ok="handleSubmit"
    @cancel="hide"
    :destroyOnClose="destroyOnClose"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form">
        <a-form-item style="display: none">
          <a-input type="hidden" v-decorator="['id']"></a-input>
        </a-form-item>
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
    toedit: {
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
      destroyOnClose: true,
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this)
    }
  },

  methods: {
    show (params) {
      this.visible = true
      // 编辑赋值
      var id = params.id
      var name = params.name
      var techName = params.techName
      var pp = { id, name, techName }
      if (pp) {
        this.$nextTick(() => {
          this.form.setFieldsValue(pp)
        })
      }
    },
    hide () {
      this.visible = false
      this.form.resetFields()
    },
    // 保存
    handleSubmit () {
      const { form: { validateFields } } = this
      this.showLoading = true
      const validateFieldsKey = ['id', 'name']
      validateFields(validateFieldsKey, (errors, values) => {
        if (!errors) {
          if (values.id) {
            TagApi.update(values).then(res => {
              this.$emit('parentMethod', this.toedit.pageNum)
              this.handleSuccess()
            })
          }
        }
        this.showLoading = false
      })
    },
    handleSuccess () {
      this.visible = false
      this.form.resetFields()
    }
  }
}
</script>
