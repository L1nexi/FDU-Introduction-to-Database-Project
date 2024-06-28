<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu default-active='1' mode='horizontal'>
          <el-menu-item @click="$router.push({name: 'home'})" index='1'><el-link target="_blank">Home</el-link></el-menu-item>
          <el-menu-item  @click="$router.push({name: 'about'})" index='2'><el-link target="_blank">About</el-link></el-menu-item>
          <el-menu-item @click="$router.push({name: 'userlist'})" index='3'><el-link target="_blank">Users</el-link></el-menu-item>
          <el-menu-item @click="$router.push({name: 'artistlist'})" index='4'><el-link target="_blank">Artists</el-link></el-menu-item>
          <el-menu-item @click="$router.push({name: 'musiclist'})" index='5'><el-link target="_blank">Music</el-link></el-menu-item>
          <el-menu-item @click="$router.push({name: 'playlistlist'})" index='6'><el-link target="_blank">Playlist</el-link></el-menu-item>
          <el-menu-item @click="$router.push({name: 'login'})" index='7'><el-link target="_blank">Login</el-link></el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>


<style>

#app {
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.el-breadcrumb {
  padding-left: 30px /* 或者你想要的任何距离 */
}


.list-title{
    font-size: 20px;
    font-weight: bold;
    margin: 15px 10px;
    text-align: center;  

}
</style>
