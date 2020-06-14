// 实现这个项目的构建任务
// series执行串行任务，parallel执行并行任务
// watch API 会自动监视一个文件路径的通配符，根据这些文件的变化，去决定是否要重新执行对应的任务
const { src, dest, series, parallel, watch } = require('gulp')

const del = require('del')

const browserSync = require('browser-sync')

// 自动加载所有插件
// 也就是替换掉了 gulp-,变成了 plugins.sass
// 如果 gulp- 后面有多个的话,会以驼峰形式展示，如plugins.nodeSass
const loadPlugins = require('gulp-load-plugins')

// 导出的方法是一个对象，所以的插件都会成为这个对象的属性
const plugins = loadPlugins()

// create 方法创建一个服务器
const bs = browserSync.create()

// 读取流src、写入流dest、转换流
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')

const data = {
    menus: [
        {
            name: 'Home',
            icon: '',
            link: 'index.html'
        },
        {
            name: 'About',
            icon: '',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
                {
                    name: 'Twiter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://baidu.com'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}

const clean = () => {
    // del 方法返回的是一个Promise
    return del(['dist', 'temp'])
}

const style = () => {
    // 通过 src 方法创建一个文件读取流,然后通过 .pipe 方法把 dest 生成的文件导出到 dist 目录
    // base 转换时的基础路径,base:'src',会将 src 后面的路径保存下来
    return src('src/assets/styles/*.scss', { base: 'src'})
    //  每一个插件都会提供一个函数，函数的调用结果会返回一个文件的转换流，可以实现文件的转换任务
    // 安装 sass 模块时,会自动安装 node-sass模块
    // 执行该任务时，dist 文件夹只生成了 main.css 一个文件，是因为 gulp-sass 模块工作时，默认带 _[下划线]的 .scss 文件为main.scss 主文件中依赖的文件，所以不会被转换，会被忽略
    // { outputStyle: 'expanded' } 是对样式文件进行完全展示的设置  
      .pipe(plugins.sass({ outputStyle: 'expanded' }))
      .pipe(dest('temp'))
    //   以流的方式将文件构建到浏览器中，那么bs.init 方法中的 files就不需要配置了
      .pipe(bs.reload({ stream: true }))
}

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
    // babel 插件只是帮助唤醒 @babel/core 模块中的转换过程，该模块需要手动安装
    // @babel/preset-env 会将 es6 的新特性全部进行转换
    // 导出的文件没有什么改动是因为 babel 只是 ECMAScript 的一个转换平台，只是提供一个环境，具体的转换是其内部提供的插件
    // presets 就是一些插件的集合，它是所有特性的整体打包
      .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
      .pipe(dest('temp'))
      //   以流的方式将文件构建到浏览器中
      .pipe(bs.reload({ stream: true }))
}

// 模板文件就是html文件，为了让页面中重复的地方抽象出来，使用了模板引擎
const html = () => {
    // src/**/* 代表 src 目录下的任意子目录下的 html 文件 ——子目录的通配方式
    // 模板中的数据通过选项进行指定，******编译之后，这里的数据 并没有被替换********
    return src('src/*.html', { base: 'src' })
      .pipe(dest(plugins.swig({ data })))
      .pipe(dest('temp'))
      //   以流的方式将文件构建到浏览器中
      .pipe(bs.reload({ stream: true }))
}

// **********图片的依赖包好像少了一些东西，不知道 是不是老师说的二进制相关的东西**************
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
      .pipe(plugins.imagemin())
      .pipe(dest('dist'))
}

// 字体文件中也会用到svg,所以也可以用imagemin
const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
      .pipe(plugins.imagemin())
      .pipe(dest('dist'))
}

const extra = () => {
    return src('public/**', { base: 'public'})
      .pipe(dest('dist'))
}

const serve = () => {
    // 接收两个参数，globs:通配通配符和任务函数
    // 文件修改之后，会执行相应的任务，这些任务触发之后 ，就会把dist中的文件覆盖掉，browser-sync就可以监听到 dist 中的变化，就会响应到浏览器中
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', html)
    // watch('src/assets/images/**', image)
    // watch('src/assets/fonts/**', font)
    // watch('public/**', extra)

    // reload 数组的文件发生变化之后，会自动刷新浏览器，浏览器会重新发起该文件的请求，就可以拿到新的文件
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)

    // 通过 init 方法进行一下初始化的web服务器配置
    bs.init({
        // 网站提示关闭
        notify: false,
        // 端口默认为 3000
        port: 2080,
        // 是否自动打开浏览器
        open: false,
        // 指定一个字符串，字符串是对browser-sync启动之后进行监听的通配符
        // files: 'dist/**',
        server: {
            // 指定网站根目录，也就是服务器需要把哪个目录作为网站的根目录
            // baseDir 支持数组，当请求过来之后 ，会找第一个，第一个没有再依次往后找
            // baseDir: 'dist',
            baseDir: ['temp', 'src', 'public'],
            // 单独加一个特殊的路由
            // routes 会优先于　baseDir，如routes中有配置会先执行其配置内容，再加 baseDir 下面的文件
            routes: {
                // 键就是我们请求的前辍，指定一个目录下面node_modules，它为相对路径，相对于网站的根目录
                '/node_modules': 'node_modules'
            }
        }
    })
}

// useref 会自动处理 html 中的构建注释，构建注释就是将开始与结束注释中间的文件打包到开始注释的写明的一个文件当中
// 如引入多个，都打包到一个文件中
// useref 使用依赖，引用关系
const useref = () => {
    return src('temp/*.html', { base: 'dist'})
    // 创建转换流，对构建参数进行转换
    // searchPath：找到文件
      .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
    // html js css 压缩
    // if 会自动创建一个转换流，它会根据指定的条件，去判断是否要执行转换流
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    // htmlmin 只是压缩属性中的空白字符
    // collapseWhitespace: true 压缩换行符
    // minifyCSS minifyJS 把页面中的style script 标签中的代码进行压缩
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
    })))
    .pipe(dest('dist'))
}

// 开发阶段
const compile = parallel(style, script, html)

// 上线之前执行的任务
const build = series(
    clean, 
    parallel(
        series(compile, useref), 
            image, 
            font, 
            extra
    )
)

const develop = series(compile, serve)
// style 目前是私有任务，
// 导出一个对象 ，对象中的所有成员在外界都可以使用
module.exports = {
    compile,
    build,
    develop,
    useref
}

// exports.default = () => {
//     // 通过 src 方法创建一个文件读取流
//     return src('src/*.html')
//       .pipe(dest('dist'))
//     // 通过.pipe 导出到 dest 的写入流中,dest 写入一个写入路径
//     // 通过 return 的方式将创建的读取文件流 return 出去，从而 gulp 就可以控制这个任务的完成 
//     // src/*.css 表示 src 目录下所有的 .css 文件
// }