module.exports = function (grunt) {
    // 任务配置，所有插件的配置信息
    grunt.initConfig({
        // 获取 package.json 的信息
        pkg: grunt.file.readJSON('package.json'),
        // 键为任务名字
         //压缩html
         htmlmin: {
            dynamic: {
                options: {
                    removeComments: true, //移除注释
                    collapseWhitespace: false//无用空格，false为不删除
                },
                files: [{
                    src: ['src/**/*.html'],
                    dest: 'bulid/main.html'
                }]
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-htmlmin')
    grunt.registerTask('default',['htmlmin'])
}