# Diff Details

Date : 2023-04-13 20:32:02

Directory d:\\projectCode\\blog

Total : 60 files,  1526 codes, -298 comments, 65 blanks, all 1293 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 11 | 0 | 8 | 19 |
| [demo.js](/demo.js) | JavaScript | 0 | 0 | 1 | 1 |
| [index.html](/index.html) | HTML | 13 | 0 | 1 | 14 |
| [package.json](/package.json) | JSON | 41 | 0 | 1 | 42 |
| [postcss.config.cjs](/postcss.config.cjs) | JavaScript | 6 | 0 | 1 | 7 |
| [public/blogger.svg](/public/blogger.svg) | XML | 1 | 0 | 0 | 1 |
| [src/api/visible.ts](/src/api/visible.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/components/Article/admin.vue](/src/components/Article/admin.vue) | vue | 16 | 0 | 2 | 18 |
| [src/components/Article/article.vue](/src/components/Article/article.vue) | vue | 43 | -13 | 2 | 32 |
| [src/components/Article/articleList.vue](/src/components/Article/articleList.vue) | vue | -118 | -117 | -10 | -245 |
| [src/components/Article/articleModify.vue](/src/components/Article/articleModify.vue) | vue | 43 | 0 | 3 | 46 |
| [src/components/Editor/editor.vue](/src/components/Editor/editor.vue) | vue | 27 | 0 | 3 | 30 |
| [src/components/Header/header.vue](/src/components/Header/header.vue) | vue | 1 | -42 | -1 | -42 |
| [src/components/Homepage/articles.vue](/src/components/Homepage/articles.vue) | vue | 15 | 0 | 0 | 15 |
| [src/components/Homepage/topAll.vue](/src/components/Homepage/topAll.vue) | vue | 303 | 3 | 7 | 313 |
| [src/components/Post/post.vue](/src/components/Post/post.vue) | vue | 100 | 4 | -1 | 103 |
| [src/components/Post/postList.vue](/src/components/Post/postList.vue) | vue | -109 | -111 | -8 | -228 |
| [src/components/Post/postModify.vue](/src/components/Post/postModify.vue) | vue | 123 | 0 | 1 | 124 |
| [src/components/Post/threads.vue](/src/components/Post/threads.vue) | vue | 211 | 3 | 10 | 224 |
| [src/components/Search/search.vue](/src/components/Search/search.vue) | vue | 50 | 0 | 7 | 57 |
| [src/components/Thread/thread.vue](/src/components/Thread/thread.vue) | vue | 13 | 0 | 2 | 15 |
| [src/components/Thread/threadList.vue](/src/components/Thread/threadList.vue) | vue | -279 | -5 | -8 | -292 |
| [src/components/User/Board/board.vue](/src/components/User/Board/board.vue) | vue | 20 | 0 | 1 | 21 |
| [src/components/User/Board/myMessage.vue](/src/components/User/Board/myMessage.vue) | vue | -56 | 0 | -4 | -60 |
| [src/components/User/Fav/articles.vue](/src/components/User/Fav/articles.vue) | vue | 31 | 0 | 3 | 34 |
| [src/components/User/Fav/fav.vue](/src/components/User/Fav/fav.vue) | vue | 10 | 0 | 2 | 12 |
| [src/components/User/Fav/post.vue](/src/components/User/Fav/post.vue) | vue | 32 | 0 | 2 | 34 |
| [src/components/User/Fav/threads.vue](/src/components/User/Fav/threads.vue) | vue | 30 | 0 | 1 | 31 |
| [src/components/User/Friend/circle.vue](/src/components/User/Friend/circle.vue) | vue | 21 | 0 | 3 | 24 |
| [src/components/User/Friend/friend.vue](/src/components/User/Friend/friend.vue) | vue | 18 | 0 | 0 | 18 |
| [src/components/User/Friend/myApply.vue](/src/components/User/Friend/myApply.vue) | vue | -1 | 0 | 0 | -1 |
| [src/components/User/History/history.vue](/src/components/User/History/history.vue) | vue | 222 | 0 | 9 | 231 |
| [src/components/User/login.vue](/src/components/User/login.vue) | vue | 3 | 0 | 0 | 3 |
| [src/components/User/modifyInfo.vue](/src/components/User/modifyInfo.vue) | vue | 69 | 0 | 2 | 71 |
| [src/components/User/overview.vue](/src/components/User/overview.vue) | vue | -1 | 0 | 1 | 0 |
| [src/components/User/personalInfo.vue](/src/components/User/personalInfo.vue) | vue | 10 | 0 | 1 | 11 |
| [src/components/User/userMsgBoard.vue](/src/components/User/userMsgBoard.vue) | vue | 4 | 0 | 0 | 4 |
| [src/components/User/userPage.vue](/src/components/User/userPage.vue) | vue | -4 | 0 | -2 | -6 |
| [src/components/alertCard.vue](/src/components/alertCard.vue) | vue | 7 | 0 | 0 | 7 |
| [src/components/articleCard.vue](/src/components/articleCard.vue) | vue | 11 | 0 | 0 | 11 |
| [src/components/historCard.vue](/src/components/historCard.vue) | vue | 0 | 0 | 1 | 1 |
| [src/components/likefavList.vue](/src/components/likefavList.vue) | vue | 48 | 0 | 4 | 52 |
| [src/components/messageCard.vue](/src/components/messageCard.vue) | vue | 2 | 0 | 0 | 2 |
| [src/components/pagination.vue](/src/components/pagination.vue) | vue | 28 | 0 | 3 | 31 |
| [src/components/postCard.vue](/src/components/postCard.vue) | vue | 70 | 0 | 7 | 77 |
| [src/components/threadCard.vue](/src/components/threadCard.vue) | vue | 41 | 5 | 4 | 50 |
| [src/components/userCard.vue](/src/components/userCard.vue) | vue | 1 | 0 | 0 | 1 |
| [src/index.css](/src/index.css) | PostCSS | 18 | 0 | 1 | 19 |
| [src/main.ts](/src/main.ts) | TypeScript | -6 | 12 | 1 | 7 |
| [src/router/router.ts](/src/router/router.ts) | TypeScript | 7 | 25 | 1 | 33 |
| [src/stores/store.ts](/src/stores/store.ts) | TypeScript | 11 | 0 | 1 | 12 |
| [src/views/articlePage.vue](/src/views/articlePage.vue) | vue | -2 | 0 | -1 | -3 |
| [src/views/homepage.vue](/src/views/homepage.vue) | vue | 75 | -64 | 0 | 11 |
| [src/views/personalPage.vue](/src/views/personalPage.vue) | vue | 211 | 0 | 1 | 212 |
| [src/views/postPage.vue](/src/views/postPage.vue) | vue | -2 | 0 | -1 | -3 |
| [src/views/threadPage.vue](/src/views/threadPage.vue) | vue | -2 | 0 | -1 | -3 |
| [tailwind.config.cjs](/tailwind.config.cjs) | JavaScript | 41 | 1 | 0 | 42 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 18 | 0 | 1 | 19 |
| [tsconfig.node.json](/tsconfig.node.json) | JSON | 9 | 0 | 1 | 10 |
| [vite.config.ts](/vite.config.ts) | TypeScript | 17 | 1 | 2 | 20 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details