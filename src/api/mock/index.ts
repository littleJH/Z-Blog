import Mock from 'mockjs'
import { chitchatUrl } from '../../request'

Mock.mock(`/api_chitchat/personal`, (options) => {
  const data = Mock.mock({
    "Name": "@name",
    "Email": "@EMAIL",
    "Telephone": "@string('number', 11)",
    "Blog": "@url",
    "QQ": "@string('number', 9, 11)",
    "Sex": "@boolean",
    "Hobby": "@sentence(3, 5)",
    "Address": "@county(true)",
    "Icon": "@image('200x200', '#50B347', '#FFF', 'Mock.js')",
    "ID": "@guid",
    "HotLevel|1-100": 1,
    "Powerpoints|1-5": [
      {
        "title": "@title",
        "content": "@paragraph"
      }
    ],
    "Labels|1-3": ["@word"]
  })
  return {
    code: 200,
    data: {
      user: data
    },
    message: 'success'
  }
}
)

Mock.mock('/api_blog/hot/article?pageNum=1&pageSize=3', (options) => {
  const data = Mock.mock({
    "articles|3": [
      {
        "Score|1-100": 1,
        "Member": "@name"
      }
    ],
    "articleList|3": [
      {
        "id": "@guid",
        "user_id": "@guid",
        "author": "@name",
        "title": "@title",
        "content": "@paragraph",
        "briefContent": "@sentence(10, 20)",
        "res_long": "@url",
        "res_short": "@url",
        "visible|0-1": 1,
        "created_at": "@datetime",
        "updated_at": "@datetime",
        "labels|1-5": ["@word"],
        "level|1-10": 1,
        "likeFlag|1": true,
        "likeNum|0-1000": 1,
        "favoriteFlag|1": true,
        "favNum|0-1000": 1
        // "likeIcon": "@image('50x50', '#FFCC33', '#FFF', 'Like')",
        // "favIcon": "@image('50x50', '#FFCC33', '#FFF', 'Fav')"
      }
    ]
  }
  )
  console.log("🚀 ~ Mock.mock ~ data:", data)
  return {
    code: 200,
    data: {
      articles: data.articles,
    },
    message: 'success'
  }
})

Mock.mock('/api_blog/hot/post?pageNum=1&pageSize=3', (options) => {
  const data = Mock.mock({
    "posts|3": [
      {
        "Score|1-100": 1,
        "Member": "@name"
      }
    ],
    "postList|3": [
      {
        "id": "@guid",
        "user_id": "@guid",
        "author": "@name",
        "title": "@title",
        "content": "@paragraph",
        "briefContent": "@sentence(10, 20)",
        "res_long": "@url",
        "res_short": "@url",
        "visible|0-1": 1,
        "created_at": "@datetime",
        "updated_at": "@datetime",
        "labels|1-5": ["@word"],
        "level|1-10": 1,
        "likeFlag|1": true,
        "likeNum|0-1000": 1,
        "favoriteFlag|1": true,
        "favNum|0-1000": 1,
        "threadTime|1-100": 1
        // "likeIcon": "@image('50x50', '#FFCC33', '#FFF', 'Like')",
        // "favIcon": "@image('50x50', '#FFCC33', '#FFF', 'Fav')"
      }
    ]
  }

  )
  console.log("🚀 ~ Mock.mock ~ data:", data)
  return {
    code: 200,
    data: {
      posts: data.posts
    },
    message: 'success'
  }
})

