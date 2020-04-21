# Axios

Axios 是一个基于 promise 的 HTTP 库

浏览器支持情况：Chrome、Firefox、Safari、Opera、Edge、IE8+

## 引入

```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

## API

- axios(config)
- axios(url, [config])

## config 配置对象

最常用的配置：

```js
axios({
  method: "get", // post、get、put....
  baseURL: "", // 请求的域名，基本地址
  url: "", // 请求的路径
  params: {}, // 会将请求参数拼接在url上
  data: {}, // 会将请求参数放在请求体中
  headers: {}, // 设置请求头，例如设置token等
  timeout: 1000, // 设置请求超时时长，单位：ms
});
```

## 方法别名

为方便起见，为所有支持的请求方法提供了别名。

- axios.request(config)
- axios.get(url, [config])
- axios.post(url, [data], [config]])
- axios.delete(url, [config])
- axios.head(url, [config])
- axios.put(url, [data], [config])
- axios.patch(url, [data], [config]])
- axios.options(url, [config])

## 配置默认值

可以指定将被用在各个请求的配置默认值

### 全局配置

```js
axios.defaults.baseURL = "https://developer.duyiedu.com/vue";
axios.defaults.timeout = 1000;
```

在实际项目中，很少用全局配置。

### 实例配置

> 可以使用自定义配置新建一个 axios 实例

```js
const instance = axios.create({
  baseURL: "https://developer.duyiedu.com/vue",
  timeout: 1000,
});

instance.get("/getUserInfo").then((res) => {
  // ...
});
```

### 请求配置

```js
const instance = axios.create();
instance.get("/getUserInfo", {
  timeout: 5000,
});
```

### 配置的优先顺序

全局 < 实例 < 请求

## 并发

同时进行多个请求，并统一处理返回值

- axios.all(iterable)
- axios.spread(callback)

```js
axios.all([
    axios.post("/setUserInfo", {
      name: "xlj",
      mail: "haah@qq.com",
    }),
    axios.get("/getUserInfo"),
  ])
  .then(
    axios.spread((postRes, getRes) => {
      console.log(postRes, getRes);
    })
  );
```

## 拦截器

interceptors，在发起请求之前做一些处理，或者在响应回来之后做一些处理。

### 请求拦截器

```js
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  return config;
});
```

### 响应拦截器

```js
axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  return response;
});
```

### 移除拦截器

```js
const myInterceptor = axios.interceptors.request.use((config) => {});
axios.interceptors.request.eject(myInterceptor);
```

### 为 axios 实例添加拦截器

```js
const instance = axios.create();
instance.interceptors.request.use((config) => {});
```

## 取消请求

用于取消正在进行的 http 请求

```js
const source = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("/getUserInfo", {
    cancelToken: source.token,
  })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      // 取消请求
      console.log(error.message);
    } else {
      // 处理错误
    }
  });

// 取消请求 参数 可选
source.cancel("取消请求");
```

## 错误处理

在请求错误时进行的处理
request / response 是 error 的上下文，标志着请求发送 / 得到响应
在错误中，如果响应有值，则说明是响应时出现了错误。
如果响应没值，则说明是请求时出现了错误。
在错误中，如果请求无值，则说明是请求未发送出去，如取消请求。

```js
axios.get("/user/12345").catch(function (error) {
  // 错误可能是请求错误，也可能是响应错误
  if (error.response) {
    // 响应错误
  } else if (error.request) {
    // 请求错误
  } else {
    console.log("Error", error.message);
  }
  console.log(error.config);
});
```

在实际开发过程中，一般在拦截器中统一添加错误处理
请求拦截器中的错误，会当请求未成功发出时执行，但是要注意的是：取消请求后，请求拦截器的错误函数也不会执行，因为取消请求不会抛出异常，axios 对其进行了单独的处理。
在更多的情况下，我们会在响应拦截器中处理错误。

```js
const instance = axios.create({});
instance.interceptors.request(
  (config) => {},
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response(
  (response) => {},
  (error) => {
    return Promise.reject(error);
  }
);
```

## axios 预检

当 axios 的请求为非简单请求时，浏览器会进行预检，及发送 OPTIONS 请求。请求到服务器，询问是否允许跨域。如果响应中允许预检中请求的跨域行为，则浏览器会进行真正的请求。否则会报 405 错误。
