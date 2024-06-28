<template>
    <div>
        <!-- 播放列表信息 -->
        <div class="playlistInfo">
            <el-row justify="space-evenly">
                <el-col :span="8">
                    <div style="display: flex; align-items: center; text-align: center">
                        <h3> {{ playlistInfo.name }} </h3>
                        <el-button size='small' @click="dialogVisible=true" circle><el-icon><Edit /></el-icon></el-button>
                        <el-popconfirm title="Delete this playlist?" width="250"  @confirm="deletePlaylist">
                            <template #reference>
                                <el-button size='small' type="danger" circle><el-icon><Delete /></el-icon></el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </el-col>
                <el-col :span=8>
                    <div style="display: flex; align-items: center; text-align: center">
                        <el-input class="search-input" v-model="params.search" placeholder="Search in the playlist..." clearable />
                        <el-button class='general-button' type="primary"  @click="getMusicList" >
                            <el-icon><search /></el-icon>   Search 
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <el-text>{{ playlistInfo.description }}</el-text>
        </div>

        <!-- 修改播放列表信息的对话框 -->
        <el-dialog v-model="dialogVisible" title="Shipping address">
            <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Playlist Name" prop="name" >
                        <el-input v-model="form.name" placeholder="Enter playlist name"  />
                    </el-form-item>
                    <el-form-item label="Description" prop="description">
                        <el-input type="textarea" :rows='3' v-model="form.description" placeholder="Enter description" />
                    </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="confirmAction"> Confirm </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 播放列表中的音乐 -->
        <div class="playlistMusic">
            <el-table :data="playlistContents" :style="{ width: '100%' }" stripe >
                <el-table-column prop="music_info.title" label="Title" width="220" align="center" sortable> 
                    <template #default="scope">
                        <el-link @click="$router.push({name: 'musicdetail', params: {id: scope.row.music_info.id}})" target="_blank">{{scope.row.music_info.title}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="music_info.album" label="Album" width="180" align="center" sortable />
                <el-table-column label="Artist" width="220" align="center" >
                    <template #default="scope">
                        <span v-for="(arti, index) in scope.row.music_info.artist" :key="index">
                            <el-link @click="$router.push({name: 'artistdetail', params: {id: arti.id}})" target="_blank">{{arti}}</el-link>
                            <span v-if="index < scope.row.music_info.artist.length - 1"> / </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="music_info.genre" label="Genre" width="200" align="center" />
                <el-table-column label="Operations" align="center" >
                    <template #default="scope">
                        <el-popconfirm title="Remove from the playlist?" width="250"  @confirm="RemoveMusic(scope.$index, scope.row)">
                            <template #reference>
                                <el-button size='small' type="danger"><el-icon><Close /></el-icon>Remove</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'PlaylistDetail',
  props: {
    id: String      // 播放列表id
  },
  data() {
    return {
      params: {
        search: '',     // 搜索的内容
        playlist: this.id,    // 选择的播放列表ID，实际上为props.id
      },
      playlistInfo: {   // 播放列表本身的信息
        name: '',
        description: '',
        user: 0,        // 播放列表创建者id
        full_user: ''   // 播放列表创建者
      },
      form: {
        name: '',
        description: '',    // 修改播放列表时的表单。该表单由 dialog 弹出
        user: 0
      },
      playlistContents: [],        // 播放列表中的音乐
      dialogVisible: false,        // dialog 弹出
      
      rules:{
                name: [
                    { required: true, message: 'Please input the playlist name', trigger: 'blur' },
                ],
                
            },
    };
    
  },
    methods: {
        // 获取播放列表本身的信息
        getPlaylistInfomation(){
            this.axios.get('api/playlists/' + this.id + '/').then(response => {
                this.playlistInfo = response.data;
                this.form.name = this.playlistInfo.name;
                this.form.description = this.playlistInfo.description;
                this.form.user = this.playlistInfo.user;
                console.log("Successfully fetched list data");
            }).catch(error => {
                console.log(error);
            });
        },
        // 获取播放列表的内容
        getMusicList(){
            this.axios.get('api/playlistcontents/', {
                params: this.params
            }).then(response => {
                this.playlistContents = response.data
            }).catch(error => {
                console.log(error);

            });
        },
        // 将播放列表中的音乐移出歌单
        RemoveMusic(index, row){
            this.axios.delete('api/playlistcontents/'+row.id+'/').then((response) => {
                console.log(response);
                this.getMusicList();
                ElMessage({
                message: 'Music removed',
                type: 'success'
                });
            }).catch(error => {
                console.log(error);
                ElMessage({
                message: 'Error removing music',
                type: 'error'
                });
            });
        },
        
        
        // 删除播放列表
        deletePlaylist(){
            this.axios.delete('api/playlists/'+this.id+'/').then((response) => {
                console.log(response);
                this.getPlaylistInfomation();
                ElMessage({
                message: 'Playlist deleted',
                type: 'success'
                });
                this.$router.replace({name: 'playlistlist'});
            }).catch(error => {
                console.log(error);
                ElMessage({
                message: 'Error deleting playlist',
                type: 'error'
                });
            });
        },
        confirmAction(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.axios.put('api/playlists/'+this.id+'/', this.form)
                    .then(response => {
                        console.log(response);
                        this.dialogVisible = false;
                        ElMessage({
                            message: 'Playlist information updated successfully',
                            type: 'success'
                        });
                        this.getPlaylistInfomation();
                    })
                    .catch(error => {
                        ElMessage({
                            message: 'Error updating playlist. Please check the form input.',
                            type: 'error',
                            grouping: true,
                        });
                        console.log(error);
                        console.log(this.form);
                    });
                }
            });
        }
        
    },
    mounted: function(){
        this.params.playlist = this.id;
        this.getPlaylistInfomation();
        this.getMusicList();
    },
    created: function(){
        this.$watch(
            () => this.id,
            () => {
                this.params.playlist = this.id;
                this.getPlaylistInfomation();
                this.getMusicList();
            })
    }

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