# g-workflow

## Useage

```bash
$ npm i g-workflow -D

$ touch workflow.config.js

$ gulp-workflow clean

$ gulp-workflow dev

$ gulp-workflow build
```

### workflow.config.js

```js
module.exports = {
  build: {
    src: 'src',
    dist: 'release',
    public: 'public',
    paths: {
      styles: 'src/**/*.less',
      scripts: 'src/**/*.js',
      pages: 'src/**/*.html',
      images: 'src/assets/images/**',
      fonts: 'src/assets/fonts/**'
    }
  },
  data: {
    content: {
      box: 'test'
    }
  }
};
```

**data**: 项目 `html` 文件中模板数据，使用小胡子语法

```html
<!-- 如下使用 -->
...
<div class="box">{{content.box}}</div>
...
```

**build**: 项目构建对应目录

属性|意义
--|--
src|源码目录
dist|编译后文件夹目录，用于生产环境
public|静态资源目录
paths|编译文件目录对象
<br/>

**paths**

属性|意义
--|--
styles|样式文件对应目录（本版本只编译 less）
scripts|JS文件对应目录
pages|html文件对应目录
images|图片文件对应目录
fonts|字体文件对应目录
