<template>
  <a-layout-sider

    width="256px"
    :trigger="null"
    class="side"
  >
    <logo style="width:100%;"/>

    <a-menu theme="light" :mode="mode" class="menu" style="padding: 16px 0px;">
      <a-menu-item key="1" @click="sort1()" >
        <router-link to="/dashboard">
          <user-icon :type="qiye"></user-icon>
          <span>企业管理</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="2" @click="sort2()">
        <router-link to="/question">
          <user-icon :type="tiku"></user-icon>
          <span>题库管理</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="3" @click="sort3()">
        <router-link to="/testers">
          <user-icon :type="ceshi"></user-icon>
          <span>测试人员管理</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="4" @click="sort4()">
        <router-link to="/tag">
          <user-icon :type="tag"></user-icon>
          <span>标签管理</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="5" @click="sort5()">
        <router-link to="/set">
          <user-icon :type="set"></user-icon>
          <span>系统设置</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>

</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  data () {
    return {
      // active: true,
      qiye: ['iconxingzhuang3', 'iconqiye-lanse'],
      tiku: ['icontiku-huise', 'iconxingzhuang1'],
      ceshi: ['iconxingzhuang4', 'iconxingzhuangkaobei1'],
      tag: ['iconxingzhuang2', 'iconbiaoqian-lanse'],
      set: ['iconxingzhuang5', 'iconxingzhuang']
    }
  },
  name: 'SideMenu',
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    }
  },
  created () {
    this.$router.push('/dashboard')
    this.qiye = 'iconqiye-lanse'
    this.tiku = 'icontiku-huise'
    this.ceshi = 'iconxingzhuang4'
    this.tag = 'iconxingzhuang2'
    this.set = 'iconxingzhuang5'
  },
  methods: {
    sort1 () {
      this.qiye = 'iconqiye-lanse'
      this.tiku = 'icontiku-huise'
      this.ceshi = 'iconxingzhuang4'
      this.tag = 'iconxingzhuang2'
      this.set = 'iconxingzhuang5'
    },
    sort2 () {
      this.qiye = 'iconxingzhuang3'
      this.tiku = 'iconxingzhuang1'
      this.ceshi = 'iconxingzhuang4'
      this.tag = 'iconxingzhuang2'
      this.set = 'iconxingzhuang5'
    },
    sort3 () {
      this.qiye = 'iconxingzhuang3'
      this.tiku = 'icontiku-huise'
      this.ceshi = 'iconxingzhuangkaobei1'
      this.tag = 'iconxingzhuang2'
      this.set = 'iconxingzhuang5'
    },
    sort4 () {
      this.qiye = 'iconxingzhuang3'
      this.tiku = 'icontiku-huise'
      this.ceshi = 'iconxingzhuang4'
      this.tag = 'iconbiaoqian-lanse'
      this.set = 'iconxingzhuang5'
    },
    sort5 () {
      this.qiye = 'iconxingzhuang3'
      this.tiku = 'icontiku-huise'
      this.ceshi = 'iconxingzhuang4'
      this.tag = 'iconxingzhuang2'
      this.set = 'iconxingzhuang'
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
<style lang="less" scoped>

.wp {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: #ccc;
}
.side{
background-color: #fff;
}

.title {
  margin-left: 40%;
  text-align: center;
  /* position: absolute;
  left: 50%; */
  font-size: 18px;
  font-weight: 400;
  color: #222;
}

.dropdow {
  float: right;
  margin-top: 18px;
  margin-right: 20px;
}
.username {
  float: right;
  vertical-align: middle;
}
#components-layout-demo-custom-trigger {
  width: 100%;
  height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

/* #components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
} */
</style>
