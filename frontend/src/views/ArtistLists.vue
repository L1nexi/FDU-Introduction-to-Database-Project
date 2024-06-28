<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item >艺术家列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 艺术家列表标题及搜索框、添加框 -->
        <el-row justify="space-evenly">
            <el-col :span="8">        
                <div class="list-title">
                    Artists List
                </div>
            </el-col>
            <el-col :span="11">
                <div class="flex-content">
                    <el-input class="search-input" v-model="params.search" placeholder="Search an artist..." clearable />
                    <el-button-group>
                        <el-button class='general-button' type="primary"  @click="getArtist" >
                            <el-icon><search /></el-icon>   Search 
                        </el-button>
                        <el-button class="general-button" type="primary" @click="newArtistDialog=true"><el-icon><User /></el-icon> New Artist</el-button>
                    </el-button-group>
                </div>
            </el-col>
        </el-row>

        <!-- 添加艺术家对话框 -->
        <el-dialog v-model="newArtistDialog" title="Create New Artist" >
            <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Name" prop="name" >
                        <el-input v-model="form.name" placeholder="Enter artist name"  />
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                        <el-input show-password v-model="form.password" placeholder="Enter password" />
                    </el-form-item>
                    <el-form-item label="Genre" prop="genre">
                        <el-input v-model="form.genre" placeholder="Enter genre" />
                    </el-form-item>
                    <el-form-item label="Description" prop="description">
                        <el-input type="textarea" v-model="form.description" placeholder="Enter description" />
                    </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="newArtistDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="newArtistConfirm"> Confirm </el-button>
                </span>
            </template>
        </el-dialog>
         
        
        <!-- 艺术家列表 -->
        <el-table :data="artistlists" :style="{ width: '100%' }" stripe >
            <el-table-column prop="name" label="Name" width="350" align="center" />
            <el-table-column prop="genre" label="Genre" width="400" align="center" />
            <el-table-column label="Operations" align="center" >
                <template #default="scope">
                    <el-button size='small' @click="$router.push({name: 'artistdetail', params:{id: scope.row.id}})"><el-icon><Document /></el-icon>Detail</el-button>
                    <el-popconfirm title="All info will be lost. Delete the artist?" width="250"  @confirm="deleteArtist(scope.$index, scope.row)">
                        <template #reference>
                            <el-button size='small' type="danger"><el-icon><Delete /></el-icon>Delete</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type='danger' plain v-if="followings.includes(scope.row.id)" size="small" @click="unfollowArtist(scope.row)"><el-icon><Minus /></el-icon>Unfollow</el-button>
                    <el-button type="primary" plain v-else size="small" @click="followArtist(scope.row)"><el-icon><Plus /></el-icon>Follow</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'ArtistLists',
  data() {
    return {
      artistlists: [],
      params: {
        search: '',
        name: '',
        genre: '',
      },
      followings: [],

      newArtistDialog: false,

      form: {
        name: '',
        password: '',
        genre: '',
        description: '',
      },

      rules:{
                name: [
                    { required: true, message: 'Please input the artist name', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: 'Please input the password', trigger: 'blur' },
                ],
                genre: [
                    { required: true, message: 'Please input the genre', trigger: 'blur' },
                ],
                description: [
                    { required: false, message: 'Please input the description', trigger: 'blur' },
                ],
            },
    };
    
  },
    methods: {
        getArtist(){
            this.axios.get('api/artists/', {
                params: this.params
            }).then(response => {
                this.artistlists = response.data;
            }).catch(error => {
                console.log(error);
                ElMessage({
                    message: 'Error fetching artist data',
                    type: 'error'
                });
            });
        },
        deleteArtist(index, row){
            this.axios.delete('api/artists/'+row.id+'/').then((response) => {
                console.log(response);
                this.getArtist();
                ElMessage({
                message: 'Artist deleted',
                type: 'success'
                });
            }).catch(error => {
                console.log(error);
                ElMessage({
                message: 'Error deleting artist',
                type: 'error'
                });
            });
        },
        newArtistConfirm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.axios.post('api/artists/', this.form)
                    .then(response => {
                        console.log(response);
                        this.newArtistDialog = false;
                        this.getArtist();
                        ElMessage({
                            message: 'Artist created successfully',
                            type: 'success'
                        });
                    })
                    .catch(error => {
                        ElMessage({
                            message: 'Error creating artist. Please check the form input.',
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
        followArtist(artist){
            let id = this.$store.state.userId;
            this.followings.push(artist.id);
            this.axios.patch('api/users/' + id + '/', {
                id: id,
                followings: this.followings
            }).then((response) => {
                this.followings = response.data.followings;
                ElMessage({
                    message: 'Artist followed',
                    type: 'success'
                });
            }).catch((error) => {
                console.log(error);
                ElMessage({
                    message: 'Error following artist',
                    type: 'error'
                });
            });
        },
        unfollowArtist(artist){
            let id = this.$store.state.userId;
            this.followings = this.followings.filter(item => item !== artist.id);
            this.axios.patch('api/users/' + id + '/', {
                id: id,
                followings: this.followings
            }).then((response) => {
                this.followings = response.data.followings;
                ElMessage({
                    message: 'Artist unfollowed',
                    type: 'success'
                });
            }).catch((error) => {
                console.log(error);
                ElMessage({
                    message: 'Error unfollowing artist',
                    type: 'error'
                });
            });
        },
        getFollowing(){
            let id = this.$store.state.userId;
            if (id === 0)
                return;
            this.axios.get('api/users/' + id + '/').then(response => {
                this.followings = response.data.followings;
            }).catch((error) => {
                console.log(error);
                ElMessage({
                    message: 'Error fetching following list',
                    type: 'error'
                });
            });
        }
    },
    mounted: function(){
        this.getArtist();
        this.getFollowing();
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