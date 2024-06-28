<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item >音乐列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 音乐列表标题及搜索框、添加框 -->
        <el-row justify="space-evenly">
            <el-col :span="8">
                <div class="list-title">
                    Music List
                </div>
            </el-col>
            <el-col :span="11">
                <div class="flex-content">
                    <el-input class="search-input" v-model="params.search" placeholder="Search a music..." clearable />
                    <el-button-group>
                        <el-button class='general-button' type="primary"  @click="getMusic" >
                            <el-icon><search /></el-icon>   Search 
                        </el-button>
                        <el-button class="general-button" type="primary" @click="newMusicDialog=true"><el-icon><Music /></el-icon> New Music</el-button>
                    </el-button-group>
                </div>
            </el-col>
        </el-row>

        <!-- 添加音乐对话框 -->
        <el-dialog v-model="newMusicDialog" title="Create New Music" >
            <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Title" prop="title" >
                        <el-input v-model="form.title" placeholder="Enter title"  />
                    </el-form-item>
                    <el-form-item label="Artist" prop="artist" >
                        <el-select v-model="form.artist" multiple placeholder="Choose Artist">
                            <el-option v-for="artist in artistlists" :key="artist.id" :label="artist.name" :value="artist.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Album" prop="album">
                        <el-input v-model="form.album" placeholder="Enter album" />
                    </el-form-item>
                    <el-form-item label="Genre" prop="genre">
                        <el-input v-model="form.genre" placeholder="Enter genre" />
                    </el-form-item>
                    <el-form-item label="Release Date" prop="release_date">
                        <el-date-picker value-format="YYYY-MM-DD" v-model="form.release_date" type="date" placeholder="Select a date" />
                    </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="newMusicDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="newMusicConfirm"> Confirm </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 音乐列表 -->
        <el-table :data="musiclists" :style="{ width: '100%' }" stripe >
            <el-table-column prop="title" label="Title" width="220" align="center" />
            <el-table-column prop="album" label="Album" width="180" align="center" />
            <el-table-column label="Artist" width="220" align="center">
                <template #default="scope">
                    <span v-for="(arti, index) in scope.row.artist_full" :key="index">
                        <el-link @click="$router.push({name: 'artistdetail', params: {id: arti.id}})" target="_blank">{{arti.name}}</el-link>
                        <span v-if="index < scope.row.artist_full.length - 1"> / </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="genre" label="Genre" width="180" align="center" />
            <el-table-column prop="release_date" label="Release Date" width="200" align="center" />
            <el-table-column label="Operations" align="center" >
                <template #default="scope">
                    <el-button size='small' @click="$router.push({name: 'musicdetail', params: {id: scope.row.id}})"><el-icon><Document /></el-icon>Detail</el-button>
                    <el-popconfirm title="All info will be lost. Delete the music?" width="250"  @confirm="deleteMusic(scope.$index, scope.row)">
                        <template #reference>
                            <el-button size='small' type="danger"><el-icon><Delete /></el-icon>Delete</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button size="small" @click="addPlaylist(scope.row)" plain type="primary"><el-icon><Plus /></el-icon></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加到播放列表对话框 -->
         <el-dialog v-model="addPlaylistDialog" title="Add to a playlist">
             <el-form ref="formRef" :model="playlistlists" label-width="auto"> 
                <el-form-item label="Playlist">
                    <el-select v-model="selectedPlaylist" placeholder="Choose a playlist to add to">
                        <el-option v-for="playlist in playlistlists" :key="playlist.id" :label="playlist.name" :value='playlist.id'  ></el-option>
                    </el-select>
                </el-form-item>
             </el-form>
             <template #footer>
                 <span class="dialog-footer">
                     <el-button @click="addPlaylistDialog = false">Cancel</el-button>
                     <el-button type="primary" @click="addPlaylistComfirm"> Confirm </el-button>
                 </span>
             </template>
         </el-dialog>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'MusicLists',
  data() {
    return {
      musiclists: [],
      params: {
        search: '',
        title: '',
        album: '',
        genre: '',
        release_date: '',
      },

      artistlists: [],
      newMusicDialog: false,

      playlistlists : [],
      selectedPlaylist: '',
      selectedMusic: '',
      addPlaylistDialog: false,

      form: {
        title: '',
        album: '',
        genre: '',
        artist: [ ],
        release_date: '',
      },

      rules:{
                title: [
                    { required: true, message: 'Please input the title', trigger: 'blur' },
                ],
                album: [
                    { required: true, message: 'Please input the album', trigger: 'blur' },
                ],
                genre: [
                    { required: true, message: 'Please input the genre', trigger: 'blur' },
                ],
                release_date: [
                    { required: true, message: 'Please input the release date', trigger: 'blur' },
                ],
                artist: [
                    { required: true, message: 'Please select the artist', trigger: 'blur' },
                ],
            },
    };
    
  },
    methods: {
        getMusic(){
            this.axios.get('api/musics/', {
                params: this.params
            }).then(response => {
                this.musiclists = response.data;
            }).catch(error => {
                console.log(error);
                ElMessage({
                    message: 'Error fetching music data',
                    type: 'error'
                });
            });
        },
        deleteMusic(index, row){
            this.axios.delete('api/musics/'+row.id+'/').then((response) => {
                console.log(response);
                this.getMusic();
                ElMessage({
                message: 'Music deleted',
                type: 'success'
                });
            }).catch(error => {
                console.log(error);
                ElMessage({
                message: 'Error deleting music',
                type: 'error'
                });
            });
        },
        newMusicConfirm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.axios.post('api/musics/', this.form)
                    .then(response => {
                        console.log(response);
                        this.newMusicDialog = false;
                        this.getMusic();
                        ElMessage({
                            message: 'Music created successfully',
                            type: 'success'
                        });
                    })
                    .catch(error => {
                        ElMessage({
                            message: 'Error creating music. Please check the form input.',
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
        getPlaylist(){
            let user = this.$store.state.userId;
            user = user === 0 ? '' : user;
            this.axios.get('api/playlists/', {
                params: {
                    user: user
                }
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
        addPlaylist(music){
            this.selectedMusic = music.id;
            this.addPlaylistDialog = true;
        },
        addPlaylistComfirm(){
            const playlist = this.selectedPlaylist;
            const music = this.selectedMusic;
            this.axios.post('api/playlistcontents/', {
                playlist: playlist,
                music: music
            }).then(response => {
                console.log(response);
                this.addPlaylistDialog = false;
                ElMessage({
                    message: 'Music added to playlist successfully',
                    type: 'success'
                });
            }).catch(error => {
                console.log(error);
                ElMessage({
                    message: 'Music already in the playlist.',
                    type: 'error'
                });
            });
        },
        getArtistList(){
            this.axios.get('api/artists/').then(response => {
                this.artistlists = response.data;
            }).catch(error => {
                console.log(error);
                ElMessage({
                    message: 'Error fetching artist data',
                    type: 'error'
                });
            });
        }
    },
    mounted: function(){
        this.getMusic();
        this.getPlaylist();
        this.getArtistList();
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