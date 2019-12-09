<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <div class="gutter-example">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="技能标签">
              <a-input
                type="text"
                ref="qiye"
                placeholder="请输入技能标签"
                onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                v-decorator="[
                  'keyword',
                  {rules: [{ required: false, }],
                   validateTrigger: 'change'}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8" style="margin-left:100px">
            <a-form-item>
              <a-button @click="handleReset" style="width:100px;margin-right:20px">重置</a-button>
              <a-button type="primary" html-type="submit" style="width:100px">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <a-row>
        <a-col :span="8" :style="{ textAlign: 'center'}"></a-col>
      </a-row>
    </a-form>
    <div class="search-result-list">
      <a-card style="width: 100%;margin:0 auto;min-width:1080px;">
        <span class="datalisit">数据列表</span>
        <a-button class="editable-add-btn" type="primary" @click="handleAdd()">新增</a-button>

        <a-table
          ref="table"
          :dataSource="data.list"
          :columns="columns"
          :pagination="pagination"
          rowKey="id"
          @change="handleTableChange"

        >
          <template slot="operation" slot-scope="text, record">
            <a @click="deleteuser(record)">删除</a>
            |&nbsp;
            <a @click="showModal(record)">查看</a>
            | &nbsp;
            <a @click="handleEdit(record)">编辑</a>
          </template>
        </a-table>
      </a-card>
      <add-modal ref="addModal" @parentMethod="reload" :toadd="toadd"></add-modal>
      <edit-modal ref="editModal" @parentMethod="reload" :toedit="toedit"></edit-modal>
      <examine-modal ref="examineModal"></examine-modal>
    </div>
  </div>
</template>
<script>
import TagApi from '@/api/tag.js'
import AddModal from './Add'
import EditModal from './edit'
import ExamineModal from './examine'
export default {
  components: {
    AddModal,
    EditModal,
    ExamineModal
  },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      pagination: {
        // hideOnSinglePage: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: total => `总计${this.data.total}条`,
        total: 11,
        pageNum: null
      },
      data: {},
      toedit: {},
      toadd: {},

      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'number' },
          customRender: (text, record, index) => `${(this.pagination.pageNum - 1) * 10 + index + 1}`
        },
        {
          title: '技术方向',
          // dataIndex: 'jobName'
          dataIndex: 'techName'

        },
        {
          title: '技能标签',
          // dataIndex: 'skillTagName'
          dataIndex: 'name'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  created () {
    TagApi.getList()
      .then(res => {
        this.data = res.data

        this.pagination = { ...this.pagination, total: this.data.total }

        this.toedit = this.data
        return this.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    reload (pageNum) {
      this.data.pageNum = pageNum
      console.log(this.data.pageNum)
      TagApi.getList({ pageNum: this.pagination.pageNum })
        .then(res => {
          this.data = res.data
          this.pagination = { ...this.pagination, total: this.data.total }
        })
        .catch(err => alert(err))
    },
    //  点击页码
    handleTableChange (pagination) {
      this.pagination.pageNum = pagination.current
      const searchNum = { pageNum: this.pagination.pageNum }
      // console.log(searchNum)
      TagApi.getList(searchNum)
        .then(res => {
          this.data = res.data
        })
        .catch(err => alert(err))
    },
    // 添加
    handleAdd () {
      this.$refs.addModal.show()
    },
    // 编辑
    handleEdit (record) {
      this.$refs.editModal.show(record)
    },
    // 删除
    deleteuser (record) {
      console.log(record.id)
      const that = this
      this.$confirm({
        title: '确定要删除吗?',
        content: '删除之后数据将无法恢复',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          TagApi.delete(record.id).then(res => {
            console.log(record.id)
            that.$message.success('删除成功')
            TagApi.getList()
              .then(res => {
                that.data = res.data
                that.pagination = { ...that.pagination, total: that.data.total }
                console.log(that.pagination)
                return that.data
              })
              .catch(err => {
                console.log(err)
              })
          })
        }
      })
    },
    // 查询
    handleSearch (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this
      const validateFieldsKey = ['keyword']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const searchParams = { ...values }
          if (searchParams !== undefined) {
            console.log(searchParams)
            TagApi.getList(values).then(res => {
              this.data = res.data
              this.pagination = { ...this.pagination, total: this.data.total }
              console.log(this.data)
              return this.data
            })
          }
        }
      })
    },
    // 重置
    handleReset () {
      this.form.resetFields()
      TagApi.getList()
        .then(res => {
          this.data = res.data
          return this.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    showModal (record) {
      this.$refs.examineModal.show(record)
    }

  }
}
</script>
<style>
.gutter-example >>> .ant-row > div {
  background: transparent;
  border: 0;
}
.gutter-box {
  background: #00a0e9;
  padding: 5px 0;
}
.ant-advanced-search-form {
  padding: 48px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}
#components-form-demo-advanced-search {
  overflow-x: scroll;
  white-space: nowrap;
}
.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  min-width: 1080px;
}
#components-form-demo-advanced-search .search-result-list {
  /* margin-top: 16px;
  border: 1px dashed #e9e9e9;

  background-color: #fafafa;
 */
  min-width: 1080px;
  padding-top: 12px;

  border-radius: 6px;
  min-height: 200px;
}
.d2 {
  text-align: center;
  height: 40%;
  width: 90;
}
.datalisit {
  width: 200px;
  margin: 20px auto;
}
.ant-table-wrapper {
  margin-top: 20px;
}
.editable-add-btn {
  position: absolute;
  right: 32px;
  top: 0;
  width: 100px;
  margin: 20px auto;
}
</style>
