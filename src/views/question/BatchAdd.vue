<template>
  <a-card :bordered="false" class="batch-add">
    <a-row>
      <a-col offset="6" :md="12" style="margin-top: 30px">
        <a-steps class="import-steps" :current="current" style="width: 100%">
          <a-step>
            <!-- <span slot="title">Finished</span> -->
            <template slot="title">
              上传文件
            </template>
            <!--
                    <span slot="description">上传文件</span>
            -->
          </a-step>
          <a-step title="执行导入"/>
          <a-step title="完成导入"/>
        </a-steps>
      </a-col>
    </a-row>

    <a-row>
      <a-col offset="4" :md="16">
        <div class="steps-content">
          <!--step1-->
          <div v-show="current==0" class="steps-content-item">

            <div class="item-wrap">
              <div style="width: 150px;height: 150px;background: rgba(245,245,245,1);padding: 40px; flex-shrink:0;">
                <svg class="icon" aria-hidden="true" style="width: 100%;height: 100%">
                  <use xlink:href="#iconxingzhuang10"></use>
                </svg>
              </div>
              <div class="description">
                <div style="padding-left: 20px;padding-right: 20px">
                  <h4>请填写信息表</h4>
                  <p>请按照预设模板的格式进行试题导入，保证所有单元格均为文本格式，为防止解析出错，不同题型请放入不同单 元簿中题目描述、选项、答案皆为必填。</p>
                  <a href="/demo.xlsx" target="_blank">下载模版</a>
                </div>
              </div>
            </div>

            <div class="item-wrap">
              <div style="width: 150px;height: 150px;background: rgba(245,245,245,1);padding: 40px;flex-shrink:0;">
                <svg class="icon" aria-hidden="true" style="width: 100%;height: 100%">
                  <use xlink:href="#iconxingzhuangkaobei"></use>
                </svg>
              </div>
              <div class="description">
                <div style="padding-left: 20px;padding-right: 20px">
                  <h4>请填写信息表</h4>
                  <p>文件后缀名必须为xls 或xlsx （即Excel格式），文件大小不得大于10M</p>
                  <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
                    <a-button type="link" style="padding: 0px"> 上传文件</a-button>
                  </a-upload>
                </div>
              </div>
            </div>

          </div>

          <!--step2-->
          <div v-show="current==1" class="steps-content-item">

            <div class="item-wrap">
              <div style="width: 150px;height: 150px;background: rgba(245,245,245,1);padding: 40px">
                <svg class="icon" aria-hidden="true" style="width: 100%;height: 100%">
                  <use xlink:href="#iconxingzhuang10"></use>
                </svg>
              </div>
              <div class="description">
                <div style="padding-left: 20px;padding-right: 20px">
                  <h4>本次可导入试题数量</h4>
                  <p style="color:#1b9aee;">{{ success }}</p>
                </div>
              </div>
            </div>

            <div class="item-wrap">
              <div style="width: 150px;height: 150px;background: rgba(245,245,245,1);padding: 40px">
                <svg class="icon" aria-hidden="true" style="width: 100%;height: 100%">
                  <use xlink:href="#iconxingzhuangkaobei"></use>
                </svg>
              </div>
              <div class="description">
                <div style="padding-left: 20px;padding-right: 20px">
                  <h4>本次不可导入试题数量</h4>
                  <p style="color:#1b9aee;">{{ fail }}</p>
                </div>
              </div>
            </div>

          </div>

          <!--step3-->
          <div v-show="current==2" style="margin: auto;display: block;text-align: center">
            <a-icon type="check-circle"style="color: rgb(45,255,89);font-size: 90px;margin-top: 60px" theme="filled" />
            <p style="font-size: 22px;font-weight: bold;margin-top: 20px;margin-bottom: 40px;text-align: center">批量导入成功</p>
          </div>
        </div>
        <div class="steps-action">
          <!--          <a-button v-if="current < 0" type="primary" @click="prev">
            取消
          </a-button>-->
          <a-button v-if="current==1" style="margin-right: 8px" @click="prev">
            取消
          </a-button>
          <a-button
            v-if="current < steps.length - 1"
            type="primary"
            @click="next"
            :loading="uploading"
          >
            下一步
          </a-button>
          <a-button
            v-if="current == steps.length - 1"
            type="primary"
            @click="finish"
          >
            完成
          </a-button>

        </div>

        <a-row v-show="current==1" style="margin-top: 30px">
          <a-card title="上传失败试题">
            <a href="#" slot="extra">
              <a-button type="primary">下载</a-button>
            </a>

            <a-table
              ref="table"
              rowKey="id"
              :columns="columns"
              :dataSource="data"
              showPagination="false"
            >
            </a-table>

          </a-card>
        </a-row>

      </a-col>

    </a-row>

  </a-card>
</template>

<script>

import SingleUpload from '@/components/Upload/SingleUpload'
import RoleApi from '@/api/role'
import QuestionApi from '@/api/question'
import DownLoadSvg from '@/assets/icons/download.svg'
import UploadSvg from '@/assets/icons/upload.svg'
import { STable } from '@/components'

import pick from 'lodash.pick'

(function () {
  if (!window.JSON) {
    document.write('<scr' + 'ipt src="http://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"><\/scr' + 'ipt>')
  }
}())

const phoneRegx = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/

