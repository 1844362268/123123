<template>
  <a-modal
    title="查看标签"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @cancel="hide"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form">
        <a-form-item style="display: none">
          <a-input type="hidden" v-decorator="['id']"></a-input>
        </a-form-item>
        <a-form-item label="技术方向" :labelCol="labelCol" :wrapperCol="wrapperCol">

          <a-input
            disabled
            v-decorator="['techName']"
          >java开发</a-input>

        </a-form-item>
        <a-form-item label="技能标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            disabled
            v-decorator="['name']"
            placeholder="请输入技能标签"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import TagApi from '@/api/tag'

export default {
  data () {
    return {
      data: {},
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
    }

  }
}
</script>
