<template>
  <div class="login-container">
    <el-card style="width: 400px">
      <div style="text-align: center">
        <h2>登录账号</h2>
      </div>
      <el-form ref="loginForm" :model="loginForm" label-width="75px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button type="text" @click="this.$router.push({name: 'register'})">没有账号？点此注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
  
<script>
import { ElMessage } from 'element-plus';
export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    handleLogin() {
      if (this.loginForm.username==='admin' && this.loginForm.password==='admin') {
        this.$store.commit('setUserState', 0)
        ElMessage({
          message: 'admin 登录',
          type: 'success',
        });
        this.$router.push({ name: 'home' });
        return;
      }
      
      this.axios.get('api/users/', {
        params: {
          username: this.loginForm.username,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.length === 0) {
          ElMessage({
            message: '用户不存在',
            type: 'error',
          });
          return;
        }
        if (response.data[0].password !== this.loginForm.password) {
          ElMessage({
            message: '密码错误',
            type: 'error',
          });
          return;
        }
        this.$store.commit('setUserState', response.data[0].id)
        ElMessage({
          message: '登录成功',
          type: 'success',
        });
        this.$router.push({ name: 'home' });
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>
  
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

</style>