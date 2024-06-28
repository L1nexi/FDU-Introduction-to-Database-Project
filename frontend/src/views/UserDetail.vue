<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'userlist'}">用户列表</el-breadcrumb-item>
            <el-breadcrumb-item>用户详细信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 用户详细信息 ：标题及编辑按钮-->
        <el-row justify="space-evenly">
            <el-col :span="8">
                <div class="list-title">
                    Detailed Information of {{ userInfo.username }}
                </div>
            </el-col>
            <el-col :span="8">
                <div v-if="isEdit" class="flex-content">
                    <el-popconfirm title="Save the information?" @confirm="submitForm" :width='200'>
                        <template #reference>
                            <el-button class="general-button"  type="primary" plain><el-icon><Check /></el-icon>Save</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button class="general-button" type="danger" plain @click="resetInfo"><el-icon><Close /></el-icon>Cancel</el-button>
                </div>
                <div v-else class="flex-content"> 
                    <el-button class="general-button"  @click="isEdit=true"><el-icon><Edit /></el-icon>Edit</el-button>
                </div>
            </el-col>
        </el-row>

        <!-- 用户详细信息 ：表单 -->
        <el-row>
            <el-col :span="8" :offset="1">
                <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Username" prop="username" >
                        <el-input v-model="form.username" placeholder="Enter username" :disabled="!isEdit" />
                    </el-form-item>
                    <el-form-item label="Age" prop="age">
                        <el-input-number v-model="form.age" :min='0' controls-position="right" :disabled="!isEdit" />
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email" placeholder="Enter email" :disabled="!isEdit" />
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-divider></el-divider>

        <!-- 用户详细信息 ：关注的艺术家列表 -->
        <el-row justify="space-evenly">
            <el-col :span="8">
                <div class="list-title">
                    Followings List
                </div>
            </el-col>
            <el-col :span="8"></el-col>
        </el-row>

        <el-table :data="userInfo.followings_full" :style="{ width: '100%' }" stripe >
            <el-table-column label="Artist Name" width="380" align="center" >
                <template #default="scope">
                    <el-link @click="$router.push({name: 'artistdetail', params:{id: scope.row.id}})" target="_blank">{{ scope.row.name }}</el-link>
                </template>
            </el-table-column>
            
            <el-table-column prop="genre" label="Genre" width="400" align="center" />
            <!-- <el-table-column prop="description" label="Description" width="200" align="center" /> -->
            <el-table-column label="Operations" align="center" >
                <template #default="scope">
                    <el-button v-if="!scope.row.isFollowing" 
                    @click="scope.row.isFollowing=true"  size="small" >Follow</el-button>
                    <el-button v-if="scope.row.isFollowing"
                     :disabled="!isEdit" size='small' type='danger' plain @click="scope.row.isFollowing=false">
                    Unfollow</el-button>
                </template>
            </el-table-column>
        </el-table>
        

    </div>
</template>

<script >
import { ElMessage } from 'element-plus';

export default{
    name: 'UserDetail',
    props:{
        id: String
    },
    data(){
        return{
            form: {
                username: '',
                age: 0,
                email: '',
                followings: [],
                followings_full: [],
            },
            userInfo: {
                username: '',
                age: 0,
                email: '',
                followings: [],
                followings_full: [],
            },
            isEdit: false,
            rules:{
                username: [
                    { required: true, message: 'Please input the username', trigger: 'blur' },
                ],
                age: [
                    { required: true, message: 'Please input the age', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: 'Please input the email', trigger: 'blur' },
                ],
            },
        }
    },
    methods:{
        getUserDetail(){
            this.axios.get("api/users/" + this.id + "/")
            .then(response => {
                this.userInfo = response.data;
                this.resetInfo();
            })
            .catch(error => {
                console.log(error);
            });
        },
        putUserDetail(){
            // 提取 isFollowing 为真的对象
            this.form.followings = this.userInfo.followings_full.filter(item => item.isFollowing).map(item => item.id);

            this.axios.put("api/users/" + this.id + "/", this.form)
            .then(response => {
                this.userInfo = response.data;
                this.resetInfo();
                console.log("User updated successfully");
            })
            .catch(error => {
                console.log(error);
            });
        },
        submitForm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    ElMessage({
                        message: 'Edition Saved Successfully.',
                        type: 'success',
                        grouping: true,
                    })
                    this.putUserDetail();
                } else {
                    ElMessage({
                        message: 'Invaild Form Input, Please Check Again.',
                        type: 'error',
                        grouping: true,
                    })
                    return false;
                }
            });
        },
        resetInfo(){
            this.form = JSON.parse(JSON.stringify(this.userInfo));
            this.userInfo.followings_full.forEach(item =>{
                item.isFollowing = true;
            })
            this.isEdit = false;
        },
    },
    mounted: function(){
        this.getUserDetail();
    },
    created: function(){
        this.$watch(
            () => this.id,
            () => {
                this.getUserDetail();
            }
        )
    },
};
</script>

<style scoped>
.flex-content{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}


.general-button{
    margin: 10px 10px;
}
</style>