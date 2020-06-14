const fs = require('fs') // 读取文件流
const { Transfomr } = require('stream') // 文件转换流

// series 执行串行任务；parallel 执行并行任务
const { series, parallel } = require('gulp')
exports.default = done => {
    console.log('lkjlkjlkjlkj')
    // 创建文件的读取流
    const read = fs.createReadStream('src/*.html')
    // 文件写入流
    const write = fs.createWriteStream('')
    // 文件转换流
    const transform = new Transfomr({
        // transform 属性是转换流的转换过程 
        transform: (chunk, encoding, callback) => {
            // 核心转换过程实现
            // chunk => 读取流中读取到的内容 (Buffer), 通过 toString() 方式转换为字符串，因为它是一个字节数组
            const input = chunk.toString()
            const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '')
            // callback 为错误优先函数，第一个参数为错误对象，如果没有错误，就传入 null
            callback(null, output)
            // output 作为结果导出
        }
    })
    // 把读取出来的文件流导入写入文件流中.通过 pipe 方法
    read
      .pipe(transform) // 转换
      .pipe(write) // 写入

    // gulp 可以根据文件流的状态去判断是否执行完成 
    return read
    // done() //标识任务结束 
}