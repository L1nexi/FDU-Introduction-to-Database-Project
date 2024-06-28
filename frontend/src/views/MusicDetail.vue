<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'musiclist'}">音乐列表</el-breadcrumb-item>
            <el-breadcrumb-item>音乐详细信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 音乐详细信息 ：标题及编辑按钮-->
        <el-row justify="space-evenly">
            <el-col :span="8">
                <div class="list-title">
                    {{ musicInfo.title }}
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

        <!-- 音乐详细信息 ：表单 -->
        <el-row>
            <el-col :span="8" :offset="1">
                <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 600px" :rules="rules"> 
                    <el-form-item label="Title" prop="title" >
                        <el-input v-model="form.title" placeholder="Enter title" :disabled="!isEdit" />
                    </el-form-item>
                    <el-form-item label="Album" prop="album">
                        <el-input v-model="form.album" placeholder="Enter album" :disabled="!isEdit" />
                    </el-form-item>
                    <el-form-item label="Artist" prop="artist">
                        <el-select v-model="form.artist" multiple placeholder="Enter Artist">
                            <el-option v-for="item in musicInfo.artist_full" :key="item.id" :label="item.name" :value="item.id" disabled />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Genre" prop="genre">
                        <el-input v-model="form.genre" placeholder="Enter genre" :disabled="!isEdit" />
                    </el-form-item>
                    <el-form-item label="Release Date" prop="release_date">
                        <el-date-picker value-format="YYYY-MM-DD" v-model="form.release_date" type="date" placeholder="Pick a date" :disabled="!isEdit" />
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script >
import { ElMessage } from 'element-plus';

export default{
    name: 'MusicDetail',
    props:{
        id: String
    },
    data(){
        return{
            form: {
                title: '',
                album: '',
                artist: '',
                genre: '',
                release_date: '',
                artist_full: [],
            },
            musicInfo: {
                title: '',
                album: '',
                artist: '',
                genre: '',
                release_date: '',
                artist_full: [],
            },
            isEdit: false,
            rules:{
                title: [
                    { required: true, message: 'Please input the title', trigger: 'blur' },
                ],
                artist: [
                    { required: true, message: 'Please input the artist', trigger: 'blur' },
                ],
            },
        }
    },
    methods:{
        getMusicDetail(){
            this.axios.get("api/musics/" + this.id + "/")
            .then(response => {
                this.musicInfo = response.data;
                this.resetInfo();
            })
            .catch(error => {
                console.log(error);
            });
        },
        putMusicDetail(){
            this.axios.put("api/musics/" + this.id + "/", this.form)
            .then(response => {
                ElMessage({
                        message: 'Edition Saved Successfully.',
                        type: 'success',
                        grouping: true,
                    })
                this.musicInfo = response.data;
                this.resetInfo();
                console.log("Music updated successfully");
            })
            .catch(error => {
                ElMessage({
                    message: 'Error saving the edition.',
                    type: 'error',
                    grouping: true,
                })
                console.log(error);
            });
        },
        submitForm(){
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.putMusicDetail();
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
            this.form = JSON.parse(JSON.stringify(this.musicInfo));
            this.isEdit = false;
        },
    },
    mounted: function(){
        this.getMusicDetail();
    },
    created: function(){
        this.$watch(
            () => this.id,
            () => {
                this.getMusicDetail();
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