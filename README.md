# nuxt-movie-app

영화 검색 사이트의 SSR 지원을 위해 [Vue2-movie-app](https://github.com/ParkYoungWoong/vue2-movie-app) 프로젝트를 [Nuxt](https://nuxtjs.org/docs/2.x/get-started/installation) 프로젝트로 이관(Migration)합니다.

[DEMO](https://heropy-nuxt-movie-app.herokuapp.com/)

## Router

Nuxt는 내부적으로 [Vue Router for Vue2](https://router.vuejs.org/kr/) 플러그인을 사용하지만,<br>
`<RouterView />`와 `<RouterLink />` 대신,<br>
`<Nuxt />`, `<NuxtLink />` 컴포넌트를 사용합니다.

## Layouts

### default.vue

Nuxt는 `App.vue` 파일을 사용하지 않습니다.<br>
대신 모든 페이지에서 사용할 수 있는 레이아웃 컴포넌트(`layouts/default.vue`)를 제공할 수 있습니다.<br>
기존 프로젝트의 `src/App.vue` 내용을 `layouts/default.vue`로 이관하세요!<br>
그리고 `<RouterView />` 컴포넌트를 `<Nuxt />`로 수정하세요!

### error.vue

Nuxt는 페이지를 찾을 수 없는 경우 사용할 레이아웃 컴포넌트(`layouts/error.vue`)를 제공합니다.<br>
기존 프로젝트의 `src/routes/NotFound.vue` 내용을 `layouts/error.vue`로 이관하세요!

## Pages

Nuxt는 내부적으로 [Vue Router for Vue2](https://router.vuejs.org/kr/) 플러그인을 사용하지만,<br>
기존 프로젝트의 `src/routes/index.js`를 제공하지 않아도,<br>
`pages`폴더의 하위 폴더와 파일 구조를 통해 자동으로 Route 구조를 생성합니다.<br>
따라서 기존 프로젝트의 `src/routes` 폴더 구조를 다음과 같이 수정하세요!<br>

[pages/ 보기](https://github.com/ParkYoungWoong/nuxt-movie-app/tree/master/pages)

- __'/'__: `Home.vue` => `index.vue`
- __'/movie/:id'__: `Movie.vue` => `movie/_id.vue`
- __'/about'__: `About.vue` => `about.vue`

```plaintext
pages/
├─ movie/
│  └─ _id.vue
├─ about.vue
└─ index.vue
```

## Plugins

Nuxt는 `src/main.js`를 사용하지 않기 때문에,<br>
다음과 같이 `plugins/index.js` 파일을 생성하고,

```js
import Vue from 'vue'
import loadImage from './loadImage'

Vue.use(loadImage)
```

`nuxt.config.js`의 `plugins` 옵션에 다음과 같이 등록합니다.

```js
export default {
  plugins: [
    // '~/plugins/index.js' // index.js 생략!
    '~/plugins'
  ]
}
```

`plugins/loadImage.js`는 SSR에서 Document API 에러가 발생하므로,<br>
다음과 같이 SSR 상태를 확인하면 플러그인 내용을 바로 종료합니다.

[plugins/loadImage.js 보기](https://github.com/ParkYoungWoong/nuxt-movie-app/blob/master/plugins/loadImage.js)

```js
if (process.server) {
  resolve()
  return
}
```

## Store

`store` 폴더에 `index.js` 파일이 존재하면 Nuxt가 자동으로 Store를 활성화합니다.<br>
그 외 모든 파일은 자동으로 Store Modules로 등록되기 때문에,<br>
`index.js`에 `modules` 옵션으로 `movie`나 `about`을 모듈로 등록하면 충돌이 발생할 수 있습니다.<br> 
따라서 충돌 방지를 위해 `store/index.js` 파일 내용을 비워주세요!

[store/ 보기](https://github.com/ParkYoungWoong/nuxt-movie-app/tree/master/store)

## Build

### Babel

Nuxt는 Babel을 별도 구성 파일(`.babelrc.js`)이 아닌 `nuxt.config.js`의 `build` 옵션에 다음과 같이 등록해야 합니다.<br>
단, [Jest](https://jestjs.io/docs/getting-started) 를 통한 단위(Unit) Test를 위해 `.babelrc.js` 파일은 삭제하지 마세요!

```js
export default {
  build: {
    babel: {
      presets: ['@babel/preset-env'],
      plugins: [
        ['@babel/plugin-transform-runtime']
      ]
    }
  }
}
```

### PostCSS

Nuxt는 PostCSS를 별도 구성 파일(`.postcssrc.js`)이 아닌 `nuxt.config.js`의 `build` 옵션에 다음과 같이 등록해야 합니다.

```js
export default {
  build: {
    postcss: {
      plugins: [
        'autoprefixer'
      ]
    }
  }
}
```

`package.json`에서 `browserslist` 옵션 지정을 잊지 마세요!

```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ]
}
```

## Modules

### Dotenv

`dotenv-webpack` 패키지를 제거하고, `@nuxtjs/dotenv` 패키지를 새로 설치하세요!<br>
`nuxt.config.js`의 `modules` 옵션에 다음과 같이 등록합니다.

```js
export default {
  modules: [
    '@nuxtjs/dotenv'
  ]
}
```

`.env` 파일을 사용해 환경 변수(Environment Variable)를 등록해 사용할 수 있습니다.

```plaintext
HOST=localhost
NODE_ENV=development
NPM_CONFIG_PRODUCTION=false
CLIENT_URL=http://localhost:3000
OMDB_API_KEY=xxxxxxxx
```

### Style Resources

`sass-loader`를 통해 Vue 컴포넌트의 스타일에 지정했던 기존 프로젝트의 `webpack.config.js`의 다음 코드를 대신해,

```js
{
  loader: 'sass-loader',
  options: {
    additionalData: '@import "~/scss/main";'
  }
}
```

`@nuxtjs/style-resources` 패키지를 설치해 사용합니다!<br>
`nuxt.config.js`의 `modules` 옵션에 다음과 같이 등록합니다.

```js
export default {
  modules: [
    '@nuxtjs/style-resources'
  ],

  // @nuxtjs/style-resources
  styleResources: {
    scss: [
      '~/scss/main.scss'
    ]
  }
}
```

## index.html

Nuxt는 별도의 `index.html`를 제공하지 않기 때문에,<br>
`<head></head>`의 내용을 `nuxt.config.js`의 `head` 옵션에 다음과 같이 등록해야 합니다.

```js
export default {
  head: {
    title: 'Nuxt Movie App',
    htmlAttrs: {
      lang: 'ko'
    },
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Roboto:wght@400;700&display=swap' }
    ]
  }
}
```

단, 다음 스타일은 별도의 파일로 분리해 등록하세요!

```html
<style>
  body {
    line-height: 1.4;
    font-family: 'Roboto', sans-serif;
  }
</style>
```

`assets/css/main.css` 파일을 생성해 위 코드를 이관한 후,<br>
`nuxt.config.js`의 `css` 옵션에 다음과 같이 등록합니다.

```js
export default {
  css: [
    '~/assets/css/main.css'
  ]
}
```

## Server API

Nuxt 프로젝트를 별도의 서버(Heroku)에서 동작시킬 것이기 때문에,<br>
이제 Netlify Serverless Functions를 사용하지 않고,<br>
Nuxt 프로젝트에서 직접 백엔드 API를 작성합니다.<br>

백엔드 API를 작성하기 위해 다음 패키지를 설치합니다.

```bash
$ npm i -D body-parser express
```

`server-moddleware/movie.js` 파일을 생성하고 다음과 같이 작성합니다.<br>
약간의 차이가 있지만, 기존 프로젝트의 Netlify Serverless Functions와 비슷합니다.

```js
const bodyParser = require('body-parser')
const app = require('express')()
const axios = require('axios')
const { OMDB_API_KEY } = process.env

app.use(bodyParser.json())
app.post('/', async (req, res) => {
  const payload = req.body
  const { title, type, year, page, id } = payload
  const url = id
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`

  try {
    const { data } = await axios.get(url)
    if (data.Error) {
      res.status(400)
        .json(data.Error)
    }
    res.status(200)
      .json(data)
  } catch (error) {
    res.status(error.response.status)
      .json(error.message)
  }
})

module.exports = app
```

작성한 파일을 `nuxt.config.js`의 `serverMiddleware` 옵션에 다음과 같이 등록합니다.
이제 `/api/movie`로 POST 요청을 전송할 수 있습니다.

```js
export default {
  serverMiddleware: [
    { path: '/api/movie', handler: '~/server-middleware/movie.js' }
  ]
}
```

주의할 점은, Nuxt는 CSR과 SSR을 같이 동작시키기 때문에,<br>
CSR과 SSR 상태의 요청 주소를 다르게 설정합니다.<br>
`store/movie.js`의  `_fetchMovie` 함수를 다음과 같이 수정하세요.

```js
async function _fetchMovie(payload) {
  const url = process.client ? '/api/movie' : `${process.env.CLIENT_URL}/api/movie`
  return await axios.post(url, payload)
}
```

## Open Graph

### /

사이트의 기본 Meta 정보를 [Open Graph 프로토콜](https://ogp.me/) 방식으로 `nuxt.config.js`에 다음과 같이 등록합니다.

```js
export default {
  head: {
    meta: [
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Nuxt Movie App' },
      { hid: 'og:title', property: 'og:title', content: 'Nuxt Movie App / Search' },
      { hid: 'og:description', property: 'og:description', content: 'The OMDb API is a RESTful web service to obtain movie information, all content and images on the site are contributed and maintained by our users.' },
      { hid: 'og:image', property: 'og:image', content: 'https://heropy.blog/css/images/logo.png' },
      { hid: 'og:url', property: 'og:url', content: process.env.CLIENT_URL }
    ]
  }
}
```

위 코드는 HTML의 다음과 같습니다.

```html
<head>
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Nuxt Movie App" />
  <meta property="og:title" content="Nuxt Movie App / Search" />
  <meta property="og:description" content="The OMDb API is a RESTful web service to obtain movie information, all content and images on the site are contributed and maintained by our users." />
  <meta property="og:image" content="https://heropy.blog/css/images/logo.png" />
  <meta property="og:url" content="https://heropy-nuxt-movie-app.herokuapp.com/movie/tt4520988" />
</head>
```

### /movie/:id

영화 상세 페이지('/movie/:id') 같이 페이지의 Meta 정보가 동적으로 등록되어야 하는 경우,<br>
SSR 상태에서 동작하는 `asyncData` 옵션을 사용해 정보를 미리 처리하고 Meta 정보를 등록할 수 있습니다.<br>
다음과 같이 `pages/movie/_id.vue`의 `asyncData` 옵션에서 데이터를 처리하고,<br>
그 데이터로 `head` 옵션에서 Meta 정보를 등록합니다!

```js
export default {
  async asyncData({ store, params }) {
    await store.dispatch('movie/searchMovieWithId', {
      id: params.id
    })
    return {
      imageLoading: true
    }
  },
  
  // ...
  
  head() {
    return {
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:site_name', property: 'og:site_name', content: 'Nuxt Movie App' },
        { hid: 'og:title', property: 'og:title', content: this.theMovie.Title },
        { hid: 'og:description', property: 'og:description', content: this.theMovie.Plot },
        { hid: 'og:image', property: 'og:image', content: this.theMovie.Poster },
        { hid: 'og:url', property: 'og:url', content: `${process.env.CLIENT_URL}${this.$route.fullPath}` }
      ]
    }
  }
}
```

### /about

따로 처리할 데이터가 없으므로, Store(About)에서 가져온 데이터로 바로 Meta 정보를 등록합니다.
다음과 같이 `pages/about.vue`에서 `head` 옵션으로 Meta 정보를 등록합니다!

```js
export default {
  // ...
  
  head() {
    return {
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:site_name', property: 'og:site_name', content: 'Nuxt Movie App' },
        { hid: 'og:title', property: 'og:title', content: this.name },
        { hid: 'og:description', property: 'og:description', content: this.email },
        { hid: 'og:image', property: 'og:image', content: this.image },
        { hid: 'og:url', property: 'og:url', content: `${process.env.CLIENT_URL}${this.$route.fullPath}` }
      ]
    }
  }
}
```

## Heroku

[Heroku](https://www.heroku.com) 는 서비스형 플랫폼(PaaS, Platform as a Service)으로 클라우드 컴퓨팅 서비스를 제공합니다.<br>
GitHub 연동으로 간편하게 웹 서버를 생성할 수 있습니다.<br>
무료로 사용이 가능하고 단, 30분 동안 요청이 없으면 Sleep 모드로 전환됩니다.
