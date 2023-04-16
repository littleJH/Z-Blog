# ZBlog

本项目是一个基于 Vite、Vue 和 Tainwindcss 构建的个人博客网站。该网站提供一个简单而优雅的博客平台，提供给用户高质量的内容和用户体验。



## 网站示例



## 技术栈

- Vue3：更加高效、灵活和易于使用的Vue.js框架版本
- Vite：进行生产构建，代替了Vue Cli
- Tailwind Css：一种基于原子类的CSS框架
- ElementPlus：功能强大、易于使用、高度可定制的Vue.js UI框架
- Axios：用于处理HTTP请求和响应
- Tocbot：用于生成文章目录
- moment：对时间进行初始化、格式化等
- vue-markdown：提供markdown编辑器和markdown文件渲染功能
- highlight.js：代码高亮处理

## 安装和使用

1. 克隆该仓库到本地：

   ```bash
   git clone https://github.com/littleJH/ZBlog.git
   ```

2. 进入项目目录并安装依赖：

   ```bash
   cd ZBlog
   npm install
   ```

3. 启动：

   ```bash
   npm run dev
   ```



## 功能和特点

### 功能 

#### 首页

- 热度排行、推荐
- 热度总榜

  ![](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416144952261.png)



#### 搜索

- 搜索文章、帖子、跟帖、用户
- 按文本搜索、按标签搜索

  ![image-20230416150542179](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416150542179.png)



#### 文章 & 帖子 & 跟帖列表

![image-20230416145154912](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145154912.png)

![image-20230416145111869](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145111869.png)

![image-20230416145127920](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145127920.png)



#### 文章

- 文章主体
- 作者卡片
- 文章目录
- 点赞收藏
- 查看点赞收藏列表
- 回到顶部
- 编辑文章
- 删除文章

  ![image-20230416150710719](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416150710719.png)



#### 帖子

- 帖子主体
- 跟帖
- 跟帖列表
- 作者卡片
- 点赞收藏
- 编辑帖子
- 删除帖子

  ![image-20230416145358694](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145358694.png)



#### 跟帖

- 跟帖主体

  ![image-20230416145422536](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145422536.png)



#### 创作中心

- 在线编辑
- 导入本地文件/保存

- 自定义标签
- 设置文章私密等级
- 发布为文章/帖子

  ![image-20230416145534825](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145534825.png)



#### 个人中心

- 好友：好友圈、好友列表、好友申请、我的申请
- 收藏：收藏的文章、帖子、跟帖
- 历史：浏览历史记录
- 留言：用户留言列表
- 我的：个人资料展示、编辑

  ![image-20230416145654229](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145654229.png)



#### 用户主页

- 添加好友
- 给用户留言
- 展示文章、帖子、跟帖、留言板列表
- 查找该用户的内容

  ![image-20230416145746115](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416145746115.png)



### 特点

#### 深色模式

使用低对比度的颜色搭配和星空背景构建深色模式

![image-20230416150005756](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416150005756.png)



#### 加载动画

- 上方蓝色加载进度条

- 需要加载的主体使用骨架结构占位

- 加载完成的列表和列表中删除的项使用Vue的内置组件`<TransitionGroup>`进行动画过渡

  ```css
  .list-move, /* 对移动中的元素应用的过渡 */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  
  /* 确保将离开的元素从布局流中删除
    以便能够正确地计算移动的动画。 */
  .list-leave-active {
    position: absolute;
  }
  ```

  ![image-20230416150130636](https://raw.githubusercontent.com/littleJH/PicBed/main/img/image-20230416150130636.png)



#### 目录跟随滚动条滚动

当滚动文章时，文章的目录会跟随滚动到对应位置

