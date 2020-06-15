#!/user/bin/env node
console.log('sdfsdfsfsdf')

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Project name?0'
    }
])
.then(anwsers => {
    console.log(anwsers)
    // 模板目录
    const tempDir = path.join(__dirname, 'templates')
    // 目标目录
    const destDir = process.cwd()

    // 将模板下的文件全部转换到目标目录
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            // file 为文件的相对路径 
            // 通过模板引擎渲染文件
            ejs.renderFile(path.join(tempDir, file), anwsers, (err, result) => {
                if (err) throw err
                console.log(result)
                // 将结果写入目标文件路径 
                fs.writeFileSync(path.join(destDir, file), result)
            })
        })
    })
})