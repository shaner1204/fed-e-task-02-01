#!/user/bin/env node

// Node CLI 应用入口文件必须有这样的文件头
// 如果是 Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过  755 cli.js 实现修改

console.log('cli working!')

// 脚手架的工作过程:
// 1、通过命令行交互询问用户问题
// 2、根据用户回答 的结果生成文件

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs') // 模板引擎

// inquirer 模块提供一个 prompt 方法用于发起一个命令行的询问
// 接收一个数组参数，每个成员就是每一个命令行发起的问题
// type:指定问题输入方式 
// name:指定问题返回值的键
// message:指定屏幕上给用户的提示
inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Project name?'
    }
])
.then(anwsers => {
    // then 中可以接收到用户的答案

    // console.log(anwsers)
    // 根据用户回答的结果生成文件

    // 模板根目录，项目根目录下的templates
    const tmplDir = path.join(__dirname, 'templates')
    // 输出目标目录，命令行在哪个目录 去执行，就应该是哪个目录 应当是 cwd 目录 
    const destDir = process.cwd()

    // 通过 fs 模块去读取文件，看模板目录下有哪些文件，将模板下的文件全部转换到目标目录
    // readdir 方法会自动扫描 templates 下所有的文件
    fs.readdir(tmplDir, (err, files) => {
        // 如读写失败，可以把异常 throw 出去
        if (err) throw err
        files.forEach(file => {
            // 通过 files 拿到所有的文件列表，forEach 遍历每一个文件
            // file 就是相对 templates 下的相对路径
            // index.html
            // style.css
            // console.log(file)

            // 通过模板引擎渲染文件路径对应的文件
            // renderFile 方法通过文件路径渲染文件，
            // 第一个参数就是文件的绝对路径，
            // 第二个参数是模板引擎在工作时的数据上下文
            // 第三个是渲染成功之后 的回调函数
            ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
                if (err) throw err
                console.log(result)

                // 将结果写入目标文件路径
                fs.writeFileSync(path.join(destDir, file), result)
            })
        })
    })
})