<template>
  <div id="app">

    <div class="nav-box">
      <div class="logo" @click="handleClick">小辣椒之家</div>
      <div class="nav-list">
        <router-link to="/">首页</router-link>
        <router-link to="/learn">课程学习</router-link>
        <router-link to="/student">学员展示</router-link>
        <router-link to="/about">关于</router-link>
        <router-link to="/activity">社区</router-link>
      </div>
    </div>
    <div class="container">
      <transition>
         <router-view></router-view>
      </transition>
      <router-view name="student"></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  methods:{
    handleClick(){
      this.$router.push('/home');
      //  this.$router.replace('/home');
      //  this.$router.go(1);
    }
  }
}
</script>

<style scoped>
/* #app{
  overflow-x: hidden;
} */
.v-enter{
  transform: translateX(1000px);
}
.v-enter-active{
  transition: all .3s;
}
.v-enter-to{
  transform: translateX(0px);
}
.nav-box {
  display: flex;
  justify-content: space-between;
  height: 60px;
  line-height: 60px;
  background-color: #3385ff
}

.nav-box .logo {
  color: #fff;
}

.nav-list a {
  margin-left: 40px;
  color: #fff;
  text-decoration: none;
}

.nav-list a.router-link-exact-active {
  font-weight: bold;
}

.container {
  margin-top: 60px;
}

.nav-box,
.container {
  padding-left: 200px;
  padding-right: 200px;
}
</style>