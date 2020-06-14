const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    prompting () {
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname
            }
        ])
        .then(answers => {
            this.answers = answers2
        })
    }

    writing () {
        // 把每一个文件都 通过模板转换到目标路径 
    }
}