<template>
  <div>
    <a-card :bordered="false" class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <p>测试人员姓名</p>
            <h4>李小刚</h4>
          </a-col>
          <a-col :md="4" :sm="24">
            <p>联系方式</p>
            <h4>13345678190</h4>
          </a-col>
          <a-col :md="4" :sm="24" >
            <p>技能方向</p>
            <h4>JAVA开发</h4>
          </a-col>
          <a-col :md="4" :sm="24" >
            <p>答题次数</p>
            <h4>5次</h4>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false">

      <div class="table-operator">
        <h4>答题历史</h4>
      </div>

      <s-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="createTime" slot-scope="text, record">{{ record.createTime | moment }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDelete(record)">删除</a>
            <a-divider type="vertical"/>
            <a @click="handleTestDetail(record)">查看试题</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <div style="text-align: center;padding: 20px">
      <a-button type="primary" @click="$router.go(-1)">返回</a-button>
    </div>
    <!--试题详情-->
    <a-modal v-model="showDetail" title="试题详情" onOk="handleOk" width="80%">
      <template slot="footer">
        <!--
        <a-button key="back" @click="handleCancel">Return</a-button>
-->
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          关闭
        </a-button>
      </template>

      <a-card :bordered="false">
        <test-detail></test-detail>
      </a-card>
    </a-modal>

  </div>
</template>

<script>
import { STable } from '@/components'
import AccountApi from '@/api/account'
// import TestDetail from '@/components/tester/testDetail'

export default {
  name: 'TableList',
  components: {
    STable
    // TestDetail
  },
  data () {
    return {
      loading: false,
      // 选择的详情Id
      showDetail: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '面试公司',
          dataIndex: 'name'
        },
        {
          title: '测试名称',
          dataIndex: 'phone'
        },
        {
          title: '测试时间',
          dataIndex: 'phone'
        },
        {
          title: '答题用时（分钟）',
          dataIndex: 'phone'
        },
        {
          title: '试题总分',
          dataIndex: 'phone'
        },
        {
          title: '测试得分',
          dataIndex: 'phone'
        },
        {
          title: '测试结果',
          dataIndex: 'phone'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return AccountApi.getAccounts(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      }
    }
  },
  methods: {
    handleTestDetail (record) {
      this.nowId = record.id
      this.showDetail = true
    },
    handleOk () {
      this.showDetail = false
    },
    handleCancel () {},
    handleAdd () {
      this.$router.push('account/add')
    },
    handleDetail (record) {
      this.$router.push({ path: 'account/detail', query: { id: record.id } })
    },
    handleDelete (record) {
      AccountApi.deleteAccount(record.id).then(res => {
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
  }
}
</script>
