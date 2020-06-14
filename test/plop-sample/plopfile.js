// Plop 入口文件,需要导出一个函数
// 此函数接收一个 plop 对象,用于创建生成器任务

module.exports = plop => {
    // setGenerator两个参数:生成器名称,生成器的描述
    plop.setGenerator('component', {
        description: 'create a component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'component name',
                default: 'MyComponent'
            }
        ],
        // 完成命令行之后,执行的运作
        actions: [
            {
                type: 'add', //代表添加文件
                path: 'src/components/{{name}}/{{name}}.js', // 添加文件的具体位置
                templateFile: 'plop-templates/component.hbs' // 模板 文件
            }
        ]
    })
}