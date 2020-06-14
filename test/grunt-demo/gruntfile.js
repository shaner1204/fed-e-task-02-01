module.exports = function (grunt) {
    // 任务配置，所有插件的配置信息
    grunt.initConfig({
        // 获取 package.json 的信息
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: { // 可选项配置
                separator: ';' // 使用；连接合并
            },
            build: {
                src: ["src/js/*.js"], // 合并哪些js 文件
                dest: "build/js/built.js" // 输出的js文件
            }
        },
        uglify: {
            option: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                files: {
                    'build/js/built-<%=pkg.name%>-<%pkg.version%>.min.js': ['build/js/BiquadFilterNode.js']
                }
            }
        },
        cssmin: {
            options: {
                shorthadCompacting: false,
                roundingPrecison: -1
            },
            build: {
                files: {
                    'build/css/output.min.css': ['src/css/*.css']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/js/*.js', 'src/css/*.css'],
                tasks: ['concat', 'uglify', 'cssmin'],
                options: {spawn: false}
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch'])
}