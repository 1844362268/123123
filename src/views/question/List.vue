<template>
  <div class="question-list">
    <a-card class="button-card" style="display: flex;flex-direction: row-reverse;background: #f0f2f5;border:0px;padding:0px">

      <a-button style="margin-right: 10px" size="large" type="default" @click="handleBatchAdd()">批量导入</a-button>
      <a-button type="primary" size="large" @click="handleAdd()">导入试题</a-button>

    </a-card>

    <a-card :bordered="false">
      <a-form class="select-form">
        <a-form-item label="技术方向:" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group @change="onChange" v-model="queryParam.skill">
            <a-radio-button class="select-btn" :value="item.id" v-for="item in skills">{{ item.name }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="技能标签:" :labelCol="labelCol" :wrapperCol="wrapperCol" class="selext-box">
          <div>
            <a-radio-button
              :class="{'ant-radio-button-wrapper-checked': skillTagIds.indexOf(item.id)>-1 }"
              @click="checkBoxClick(item)"
              class="select-btn "
              :value="item.id"
              v-for="item in skillTags">{{ item.name }}
            </a-radio-button>
          </div>
        </a-form-item>

        <a-form-item label="题型:" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group @change="onChange" v-model="queryParam.type">
            <a-radio-button class="select-btn" :value="item.id" v-for="item in questionTypes">{{ item.name }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="难度系数:" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group @change="onChange" v-model="queryParam.level">
            <a-radio-button class="select-btn" :value="item.id" v-for="item in levels">{{ item.name }}</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-row>

        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <s-list
        class=""
        ref="table"
        rowKey="id"
        :data="loadData"
        showPagination="auto">
        <span slot-scope="text, record">
          <template>
            <div style="background:rgba(250,250,250,1);padding: 24px;32px">
              <h4>
                {{ record.type | typeFormat }}{{ record.title }}
              </h4>
            </div>
            <a-card hoverable style="width: 100%" class="question-list-card">
              <a-list itemLayout="horizontal" :dataSource="record.questionDetails">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <p class="select-p">
                    <span class="select-span active" v-show="item.isAnswer">{{ selectLetters[index] }}.</span>
                    <span class="select-span" v-show="!item.isAnswer">{{ selectLetters[index] }}.</span>
                    {{ item.content }}</p>
                </a-list-item>
                <a-row>
                  <a-col :md="16">

                  </a-col>
                  <a-col :md="8"></a-col>
                </a-row>
              </a-list>
              <template class="ant-card-actions" slot="actions">

                <p> 技术方向：<!--{{record.skill}}--> java</p>
                <p> 技能标签：<span v-for="tag in record.questionSkillTags">{{ tag.tagName }};</span></p>
                <p> 组卷次数：{{ record.usedNum }}次</p>
                <p> 难度系数：{{ record.level | levelFormat }}</p>
                <p> </p>
                <p style="display: flex;">
                  <a style="color: #1b9aee" @click="handleEdit(record)">编辑</a>
                  <a style=" margin-left: 10px;color: #1b9aee" @click="handleDelete(record)">删除</a>
                </p>
              </template>
            </a-card>
          </template>
        </span>
      </s-list>
    </a-card>
  </div>
</template>

<script>
import { SList } from '@/components'
import AccountApi from '@/api/account'
import QuestionApi from '@/api/question'

let vm = {}
export default {
  name: 'TableList',
  components: {
    SList
  },
  data () {
    vm = this
    return {
      labelCol: {
        lg: { span: 2 }, md: { span: 3 }, sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 22 }, md: { span: 21 }, sm: { span: 17 }
      },
      skills: [
        { name: '全部', id: null },
        { name: 'Java开发', id: 1 }
      ],
      skillTags: [
        { name: '全部', id: null }
      ],
      skillTagIds: [],
      questionTypes: [
        { name: '全部', id: null },
        { name: '单选题', id: 1 },
        { name: '多选题', id: 2 },
        { name: '问答题', id: 3 },
        { name: '编程题', id: 4 }
      ],
      levels: [
        { name: '全部', id: null },
        { name: '易', id: 1 },
        { name: '偏易', id: 2 },
        { name: '适中', id: 3 },
        { name: '偏难', id: 4 },
        { name: '难', id: 5 }
      ],
      selectLetters: [
        'A',
        'B',
        'C',
        'D'
      ],
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return QuestionApi.getQuestions(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      }
    }
  },
  filters: {
    typeFormat: function (value) {
      const type = _.findIndex(vm.questionTypes, ['id', value])
      return '[' + vm.questionTypes[type].name + ']'
    },
    levelFormat: function (value) {
      const type = _.findIndex(vm.levels, ['id', value])
      return vm.levels[type].name
    }
  },
  methods: {
    getSkillTags () {
      const params = {}
      params.pageNum = 1
      params.pageSize = 9999
      QuestionApi.getSkillTags(params).then(function (res) {
        vm.skillTags = vm.skillTags.concat(res.data.list)
      })
    },
    checkBoxClick (item) {
      const id = item.id
      console.log('id')
      console.log(id)
      if (id == null) {
        const ids = []
        for (let i = 0; i < this.skillTags.length; i++) {
          if (this.skillTags[i].id != null) {
            ids.push(this.skillTags[i].id)
          }
        }
        this.queryParam.skillTagIds = ids.join(',')
        this.skillTagIds = [null]
      } else {
        for (let i = 0; i < this.skillTagIds.length; i++) {
          if (this.skillTagIds[i] == null) {
            this.skillTagIds.splice(i, 1)
          }
        }
        console.log('this.skillTagIds')

        console.log(this.skillTagIds)

        const index = this.skillTagIds.indexOf(item.id)
        if (index > -1) {
          this.skillTagIds.splice(index, 1)
        } else {
          this.skillTagIds.push(item.id)
        }
        this.queryParam.skillTagIds = this.skillTagIds.join(',')
      }

      this.onChange()
    },
    onChange () {
      this.refresh()
    },
    handleAdd () {
      this.$router.push('question/add')
    },
    handleBatchAdd () {
      this.$router.push('question/BatchAdd')
    },
    handleEdit (record) {
      this.$router.push({ path: 'question/add', query: { id: record.id } })
    },
    handleDelete (record) {
      QuestionApi.deleteQuestion(record.id).then(res => {
        this.$message.success('删除成功')
        this.refresh()
      })
    },
    refresh () {
      this.$refs.table.refresh()
    },
    reset () {
      this.queryParam = {}
      this.$refs.table.refresh()
    }
  },
  mounted () {
    this.getSkillTags()
  }
}
</script>

<style  lang="less">

  .question-list{
    .ant-radio-button-wrapper:not(:first-child)::before{
        background-color: inherit !important;
          width: 0px;

    }

    .ant-radio-button-wrapper-checked{
      background:#1b9aee;
      color: white;
    }

    .ant-radio-button-wrapper-checked:not(:first-child)::before{
        background-color: inherit !important;
          width: 0px;
    }

    .ant-radio-button-wrapper{
      border-left: 1px solid #d9d9d9 !important; ;
    }

    .ant-radio-button-wrapper-checked:not(:first-child){
      border-left: 0px solid #0082E9 !important; ;
    }

    .ant-radio-button-wrapper-checked:first-child{
      border-left: 1px solid #0082E9 !important; ;
    }

    .ant-radio-button-wrapper:first-child{
      border-left: none;
    }

    .select-btn {
      margin: 0px 10px;
      border-radius:2px;

    }

    .select-p {
      display: flex;
      align-items: center; /*  子元素相对父元素垂直居中 */

    }

    .select-span {
      text-align: center;
      align-items: center; /*  子元素相对父元素垂直居中 */
      justify-content: center;
      display: flex;
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      margin-right: 5px;
    }

    .active {
      color: white;
      background: #0082E9;

    }

    .selext-box {

      /*    .checkBoxChecked {
            color: #1b9aee;
            border-color: #1b9aee;
            -webkit-box-shadow: -1px 0 0 0 #1b9aee;
            box-shadow: -1px 0 0 0 #1b9aee;
          }*/
    }

    .button-card{
      .ant-card-body{
        padding-top: 0px;
      }
    }

    .select-form {
      .ant-form-item{
        margin-bottom: 12px !important;
      }
    }
    .question-list-card{
      border-top: 0px;
      .ant-list-item{
        padding: 5px;
        border: 0px;
      }
      .ant-card-actions{
        p{
          margin-bottom: 0px;
        }
      }
    }

  }

</style>
