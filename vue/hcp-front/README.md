# hcp-front

> hcp project

## develop

``` javascript  
# 依赖包安装
npm config set registry http://npm.intra.xiaojukeji.com
npm install

# 若使用yarn作为包管理工具
yarn set registry http://npm.intra.xiaojukeji.com
yarn install

```

### script说明
scirpt                           | loginSDK | server api | eruda调试工具 | souceMap & log | assetsPublicPath
-------------------------------- | -------- | ---------- | --------- | -------------- | ------------------------------
npm run start（本地调试测试接口使用）        | 线下       | 线下         | ✓         | ✓              | /webapp/
npm run start:online（本地调试线上接口使用） | 线上       | 线上         | ✓         | ✓              | /webapp/
npm run build:test（测试环境打包使用）     | 线下       |            | ✓         | ✓              | /webapp/
npm run build:online（线上环境打包使用）   | 线上       |            | ✗         | ✗              | //train-static.didiglobal.com/

``` javascript
# 部署至测试环境
npm run beta
# build for production and view the bundle analyzer report
npm run build --report
```



-----

## webapp依赖文档

#### 前端测试环境连接指南
http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=157105015

#### 公司内部依赖文档
http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=160139190

#### 埋点相关文档
https://git.xiaojukeji.com/qt-fe/tracker/omega-sdk/blob/master/README.md#tracker-for-sdk-v1xx


#### 组件库文档
https://didi.github.io/cube-ui/#/zh-CN/docs/quick-start


#### 通用封装，包含定位，分享，支付，设置标题等  （暂未使用）
https://git.xiaojukeji.com/common-fe/sdk


#### 网络库，基于axois封装，支持公司层面的请求签名
https://git.xiaojukeji.com/webapp/dajax
