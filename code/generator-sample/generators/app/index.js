// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义 的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    // 在generator 中发起一个命令行交互的询问 prompting()
    prompting () {
        // Yoeman 在询问用户环节会自动调用此方法
        // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
        // 这个方法返回一个 promise
        return this.prompt([
            // 接收数组参数,数组的每一项都是一个问题对象
            {
                type: 'input', // 用户输入的方式接收用户提交信息
                name: 'name',  // 最终得到结果的键
                message: 'Your project name', // 界面中给用户的提示,也就是问题
                default: this.appname // appname 为项目生成目录名称
            }
        ])
        .then(answers => {
            // 当前接收完用户问题之后,得到的结果,以对象的形式出现,
            // 对象中的键名:为 prompt 方法中的 name,值:就是用户输入 的 value
            // answers => { name: 'user input value' }
            // 把它挂载在 this 对象上,以便在 writing 时使用
            this.answers = answers
        })
    }
    writing () {
        // Yeoman 自动在生成文件阶段调用此方法
        // 我们这里尝试住项目中写入文件
        // this.fs.write(
        //     // write 接收两个参数:一个是项目的绝对路径,一个文件的内容
        //     this.destinationPath('temp.txt'),
        //     Math.random().toString()
        // )

        // ------------------------------------------------------------------

        // 通过模板方法写文件到目标目录
        // 有三个参数:模板文件的路径,输出文件的路径,模板数据的上下文
        // 模板文件路径
        // const tmpl = this.templatePath('foo.txt')  //获取当前生成器 templates 下的文件路径
        // // 输出目标路径
        // const output = this.destinationPath('foo.txt')
        // // 模板数据上下文
        // const context = { title: 'Hello ss~', success: false}
        // // 这个方法会自动的把模板文件映射到,生成的输出文件上
        // this.fs.copyTpl(tmpl, output, context)

        // ---------------------------------------------------------------

         // 模板文件路径
         const tmpl = this.templatePath('bar.html')  //获取当前生成器 templates 下的文件路径
         // 输出目标路径
         const output = this.destinationPath('bar.html')
         // 模板数据上下文
         const context = this.answers
         // 这个方法会自动的把模板文件映射到,生成的输出文件上
         this.fs.copyTpl(tmpl, output, context)
    }
}