import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PersonalPage from '../views/personalPage.vue'
import Homepage from '../views/homepage.vue'
import ArticleList from '../components/Article/articleList.vue'
import Board from '../components/User/Board/board.vue'
import Favorite from '../components/User/Fav/fav.vue'
import Friend from '../components/User/Friend/friend.vue'
import Post from '../components/Post/post.vue'
import Login from '../components/User/login.vue'
import PersonalInfo from '../components/User/personalInfo.vue'
import ModifyInfo from '../components/User/modifyInfo.vue'
import Article from '../components/Article/article.vue'
import ArticlePage from '../views/articlePage.vue'
import ArticleModify from '../components/Article/articleModify.vue'
import PostPage from '../views/postPage.vue'
import UserInfo from '../components/User/userPage.vue'
import PostList from '../components/Post/postList.vue'
import ThreadList from '../components/Thread/threadList.vue'
import Thread from '../components/Thread/thread.vue'
import ThreadPage from '../views/threadPage.vue'
import ThreadModify from '../components/Thread/threadModify.vue'
import Editor from '../components/Editor/editor.vue'
import PostModify from '../components/Post/postModify.vue'
import Search from '../components/Search/search.vue'
import Overview from '../components/User/overview.vue'
import FriendCircle from '../components/User/Friend/circle.vue'
import FriendList from '../components/User/Friend/friendList.vue'
import FriendApply from '../components/User/Friend/friendApply.vue'
import FavArticles from '../components/User/Fav/articles.vue'
import FavPosts from '../components/User/Fav/post.vue'
import FavThreads from '../components/User/Fav/threads.vue'
import UserMsgBoard from '../components/User/userMsgBoard.vue'
import MyApply from '../components/User/Friend/myApply.vue'
import History from '../components/User/History/history.vue'
import TopAll from '../components/Homepage/topAll.vue'
import { ElMessage } from 'element-plus'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    name: '/',
    component: Homepage
  },
  {
    path: '/topAll/:mode',
    name: 'topAll',
    component: TopAll,
    props: true
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    props: route => ({
      text: route.query.text,
      mode: route.query.mode
    })
  },
  {
    path: '/article',
    name: '/article',
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
    name: '/post',
    component: PostPage
  },
  {
    path: '/post/:id',
    name: 'post',
    component: Post,
    props: true
  },
  {
    path: '/post/modify/:id',
    name: 'postModify',
    component: PostModify,
    props: true
  },
  {
    path: '/thread',
    name: '/thread',
    component: ThreadPage
  },
  {
    path: '/thread/:id',
    name: 'thread',
    component: Thread,
    props: true
  },
  {
    path: '/thread/modify/:id',
    name: 'threadModify',
    component: ThreadModify,
    props: true
  },

  {
    path: '/login',
    component: Login
  },

  {
    path: '/personal',
    component: PersonalPage,
    children: [
      {
        path: '',
        component: Overview
      },
      {
        path: 'friend',
        name: 'personalFriend',
        component: Friend,
        children: [
          {
            path: '',
            redirect: '/personal/friend/circle'
          },
          {
            path: 'circle',
            name: 'friendCircle',
            component: FriendCircle
          },
          {
            path: 'list',
            name: 'friendList',
            component: FriendList
          },
          { path: 'apply', name: 'friendApply', component: FriendApply },
          {
            path: 'myApply',
            name: 'myApply',
            component: MyApply
          }
        ]
      },
      {
        path: 'favorite',
        name: 'personalFav',
        component: Favorite,
        children: [
          {
            path: '',
            redirect: '/personal/favorite/article'
          },
          {
            path: 'article',
            name: 'favArticle',
            component: FavArticles
          },
          {
            path: 'post',
            name: 'favPost',
            component: FavPosts
          },
          {
            path: 'thread',
            name: 'favThread',
            component: FavThreads
          }
        ]
      },
      {
        path: 'history',
        name: 'personalHistory',
        component: History
        // props: route => ({
        //   range: route.query.range,
        //   mode: route.query.mode
        // })
        // children: [
        //   {
        //     path: '',
        //     redirect: '/personal/history/article'
        //   },
        //   {
        //     path: 'article',
        //     name: 'articleHistory',
        //     component: ArticleHistory,

        //   },
        //   {
        //     path: 'post',
        //     name: 'postHistory',
        //     component: PostHistory
        //   },
        //   {
        //     path: 'zipfile',
        //     name: 'zipfileHistory',
        //     component: ZipfileHistory
        //   }
        // ]
      },
      {
        path: 'board',
        name: 'personalBoard',
        component: Board
      },
      {
        path: 'info',
        name: 'persoanlInfo',
        component: PersonalInfo
      },
      { path: 'modify', component: ModifyInfo }
    ]
  },

  {
    path: '/user/:userId',
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
      },
      {
        path: 'board',
        name: 'userMsgBoard',
        component: UserMsgBoard,
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
  if (!localStorage.getItem('token') && to.path !== '/login') {
    ElMessage.warning({
      message: '您还没有登录',
      offset: 80
    })
    return '/login'
  } else {
    return true
  }
})
router.afterEach(() => {})

export default router
