const { src, dest, parallel, series, watch } = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const browserServer = require('browser-sync').create();

const cwd = process.cwd();
let config = {
  build: {
    src: 'src',
    dist: 'dist',
    public: 'public',
    paths: {
      styles: 'src/**/*.less',
      scripts: 'src/**/*.js',
      pages: 'src/**/*.html',
      images: 'src/assets/images/**',
      fonts: 'src/assets/fonts/**'
    }
  }
};
try {
  const loadConfig = require(`${cwd}/workflow.config.js`);
  config = Object.assign({}, config, loadConfig);
} catch (e) { }
const data = config.data;

const clean = () => del([config.build.dist]);

const style = () =>
  src(config.build.paths.styles)
    .pipe(plugins.less())
    .pipe(dest(config.build.dist));

const script = () =>
  src(config.build.paths.scripts)
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest(config.build.dist));

const page = () =>
  src(config.build.paths.pages)
    .pipe(plugins.swig({ data, cache: false }))
    .pipe(dest(config.build.dist));

const image = () =>
  // 读取文件，并确定基准目录为 src
  src(config.build.paths.images, { base: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist));

const font = () =>
  // 读取文件，并确定基准目录为 src
  src(config.build.paths.fonts, { base: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist));

const extra = () =>
  // 读取文件，并确定基准目录为 public
  src('**', { base: config.build.public, cwd: config.build.public })
    .pipe(dest(config.build.dist));

const serve = () => {
  // 需要监视的文件列表及其对应的任务
  const list = [
    {
      files: config.build.paths.styles,
      task: style
    },
    {
      files: config.build.paths.scripts,
      task: script
    },
    {
      files: config.build.paths.pages,
      task: page
    },
    {
      files: [config.build.paths.images, config.build.paths.fonts, `${config.build.public}/**`],
      task: browserServer.reload
    },
  ];
  list.forEach(item => {
    watch(item.files, item.task);
  });
  browserServer.init({
    // 关闭 browser-sync 开启提示
    notify: false,
    // 默认端口 3000
    port: 9527,
    // 监听文件变化
    files: `${config.build.dist}/**`,
    server: {
      baseDir: [config.build.dist, config.build.src, config.build.public]
    }
  });
};

const useref = () =>
  src(`${config.build.dist}/**/*.html`, { base: config.build.dist })
    .pipe(plugins.useref({
      searchPath: [config.build.dist, '.']
    }))
    // html js css 文件压缩处理
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCss: true,
      minifyJs: true,
      removeComments: true
    })))
    .pipe(dest(config.build.dist));

// 上线与开发都需要的编译任务
const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(clean, parallel(compile, image, font, extra), useref);

// 开发阶段执行的任务
const dev = series(compile, serve);

// 导出的命令
module.exports = {
  clean, // 清除dist
  build, // 上线前的编译
  dev    // 开发编译
};