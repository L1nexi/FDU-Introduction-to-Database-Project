<template>
    <h1>
        This is testView, Id is:
    </h1>
    <h2>
        {{ id }}
    </h2>
    <h2>The Music with id {{ id }} is </h2>
    <h3>{{ music.title }}</h3>
    <h3>{{ music.genre }}</h3>
    <h3>{{ userState }}</h3>
    <div>
        <router-el-link :to="{name: 'test', params: {id: '1'}}">Song1</router-el-link> |
        <router-el-link :to="{name: 'test', params: {id: '2'}}">Song2</router-el-link> |
        <router-el-link :to="{name: 'test', params: {id: '3'}}">Song3</router-el-link> |
        <router-el-link :to="{name: 'test', params: {id: '4'}}">Song4</router-el-link> |
        <router-el-link :to="{name: 'test', params: {id: '5'}}">Song5</router-el-link> 
    </div>
</template>

<script>
    import RouterElLink from '@/components/RouterElLink.vue'
// import { RouterLink } from 'vue-router';
    export default {
        components: {
            RouterElLink
        },
        name: 'HomeTest',
        data() {
            return {
                music: {}
            };
        },
        props:{
            id: String
        },
        methods:{
            getMusic(){
                this.axios.get("api/musics/" + this.id + "/")
                // this.axios.get("api/musics/" + this.$route.params.id + "/")
                .then(response => {
                    this.music = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        mounted: function(){
            this.getMusic();
        },
        created() {
            this.$watch(
            () => this.id,
            () => {
                // 对路由变化做出响应...
                this.getMusic();
            }
            )
        },
        computed: {
            userState() {
                return this.$store.getters.getUserState
            }
        },  
    }
</script>
