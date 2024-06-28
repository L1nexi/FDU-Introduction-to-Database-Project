<template>
    <div class="register-container">
        <el-card style="width: 400px" >
            <h2 style="text-align: center">注册账号</h2>
            <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                <el-form-item label="用户名" prop="username" >
                    <el-input v-model="form.username" placeholder="Enter username"  />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input show-password v-model="form.password" placeholder="Enter password" />
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input-number v-model="form.age" :min='0' controls-position="right" />
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="Enter email" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';
export default {
name: 'RegisterView',
data() {
    return {
    username: '',
    email: '',
    password: '',
    rules:{
            username: [
                { required: true, message: 'Please input the username', trigger: 'blur' },
            ],
            password: [
                { required: true, message: 'Please input the password', trigger: 'blur' },
            ],
            age: [
                { required: true, message: 'Please input the age', trigger: 'blur' },
            ],
            email: [
                { required: true, message: 'Please input the email', trigger: 'blur' },
            ],
        },
        
    form: {
        username: '',
        password: '',
        age: 0,
        email: '',
    },
    };
},
methods: {
    onSubmit() {
    this.$refs.formRef.validate((valid) => {
        if (valid) {
            this.axios.post('api/users/', this.form)
            .then(response => {
                console.log(response);
                ElMessage({
                    message: 'Register Success',
                    type: 'success'
                });
            })
            .catch(error => {
                console.log(error);
                ElMessage({
                    message: 'Register Failed',
                    type: 'error'
                });
            })
        } 
        else {
            ElMessage({
                message: 'Invalid Form Input',
                type: 'error'
            });
        }
    });
    }
}
};
</script>

<style scoped>
.register-container {
display: flex;
justify-content: center;
align-items: center;
height: 70vh;
}

</style>