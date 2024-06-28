<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item >用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 用户列表标题及搜索框、添加框 -->
        <el-row justify="space-evenly">
            <el-col :span="8">        
                <div class="list-title">
                    Users List
                </div>
            </el-col>
            <el-col :span="11">
                <div class="flex-content">
                    <el-input class="search-input" v-model="params.search" placeholder="Search a user..." clearable />
                    <el-button-group>
                        <el-button class='general-button' type="primary"  @click="getUser" >
                            <el-icon><search /></el-icon>   Search 
                        </el-button>
                        <el-button class="general-button" type="primary" @click="newUserDialog=true"><el-icon><User /></el-icon> New User</el-button>
                    </el-button-group>
                </div>
            </el-col>
        </el-row>

        <!-- 添加用户对话框 -->
        <el-dialog v-model="newUserDialog" title="Create New User" >
            <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Username" prop="username" >
                        <el-input v-model="form.username" placeholder="Enter username"  />
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                        <el-input show-password v-model="form.password" placeholder="Enter password" />
                    </el-form-item>
                    <el-form-item label="Age" prop="age">
                        <el-input-number v-model="form.age" :min='0' controls-position="right" />
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email" placeholder="Enter email" />
                    </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="newUserDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="newUserConfirm"> Confirm </el-button>
                </span>
            </template>
        </el-dialog>
         
        
        <!-- 用户列表 -->
        <el-table :data="userlists" :style="{ width: '100%' }" stripe >
            <el-table-column prop="username" label="Username" width="250" align="center" />
            <el-table-column prop="age" label="Age" width="200" align="center" />
            <el-table-column prop="email" label="Email" width="400" align="center" />
            <el-table-column label="Operations" align="center" >
                <template #default="scope">
                    <el-button size='small' @click="$router.push({name: 'userdetail', params: {id: scope.row.id}})"><el-icon><Document /></el-icon>Detail</el-button>
                    <el-popconfirm title="All info will be lost. Delete the user?" width="250"  @confirm="deleteUser(scope.$index, scope.row)">
                        <template #reference>
                            <el-button size='small' type="danger"><el-icon><Delete /></el-icon>Delete</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'UserLists',
  data() {
    return {
      userlists: [],
      params: {
        search: '',
        name: '',
        email: '',
      },

      newUserDialog: false,

      form: {
        username: '',
        password: '',
        age: 0,
        email: '',
      },

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
    };
    
  },
    methods: {
        getUser(){
            this.axios.get('api/users/', {
                params: this.params
            }).then(response => {
                this.userlists = response.data;
            }).catch(error => {
                console.log(error);
                ElMessage({
                    message: 'Error fetching user data',
                    type: 'error'
                });
            });
        },
        deleteUser(index, row){

            this.axios.delete('api/users/'+row.id+'/').then((response) => {
                console.log(response);
                this.getUser();
                ElMessage({
                message: 'User deleted',
                type: 'success'
                });
            }).catch(error => {
                console.log(error);
                ElMessage({
                message: 'Error deleting user',
                type: 'error'
                });
            });
        },
        newUserConfirm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.axios.post('api/users/', this.form)
                    .then(response => {
                        console.log(response);
                        this.newUserDialog = false;
                        this.getUser();
                        ElMessage({
                            message: 'User created successfully',
                            type: 'success'
                        });
                    })
                    .catch(error => {
                        ElMessage({
                            message: 'Error creating user. Please check the form input.',
                            type: 'error',
                            grouping: true,
                        });
                        console.log(error);
                        console.log(this.form);
                    });
                } else {
                    ElMessage({
                        message: 'Invaild Form Input, Please Check Again.',
                        type: 'error',
                        grouping: true,
                    });
                    return false;
                }
            });
        },
    },
    mounted: function(){
        this.getUser();
    },

};
</script>

<style scoped>
.flex-content{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}
.el-table .el-button{
    margin: 5px 10px;
}
.search-input{
    max-width: 300px;
    margin: 10px 10px;
}
.general-button{
    margin: 10px 10px;
}


</style>