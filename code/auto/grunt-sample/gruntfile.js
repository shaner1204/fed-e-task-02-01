// Grunt 的入口文件
// 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数 
// 此函数接收一个 grunt 的形参，内部提供一些api,可以根据这些api快速创建任务时可以用到的api(构建任务)

module.exports = grunt => {
    // registerTask 有两个参数，一个任务名称，一个是任务函数——也就是任务发现时自动执行的函数
    grunt.registerTask('foo', () => {
        console.log('hello grunt')
    }) 
}