export default {
  components: {
    SingleUpload,
    DownLoadSvg,
    UploadSvg,
    STable

  },
  data () {
    const id = this.$route.query.id
    return {
      fileList: [],
      uploading: false,
      current: 1,
      steps: [1, 2, 3],
      id: id,
      placeholder: id ? '不填写则使用原来密码' : '请输入密码',
      roles: [],
      labelCol: {
        lg: { span: 7 }, sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 10 }, sm: { span: 17 }
      },
      rules: {
        name: [{ required: true, message: '用户名不能为空' }, { max: 30, message: '最大长度不超过30字节' }],
        password: [{ required: !id, message: '请输入密码' }],
        phone: [{ pattern: phoneRegx, message: '请输入正确的手机号' }],
        roleId: [{ required: true, message: '角色不能为空' }],
        remark: [{ max: 100, message: '最大长度不超过100字节' }]
      },
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/user/upload',
      questionUploadUrl: process.env.VUE_APP_API_BASE_URL + 'question/upload',
      form: this.$form.createForm(this),
      headers: {},
      success: 0,
      fail: 0,
      data: [],
      loadData: () => {
        return this.data
      },
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '题目类型',
          dataIndex: 'type'
        },
        {
          title: '试题位置',
          dataIndex: 'rowNum'
        },
        {
          title: '题干信息',
          dataIndex: 'content'
        },
        {
          title: '错误提示',
          dataIndex: 'errors'
        }
      ]
    }
  },
  created () {
    this.headers.Authorization = 'BearereyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1NzU3NDcxMTgsInN1YiI6ImplZmZpZTkiLCJjcmVhdGVkIjoxNTc1NzExMTE4NzMzfQ.SM_3WJ5m0Hs2UCKPCnZT6p2LH9eZHq_7jgqyr2wUfQgrIj_LUA8AX80RkYJ7KgtIwR93imQ4C2jGCnSSzItgjg'

    this.$nextTick(() => {
      // 角色列表
      RoleApi.getList().then(res => {
        this.roles = res.data
      })
      // 用户编辑数据获取
      if (this.id) {
        AccountApi.getAccount(this.id).then(res => {
          this.form.setFieldsValue(res.data)
        })
      }
    })
  },
  methods: {
    finish () {
      this.$message.success('上传成功!')
      this.$router.go(-1)
    },
    refresh () {
      this.$refs.table.refresh()
    },
    next () {
      if (this.current == 0) {
        this.handleUpload()
      }
      if (this.current == 1) {
        this.current = 2
      }
    },
    prev () {
      this.current--
    },
    handleUpload () {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      this.uploading = true
      const config = {
        // 添加请求头
        headers: { 'Content-Type': 'multipart/form-data' },
        // 添加上传进度监听事件
        onUploadProgress: e => {
          var completeProgress = ((e.loaded / e.total * 100) | 0) + '%'
          this.progress = completeProgress
        }
      }

      const self = this
      this.axios.post('http://106.13.26.82/question/upload', formData, config).then(function (res) {
        self.current++
        self.uploading = false

        self.success = res.data.success
        self.fail = res.data.fail
        self.data = res.data.questionErrorBos
      })

      // You can use any AJAX library you like
      /* reqwest({
          url: 'http://106.13.26.82/question/upload',
          method: 'post',
          processData: false,
          data: formData,
          success: () => {
            this.fileList = [];
            this.uploading = false;
            this.$message.success('upload successfully.');
          },
          error: () => {
            this.uploading = false;
            this.$message.error('upload failed.');
          },
        }); */
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleChange (info) {
      if (info.file.status == 'done') {
        console.log('答案')

        info.fileList.map(item => {
          console.log(item.response)
        })

        return
      }

      //    console.log(info)
      //    console.log(info.event)
      let fileList = [...info.fileList]

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2)

      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        return file
      })

      this.fileList = fileList
    },
    handleSubmit (e) {
      e.preventDefault()

      const data = {
        'skill': 1,
        'type': 1,
        'title': '—&&&&&&—测试',
        'level': 1,
        'questionSkillTags': [ // 标签ID
          {
            'tagId': 1
          },
          {
            'tagId': 2
          }
        ],
        'questionDetails': [ // 选项ID
          {
            'content': '选项1',
            'isAnswer': 0
          },
          {
            'content': '选项2',
            'isAnswer': 0
          },
          {
            'content': '正确选项',
            'isAnswer': 1
          }
        ]
      }

      QuestionApi.addQuestion(data).then(res => {
        console.log(res)
      })

      return

      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.id) {
            AccountApi.addAccount(values).then(res => {
              this.$message.success('添加用户成功')
              this.$router.push('/account')
            })
          } else {
            AccountApi.updateAccount(values).then(res => {
              this.$message.success('修改用户成功')
              this.$router.push('/account')
            })
          }
        }
      })
    },
    handleCancel () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
  .batch-add {
    .steps-content {
      margin-top: 40px;
      display: flex;
      align-items: center;
      width: 100%;
      flex-wrap: nowrap;
      .steps-content-item {
        width: 100%;
        margin-top: 10px;
      }

      .item-wrap {
        display: flex;
        border: 1px solid #DADADA;
        margin-top: 40px;

        .description {
          display: flex;
          align-items: center;
          line-height: 1.3;
        }
      }
    }

    .steps-action{
      display: flex;
      margin: 20px;
      align-items: center;
      justify-content: center;
    }

    .import-steps{
      .ant-steps-item-process .ant-steps-item-icon>.ant-steps-icon{
        color: white;
      }
    }

  }
</style>
