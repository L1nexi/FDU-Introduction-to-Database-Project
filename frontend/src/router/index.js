import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  // 默认路由
  {
    path: '/users',
    children: [
      { path: '', name: 'userlist', component: () => import('../views/UserLists.vue') },
      { path: ':id', name: 'userdetail', component: () => import('../views/UserDetail.vue'), props: true
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/artists',
    children: [
      { path: '', name: 'artistlist', component: () => import('../views/ArtistLists.vue') },
      { path: ':id', name: 'artistdetail', component: () => import('../views/ArtistDetail.vue'), props: true
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/music',
    // component: () => import('../views/MusicList.vue'),
    name: 'musiclist',
    children: [
      { path: '', name: 'musiclist', component: () => import('../views/MusicList.vue')},
      { path: ':id', name: 'musicdetail', component: () => import('../views/MusicDetail.vue'), props: true}
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/playlist',
    component: () => import('../views/PlaylistList.vue'),
    name: 'playlistlist',
    children: [
      { path: ':id', name: 'playlistdetail', component: () => import('../views/PlaylistDetail.vue'), props: true}
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = store.state.userId !== -1;

  if (requiresAuth && !isLoggedIn) {
    ElMessage({
      showClose: true,
      message: 'You must be logged in to view this page.',
      type: 'error'
    })
    next({ name: 'login'});
  } else {
    next();
  }
})

export default router
