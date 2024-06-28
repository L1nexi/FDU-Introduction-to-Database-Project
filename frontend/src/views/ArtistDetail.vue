<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'artistlist'}">艺术家列表</el-breadcrumb-item>
            <el-breadcrumb-item>艺术家详细信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 艺术家详细信息 ：标题及编辑按钮-->
        <el-row justify="space-evenly">
            <el-col :span="8">
                <div class="list-title">
                    Detailed Information of {{ artistInfo.name }}
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

        <!-- 艺术家详细信息 ：表单 -->
        <el-row>
            <el-col :span="14" :offset="1">
                <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Name" prop="name" >
                        <el-input v-model="form.name" placeholder="Enter artist name" :disabled="!isEdit" />
                    </el-form-item>
                    <el-form-item label="Genre" prop="genre">
                        <el-input v-model="form.genre" placeholder="Enter genre" :disabled="!isEdit" />
                    </el-form-item>
                    <el-form-item label="Description" prop="description">
                        <el-input type="textarea" v-model="form.description" placeholder="Enter description" :disabled="!isEdit" :rows="5" />
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-divider></el-divider>

        <!-- 艺术家详细信息 ：音乐列表 -->
        <el-row justify="space-evenly">
            <el-col :span="8">
                <div class="list-title">
                    Music
                </div>
            </el-col>
            <el-col :span="8"></el-col>
        </el-row>

        <el-table :data="artistInfo.music" :style="{ width: '100%' }" stripe >
            <el-table-column label="Title" width="380" align="center" >
                <template #default="scope">
                    <el-link @click="$router.push({name: 'musicdetail', params:{id: scope.row.id}})" target="_blank">{{ scope.row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="album" label="Album" width="400" align="center" />
            <el-table-column prop="genre" label="Genre" align="center" />
        </el-table>

        <!-- 艺术家详细信息 ：关注的用户列表? -->
        <el-row justify="space-evenly">
            <el-col :span="8">
                <div class="list-title">
                    Followers
                </div>
            </el-col>
            <el-col :span="8"></el-col>
        </el-row>
    
        <el-row>
            <el-col :span="9" :offset="2">
                <el-table :data="artistInfo.follower" :style="{ width: '100%' }" stripe >
                <el-table-column prop="username" label="User Name" align="center" />
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script >
import { ElMessage } from 'element-plus';

export default{
    name: 'ArtistDetail',
    props:{
        id: String
    },
    data(){
        return{
            form: {
                name: '',
                genre: '',
                description: '',
                follower: [],
                music: [],
            },
            artistInfo: {
                name: '',
                genre: '',
                description: '',
                follower: [],
                music: [],
            },
            isEdit: false,
            rules:{
                name: [
                    { required: true, message: 'Please input the artist name', trigger: 'blur' },
                ],
                genre: [
                    { required: true, message: 'Please input the genre', trigger: 'blur' },
                ],
                description: [
                    { required: false, message: 'Please input the description', trigger: 'blur' },
                ],
            },
        }
    },
    methods:{
        getArtistDetail(){
            console.log("api/artists/" + this.id + "/")
            this.axios.get("api/artists/" + this.id + "/")
            .then(response => {
                this.artistInfo = response.data;
                this.resetInfo();
            })
            .catch(error => {
                console.log('fail to fetch artist')
                console.log(error);
            });
        },
        putArtistDetail(){
            this.axios.put("api/artists/" + this.id + "/", this.form)
            .then(response => {
                ElMessage({
                        message: 'Edition Saved Successfully.',
                        type: 'success',
                        grouping: true,
                    });
                this.artistInfo = response.data;
                this.resetInfo();
                console.log("Artist updated successfully");
            })
            .catch(error => {
                ElMessage({
                    message: 'Fail to save the edition.',
                    type: 'error',
                    grouping: true,
                });
                console.log(error);
            });
        },
        submitForm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.putArtistDetail();
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
            this.form = JSON.parse(JSON.stringify(this.artistInfo));
            this.isEdit = false;
        },
    },
    mounted: function(){
        this.getArtistDetail();
    },
    created: function(){
        this.$watch(
            () => this.id,
            () => {
                this.getArtistDetail();
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