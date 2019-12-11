<template>
  <a-card bordered>
    <a-spin :spinning="showLoading">
      <div class="d1">
        <div class="d2">
          <img src="../../assets/20191127180342.png" alt class="img1" />
          <div class="login">
            <p>登录密码</p>
            <span>上次登录时间为:</span>
            <span>{{ lastdate }}</span>
          </div>
          <a-button class="btn1" @click="showModal1()">修改</a-button>
        </div>
        <div class="d3">
          <img src="../../assets/shouji12.svg" alt class="img2" />
          <div class="phone">
            <p>手机号</p>
            <span>绑定手机号为:</span>
            <span>{{ myphone }}</span>
          </div>
          <a-button class="btn2" @click="showModal2()">修改</a-button>
        </div>
      </div>
      <password-modal ref="passwordModal" ></password-modal>
      <phone-modal ref="phoneModal" @parentMethod="createInfo" :tophone="tophone"></phone-modal>
    </a-spin>
  </a-card>
</template>

<script>
import PasswordModal from './password'
import PhoneModal from './phone'
import SetApi from '@/api/set.js'
export default {
  components: {
    PasswordModal,
    PhoneModal
  },
  data () {
    return {
      data: {},
      lastdate: null,
      tophone: '',
      myphone: '',
      showLoading: true
    }
  },
  created () {
    this.createInfo()
  },
  methods: {

    // reload () {
    //   SetApi.getInfo()
    //     .then(res => {
    //       console.log(res)
    //       this.data = res.data
    //       var last = this.data.lastLogin.split('T')
    //       var newlast = last.join(' ')
    //       this.lastdate = newlast
    //     })
    //     .catch(err => alert(err))
    // },
    createInfo () {
      SetApi.getInfo()
        .then(res => {
        // console.log(res)
          this.data = res.data
          // 手机号
          var tel = this.data.phone
          this.tophone = tel
          tel = '' + tel
          var reg = /^(\d{3})\d*(\d{4})$/
          var tel1 = tel.replace(reg, '$1****$2')
          this.myphone = tel1
          // 日期
          var last = this.data.lastLogin.split('T')
          var fl = last[0]
          var fr = last[1]
          var regTimes = []
          if (fl) {
            regTimes = fl.split('-')
            if (regTimes.length === 3) {
              var year = regTimes[0]
              var month = regTimes[1]
              var date = regTimes[2]
              month = month.replace(/^0/, '')
              date = date.replace(/^0/, '')
              const newdate = year + '年' + month + '月' + date + '日'
              this.lastdate = newdate
            }
          }
          var newlast = `${this.lastdate} ${fr}`
          this.lastdate = newlast
          this.showLoading = false
        })
        .catch(err => alert(err))
    },
    showModal1 () {
      this.$refs.passwordModal.show()
    },
    showModal2 () {
      this.$refs.phoneModal.show()
    }
  }
}
</script>

<style lang="less" scoped>
.a-card{
width: 980px;
}
.d1 {
  width: 100%;
  height: 979px;
}

.d2 {
  position: relative;
  height: 100px;
  border-bottom: 1px solid #ccc;
  .btn1 {
    float: right;
    position: absolute;
    top: 36px;
    right: 146px;
    border: 1px solid #0086f0;
    color: #0086f0;
  }
  .img1 {
    position: absolute;
    top: 36px;
    left: 80px;
  }
  .login {
    float: left;
    position: absolute;
    top: 36px;
    left: 100px;
    p {
      width: 100px;
      height: 25px;
      line-height: 18px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      margin-bottom: -1px;
    }
    span {
      margin-left: 17px;
      width: 319px;
      height: 16px;
      line-height: 16px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(169, 169, 169, 1);
    }
  }
}

.d3 {
  position: relative;
  height: 100px;
  border-bottom: 1px solid #ccc;
  text-align: center;
  .btn2 {
    float: right;
    float: right;
    position: absolute;
    top: 36px;
    right: 146px;
    border: 1px solid #0086f0;
    color: #0086f0;
  }
  .img2 {
    position: absolute;
    top: 36px;
    left: 80px;
  }
  .phone {
    float: left;
    position: absolute;
    top: 36px;
    left: 105px;
    p {
      width: 74px;
      height: 25px;
      line-height: 18px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      margin-bottom: -1px;
    }
    span {
      margin-left: 12px;
      width: 319px;
      height: 16px;
      line-height: 16px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(169, 169, 169, 1);
    }
  }
}
img {
  vertical-align: middle;
}
</style>