Mock.mock('/api_blog/hot/user?pageNum=1&pageSize=3', (options) => {
  const data = Mock.mock({
    "users|3": [
      {
        "Score|1-100": 1,
        "Member": "@name"
      }
    ],
    "userList|3": [
      {
        "Name": "@name",
        "Email": "@EMAIL",
        "Telephone": "@string('number', 11)",
        "Blog": "@url",
        "QQ": "@string('number', 9, 11)",
        "Sex": "@boolean",
        "Hobby": "@sentence(3, 5)",
        "Address": "@county(true)",
        "Icon": "@image('200x200', '#50B347', '#FFF', 'Mock.js')",
        "ID": "@guid",
        "HotLevel|1-100": 1,
        "Powerpoints|1-5": [
          {
            "title": "@title",
            "content": "@paragraph"
          }
        ],
        "Labels|1-3": ["@word"]
      }
    ]
  }
  )
  console.log("🚀 ~ Mock.mock ~ data:", data)
  return {
    code: 200,
    data: {
      users: data.users
    },
    message: 'success'
  }
})

Mock.mock('/api_blog/hot/article/recomment?pageNum=1&pageSize=20', (options) => {
  return {
    code: 200,
    data: Mock.mock({
      "articles|1-10": [ "@guid"],
      "total": "@natural(1, 10)"
    }
    ),
    message: 'success'
  }
})

Mock.mock(/\/api_blog\/user\/label\/show\/*/, () => ({
  code: 200,
  data: {
    labels: Mock.mock({
      "labels|1-10": ["@word"]
    })
  },
  message: 'success'
}))

Mock.mock(/\/api_chitchat\/article\/[A-Za-z0-9%]+/, () => ({
  code: 200,
  data: {
    article: Mock.mock({
      "id": "@guid",
      "user_id": "@guid",
      "author": "@name",
      "title": "@title",
      "content": "@paragraph",
      "briefContent": "@sentence(10, 20)",
      "res_long": "@url",
      "res_short": "@url",
      "visible|0-1": 1,
      "created_at": "@datetime",
      "updated_at": "@datetime",
      "labels|1-5": ["@word"],
      "level|1-10": 1,
      "likeFlag|1": true,
      "likeNum|0-1000": 1,
      "favoriteFlag|1": true,
      "favNum|0-1000": 1
      // "likeIcon": "@image('50x50', '#FFCC33', '#FFF', 'Like')",
      // "favIcon": "@image('50x50', '#FFCC33', '#FFF', 'Fav')"
    })
  },
  message: 'success'
}))

Mock.mock(/\/api_chitchat\/post\/[A-Za-z0-9%]+/, () => ({
  code: 200,
  data: {
    post: Mock.mock({
      "id": "@guid",
      "user_id": "@guid",
      "author": "@name",
      "title": "@title",
      "content": "@paragraph",
      "briefContent": "@sentence(10, 20)",
      "res_long": "@url",
      "res_short": "@url",
      "visible|0-1": 1,
      "created_at": "@datetime",
      "updated_at": "@datetime",
      "labels|1-5": ["@word"],
      "level|1-10": 1,
      "likeFlag|1": true,
      "likeNum|0-1000": 1,
      "favoriteFlag|1": true,
      "favNum|0-1000": 1,
      "threadTime|1-100": 1
      // "likeIcon": "@image('50x50', '#FFCC33', '#FFF', 'Like')",
      // "favIcon": "@image('50x50', '#FFCC33', '#FFF', 'Fav')"
    })
  },
  message: 'success'
}))

Mock.mock(/\/api_chitchat\/personal\/[A-Za-z0-9%]+/, () => ({
  code: 200,
  data: {
    user: Mock.mock({
      "Name": "@name",
      "Email": "@EMAIL",
      "Telephone": "@string('number', 11)",
      "Blog": "@url",
      "QQ": "@string('number', 9, 11)",
      "Sex": "@boolean",
      "Hobby": "@sentence(3, 5)",
      "Address": "@county(true)",
      "Icon": "@image('200x200', '#50B347', '#FFF', 'Mock.js')",
      "ID": "@guid",
      "HotLevel|1-100": 1,
      "Powerpoints|1-5": [
        {
          "title": "@title",
          "content": "@paragraph"
        }
      ],
      "Labels|1-3": ["@word"]
    })
  },
  message: 'success'
}))
