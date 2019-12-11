<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <div class="gutter-example">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="企业名称">
              <a-input
                type="text"
                ref="qiye"
                placeholder="请输入企业名称"
                onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                v-decorator="[
                  'name',
                  {rules: [{ required: false,message:' ' }],
                   validateTrigger: 'change'}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="联系方式">
              <a-input
                type="text"
                ref="qiye"
                placeholder="请输入联系方式"
                onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                v-decorator="[
                  'phone',
                  {rules: [{ required: false,message:' '}],
                   validateTrigger:
                     'change'}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="使用状态">

              <a-select
                v-decorator="[
                  'status',
                  {rules: [{ required: false,message:' ' }]}
                ]"
                placeholder="全部"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">已到期</a-select-option>
                <a-select-option value="0">使用中</a-select-option>
              </a-select>

            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'center'}">
          <a-button @click="handleReset" style="width:100px">重置</a-button>
          <a-button
            :style="{ marginLeft: '8px' }"
            type="primary"
            html-type="submit"
            style="width:100px"
          >查询</a-button>
        </a-col>
      </a-row>
    </a-form>
    <div class="search-result-list">
      <a-card style="width: 100%;margin:0 auto;min-width:1080px;">
        <span class="datalisit">数据列表</span>
        <a-button class="editable-add-btn" type="primary" @click="handleAdd">新增</a-button>
        <a-spin :spinning="showLoading">
          <a-table
            ref="table"
            :dataSource="this.data.list"
            :columns="columns"
            :pagination="pagination"
            @change="handleTableChange"
            rowKey="id"
          >
            <template slot="operation" slot-scope="text, record">
              <a @click="deleteuser(record)">删除</a>
              |&nbsp;
              <a @click="showModal2(record)">查看</a>
              | &nbsp;
              <a @click="showModal3(record)">编辑</a>
            </template>

          </a-table>
        </a-spin>
      </a-card>
    </div>
  </div>
</template>
<script>
import EnterpriseApi from '@/api/enterprise.js'

export default {
  data () {
    return {
      data: [],
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      pagination: {
        // hideOnSinglePage: true,
        defaultPageSize: 1,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: total => `总计${this.data.total}条`,
        total: 0,
        pageNum: 1
      },
      showLoading: true,
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'number' },
          customRender: (text, record, index) => `${(this.pagination.pageNum - 1) * (this.pagination.pageSize) + (index + 1)}`

        },
        {
          title: '企业名称',
          dataIndex: 'name'
        },
        {
          title: '联系方式',
          dataIndex: 'phone'
        },
        {
          title: '联系人',
          dataIndex: 'contact'
        },
        {
          title: '使用状态',
          dataIndex: 'status',
          customRender: function (text, record, index) {
            return record.status === 1 ? '已到期' : '使用中'
          }
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
    // 获取表格数据

    EnterpriseApi.getAccounts()
      .then(res => {
        const { data } = res
        this.data = data
        this.pagination = { ...this.pagination, total: data.total, pageSize: data.pageSize }
        this.showLoading = false
        return this.data
      })
      .catch(err => {
        alert(err)
      })
  },
  methods: {
    handleTableChange (pagination) {
      this.showLoading = true
      const searchNum = { pageNum: pagination.current }
      console.log(searchNum)
      EnterpriseApi.getAccounts(searchNum)
        .then(res => {
          this.showLoading = false
          this.pagination.pageNum = pagination.current
          this.data = res.data
        })
        .catch(err => alert(err))
    },

    // 查询
    handleSearch (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this
      this.showLoading = true
      const validateFieldsKey = ['name', 'phone', 'status']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const searchParams = { ...values }
          if (
            searchParams.name !== undefined ||
            searchParams.phone !== undefined ||
            searchParams.status !== undefined
          ) {
            EnterpriseApi.getAccounts(searchParams)
              .then(res => {
                this.data = res.data
                this.showLoading = false
                this.pagination = { ...this.pagination, total: this.data.total }
              })

              .catch(err => this.requestFailed(err))
          }
        }
      })
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '暂无数据',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    // 重置
    handleReset () {
      this.showLoading = true
      this.form.resetFields()
      EnterpriseApi.getAccounts({ pageNum: 1 })
        .then(res => {
          this.data = res.data
          this.showLoading = false
          return this.data
        })
        .catch(err => {
          alert(err)
        })
    },
    // 删除
    deleteuser (record) {
      const that = this

      this.$confirm({
        title: '确定要删除吗?',
        content: '删除之后数据将无法恢复',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          that.showLoading = true
          EnterpriseApi.deleteAccount(record.id).then(res => {
            EnterpriseApi.getAccounts()
              .then(res => {
                that.data = res.data
                that.pagination = { ...that.pagination, total: that.data.total }
                that.showLoading = false
                that.$message.success('删除成功')
                return that.data
              })
              .catch(err => {
                alert(err)
              })
          })
        }
      })
    },

    showModal2 (record) {
      this.$router.push('/dashboard/examine?id=' + record.id)
    },
    showModal3 (record) {
      this.$router.push('/dashboard/edit?id=' + record.id)
    },
    handleAdd () {
      this.$router.push('/dashboard/add')
    }
  }
}
</script>
<style >
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
