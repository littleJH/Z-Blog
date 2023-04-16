# Diff Details

Date : 2023-04-10 10:21:54

Directory d:\\projectCode\\blog\\src

Total : 87 files,  6159 codes, 452 comments, 343 blanks, all 6954 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | -11 | 0 | -8 | -19 |
| [index.html](/index.html) | HTML | -13 | 0 | -1 | -14 |
| [package.json](/package.json) | JSON | -31 | 0 | -1 | -32 |
| [postcss.config.cjs](/postcss.config.cjs) | JavaScript | -6 | 0 | -1 | -7 |
| [public/blogger.svg](/public/blogger.svg) | XML | -1 | 0 | 0 | -1 |
| [src/App.vue](/src/App.vue) | vue | 12 | 0 | 3 | 15 |
| [src/api/article.ts](/src/api/article.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/api/friend.ts](/src/api/friend.ts) | TypeScript | 2 | 0 | 2 | 4 |
| [src/api/guestbook.ts](/src/api/guestbook.ts) | TypeScript | -4 | 0 | 0 | -4 |
| [src/api/label.ts](/src/api/label.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/api/post.ts](/src/api/post.ts) | TypeScript | 19 | 0 | 6 | 25 |
| [src/api/search.ts](/src/api/search.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [src/api/thread.ts](/src/api/thread.ts) | TypeScript | 24 | 0 | 6 | 30 |
| [src/api/user.ts](/src/api/user.ts) | TypeScript | -5 | 0 | 0 | -5 |
| [src/assets/favorite.svg](/src/assets/favorite.svg) | XML | 1 | 0 | 0 | 1 |
| [src/assets/favorites-fill.svg](/src/assets/favorites-fill.svg) | XML | 1 | 0 | 0 | 1 |
| [src/assets/favorites.svg](/src/assets/favorites.svg) | XML | 1 | 0 | 0 | 1 |
| [src/assets/invisible.svg](/src/assets/invisible.svg) | XML | 1 | 0 | 0 | 1 |
| [src/assets/like.svg](/src/assets/like.svg) | XML | 1 | 0 | 0 | 1 |
| [src/assets/like_fill.svg](/src/assets/like_fill.svg) | XML | 1 | 0 | 0 | 1 |
| [src/assets/normail.css](/src/assets/normail.css) | PostCSS | 146 | 0 | 34 | 180 |
| [src/assets/tag.svg](/src/assets/tag.svg) | XML | 1 | 0 | 0 | 1 |
| [src/components/Article/article.vue](/src/components/Article/article.vue) | vue | 488 | 24 | 14 | 526 |
| [src/components/Article/articleList.vue](/src/components/Article/articleList.vue) | vue | 180 | 117 | 16 | 313 |
| [src/components/Article/articleModify.vue](/src/components/Article/articleModify.vue) | vue | 181 | 1 | 7 | 189 |
| [src/components/Board/board.vue](/src/components/Board/board.vue) | vue | 0 | 0 | -1 | -1 |
| [src/components/Editor/editor.vue](/src/components/Editor/editor.vue) | vue | 256 | 1 | 11 | 268 |
| [src/components/Favorite/favorite.vue](/src/components/Favorite/favorite.vue) | vue | 0 | 0 | -1 | -1 |
| [src/components/Friend/friend.vue](/src/components/Friend/friend.vue) | vue | 0 | 0 | -1 | -1 |
| [src/components/Header/header.vue](/src/components/Header/header.vue) | vue | 34 | 42 | 3 | 79 |
| [src/components/History/history.vue](/src/components/History/history.vue) | vue | 0 | 0 | -1 | -1 |
| [src/components/Homepage/articles.vue](/src/components/Homepage/articles.vue) | vue | 42 | 0 | 3 | 45 |
| [src/components/Homepage/homepage.vue](/src/components/Homepage/homepage.vue) | vue | -5 | 0 | -1 | -6 |
| [src/components/Homepage/loading.vue](/src/components/Homepage/loading.vue) | vue | 5 | 0 | 1 | 6 |
| [src/components/Homepage/posts.vue](/src/components/Homepage/posts.vue) | vue | 46 | 0 | 3 | 49 |
| [src/components/Homepage/users.vue](/src/components/Homepage/users.vue) | vue | 50 | 0 | 2 | 52 |
| [src/components/Post/post.vue](/src/components/Post/post.vue) | vue | 739 | 12 | 33 | 784 |
| [src/components/Post/postList.vue](/src/components/Post/postList.vue) | vue | 169 | 111 | 14 | 294 |
| [src/components/Post/postModify.vue](/src/components/Post/postModify.vue) | vue | 96 | 1 | 8 | 105 |
| [src/components/Search/search.vue](/src/components/Search/search.vue) | vue | 213 | 0 | 7 | 220 |
| [src/components/Thread/thread.vue](/src/components/Thread/thread.vue) | vue | 188 | 2 | 13 | 203 |
| [src/components/Thread/threadList.vue](/src/components/Thread/threadList.vue) | vue | 337 | 5 | 14 | 356 |
| [src/components/Thread/threadModify.vue](/src/components/Thread/threadModify.vue) | vue | 101 | 1 | 9 | 111 |
| [src/components/User/Board/board.vue](/src/components/User/Board/board.vue) | vue | 36 | 0 | 3 | 39 |
| [src/components/User/Board/myMessage.vue](/src/components/User/Board/myMessage.vue) | vue | 56 | 0 | 4 | 60 |
| [src/components/User/Fav/articles.vue](/src/components/User/Fav/articles.vue) | vue | 38 | 0 | 4 | 42 |
| [src/components/User/Fav/fav.vue](/src/components/User/Fav/fav.vue) | vue | 53 | 0 | 3 | 56 |
| [src/components/User/Fav/post.vue](/src/components/User/Fav/post.vue) | vue | 37 | 0 | 3 | 40 |
| [src/components/User/Fav/threads.vue](/src/components/User/Fav/threads.vue) | vue | 39 | 0 | 4 | 43 |
| [src/components/User/Friend/circle.vue](/src/components/User/Friend/circle.vue) | vue | 65 | 0 | 4 | 69 |
| [src/components/User/Friend/friend.vue](/src/components/User/Friend/friend.vue) | vue | 68 | 0 | 3 | 71 |
| [src/components/User/Friend/friendApply.vue](/src/components/User/Friend/friendApply.vue) | vue | 112 | 0 | 4 | 116 |
| [src/components/User/Friend/friendList.vue](/src/components/User/Friend/friendList.vue) | vue | 96 | 0 | 4 | 100 |
| [src/components/User/Friend/myApply.vue](/src/components/User/Friend/myApply.vue) | vue | 44 | 0 | 3 | 47 |
| [src/components/User/History/history.vue](/src/components/User/History/history.vue) | vue | 3 | 0 | 1 | 4 |
| [src/components/User/info.vue](/src/components/User/info.vue) | vue | -74 | 0 | -3 | -77 |
| [src/components/User/login.vue](/src/components/User/login.vue) | vue | -79 | 0 | 1 | -78 |
| [src/components/User/modifyInfo.vue](/src/components/User/modifyInfo.vue) | vue | 121 | 6 | 2 | 129 |
| [src/components/User/overview.vue](/src/components/User/overview.vue) | vue | 135 | 7 | 6 | 148 |
| [src/components/User/personalInfo.vue](/src/components/User/personalInfo.vue) | vue | 96 | 6 | 3 | 105 |
| [src/components/User/user.vue](/src/components/User/user.vue) | vue | -11 | 0 | -1 | -12 |
| [src/components/User/userMsgBoard.vue](/src/components/User/userMsgBoard.vue) | vue | 125 | 0 | 8 | 133 |
| [src/components/User/userPage.vue](/src/components/User/userPage.vue) | vue | 277 | 3 | 14 | 294 |
| [src/components/alertCard.vue](/src/components/alertCard.vue) | vue | 35 | 0 | 3 | 38 |
| [src/components/articleCard.vue](/src/components/articleCard.vue) | vue | 106 | 0 | 9 | 115 |
| [src/components/labelCard.vue](/src/components/labelCard.vue) | vue | 21 | 0 | 2 | 23 |
| [src/components/levelCard.vue](/src/components/levelCard.vue) | vue | 115 | 0 | 2 | 117 |
| [src/components/messageCard.vue](/src/components/messageCard.vue) | vue | 88 | 0 | 3 | 91 |
| [src/components/postCard.vue](/src/components/postCard.vue) | vue | 106 | 0 | 9 | 115 |
| [src/components/threadCard.vue](/src/components/threadCard.vue) | vue | 151 | 4 | 8 | 163 |
| [src/components/userCard.vue](/src/components/userCard.vue) | vue | 76 | 0 | 4 | 80 |
| [src/index.css](/src/index.css) | PostCSS | 44 | 5 | 5 | 54 |
| [src/main.ts](/src/main.ts) | TypeScript | 36 | 3 | 3 | 42 |
| [src/router/index.ts](/src/router/index.ts) | TypeScript | -59 | 0 | -5 | -64 |
| [src/router/router.ts](/src/router/router.ts) | TypeScript | 233 | 7 | 10 | 250 |
| [src/shims.d.ts](/src/shims.d.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [src/stores/index.ts](/src/stores/index.ts) | TypeScript | -52 | 0 | -5 | -57 |
| [src/stores/store.ts](/src/stores/store.ts) | TypeScript | 107 | 27 | 14 | 148 |
| [src/views/articlePage.vue](/src/views/articlePage.vue) | vue | 13 | 0 | 2 | 15 |
| [src/views/homepage.vue](/src/views/homepage.vue) | vue | 512 | 67 | 10 | 589 |
| [src/views/personalPage.vue](/src/views/personalPage.vue) | vue | 143 | 2 | 5 | 150 |
| [src/views/postPage.vue](/src/views/postPage.vue) | vue | 13 | 0 | 2 | 15 |
| [src/views/threadPage.vue](/src/views/threadPage.vue) | vue | 13 | 0 | 2 | 15 |
| [tailwind.config.cjs](/tailwind.config.cjs) | JavaScript | -12 | -1 | 0 | -13 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | -18 | 0 | -1 | -19 |
| [tsconfig.node.json](/tsconfig.node.json) | JSON | -9 | 0 | -1 | -10 |
| [vite.config.ts](/vite.config.ts) | TypeScript | -11 | -1 | -2 | -14 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details