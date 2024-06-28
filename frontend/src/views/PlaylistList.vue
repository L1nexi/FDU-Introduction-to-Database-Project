<template>
    <div>
        <el-container>
            
            <el-header>
                <!-- 面包屑导航 -->
                <el-breadcrumb separator=">">
                    <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                    <el-breadcrumb-item >播放列表</el-breadcrumb-item>
                </el-breadcrumb>

                <!-- 播放列表标题及搜索框、添加框 -->
                <el-row justify="space-between">
                    <el-col :span="8">        
                        <div class="list-title">
                            Playlists List
                        </div>
                    </el-col>
                    <el-col :span="11">
                        <div class="flex-content">
                            <el-input class="search-input" v-model="params.search" placeholder="Search a playlist..." clearable />
                            <el-button-group>
                                <el-button class='general-button' type="primary"  @click="getPlaylist" >
                                    <el-icon><search /></el-icon>   Search 
                                </el-button>
                                <el-button class="general-button" type="primary" @click="newPlaylistDialog=true"><el-icon><Playlist /></el-icon> New Playlist</el-button>
                            </el-button-group>
                        </div>
                    </el-col>
                </el-row>
            </el-header>

            <el-container>
                <el-aside width="170px">
                                        <!-- 播放列表 -->
                    <el-table :data="playlistlists" :style="{ width: '100%' }" stripe >
                        <el-table-column prop="name" label="Playlist Name" align="center" > 
                            <template #default="scope">
                                <el-link @click="$router.push({name: 'playlistdetail', params:{id: scope.row.id}})">{{ scope.row.name }}</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-aside>
                <el-main>
                    <router-view />
                </el-main>

            </el-container>

        </el-container>

        <!-- 添加播放列表对话框 -->
        <el-dialog v-model="newPlaylistDialog" title="Create New Playlist" >
            <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Playlist Name" prop="name" >
                        <el-input v-model="form.name" placeholder="Enter playlist name"  />
                    </el-form-item>
                    <el-form-item label="Description" prop="description">
                        <el-input v-model="form.description" placeholder="Enter description" />
                    </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="newPlaylistDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="newPlaylistConfirm"> Confirm </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'PlaylistList',
  data() {
    return {
      playlistlists: [],
      params: {
        search: '',
        name: '',
        description: '',
      },

      newPlaylistDialog: false,

      form: {
        name: '',
        description: '',
        user: this.$store.state.userId,
      },

      rules:{
                name: [
                    { required: true, message: 'Please input the playlist name', trigger: 'blur' },
                ],
            },
    };
    
  },
    methods: {
        getPlaylist(){
            this.axios.get('api/playlists/', {
                params: this.params
            }).then(response => {
                this.playlistlists = response.data;
            }).catch(error => {
                console.log(error);
                ElMessage({
                    message: 'Error fetching playlist data',
                    type: 'error'
                });
            });
        },
        toPlaylistDetail(index, row){
            this.$router.push({name: 'playlistdetail', params: {id: row.id}});
        },
        deletePlaylist(index, row){
            this.axios.delete('api/playlists/'+row.id+'/').then((response) => {
                console.log(response);
                this.getPlaylist();
                ElMessage({
                message: 'Playlist deleted',
                type: 'success'
                });
            }).catch(error => {
                console.log(error);
                ElMessage({
                message: 'Error deleting playlist',
                type: 'error'
                });
            });
            this.getPlaylist();
        },
        newPlaylistConfirm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.axios.post('api/playlists/', this.form)
                    .then(response => {
                        console.log(response);
                        this.newPlaylistDialog = false;
                        this.getPlaylist();
                        ElMessage({
                            message: 'Playlist created successfully',
                            type: 'success'
                        });
                    })
                    .catch(error => {
                        ElMessage({
                            message: 'Error creating playlist. Please check the form input.',
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
        this.getPlaylist();
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