import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import UserPage from '../views/userPage.vue'
import Homepage from '../views/homepage.vue'
import ArticleList from '../components/Article/articleList.vue'
import Board from '../components/Board/board.vue'
import Favorite from '../components/Favorite/favorite.vue'
import Friend from '../components/Friend/friend.vue'
import History from '../components/History/history.vue'
import Post from '../components/Post/post.vue'
import Login from '../components/User/login.vue'
import PersonalInfo from '../components/User/personalInfo.vue'
import ModifyInfo from '../components/User/modifyInfo.vue'
import Article from '../components/Article/article.vue'
import ArticlePage from '../views/articlePage.vue'
import ArticleModify from '../components/Article/articleModify.vue'
import PostPage from '../views/postPage.vue'
import UserInfo from '../components/User/userInfo.vue'
import PostList from '../components/Post/postList.vue'
import ThreadList from '../components/Thread/threadList.vue'
import Thread from '../components/Thread/thread.vue'
import Editor from '../components/Editor/editor.vue'
import { ElMessage } from 'element-plus'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    redirect: '/homepage'
  },
  {
    path: '/homepage',
    component: Homepage
  },
  {
    path: '/article',
    component: ArticlePage
  },
  {
    path: '/article/:id',
    name: 'article',
    component: Article,
    props: true
  },

  {
    path: '/article/modify/:id',
    name: 'articleModify',
    component: ArticleModify,
    props: true
  },
  {
    path: '/post',
    component: PostPage
  },
  {
    path: '/post/:id',
    name: 'post',
    component: Post,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'thread',
    component: Thread,
    props: true
  },
  {
    path: '/user',
    component: UserPage,
    children: [
      {
        path: 'login',
        component: Login
      },

      {
        path: 'personal',
        component: PersonalInfo
      },
      { path: 'modify', component: ModifyInfo }
    ]
  },
  {
    path: '/user/:userId',
    name: 'userInfo',
    component: UserInfo,
    props: true,
    children: [
      {
        path: 'article',
        name: 'userArticleList',
        component: ArticleList,
        props: true
      },
      {
        path: 'post',
        name: 'userPostList',
        component: PostList,
        props: true
      },
      {
        path: 'thread',
        name: 'userThreadList',
        component: ThreadList,
        props: true
      }
    ]
  },
  {
    path: '/editor',
    component: Editor
  }

  // {
  //   path: 'user/:id/:page',
  //   children: [{
  //     path: '',
  //     name: ''
  //   }]
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach(to => {
  if (!localStorage.getItem('token') && to.path !== '/user/login') {
    ElMessage.warning({
      message: '请先登录！',
      duration: 3000
    })
    return '/user/login'
  } else {
    return true
  }
})
router.afterEach(() => {})

export default router
