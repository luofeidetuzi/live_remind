const path = require('path');
const HtmlWebPackPlugin=require('html-webpack-plugin')//导入  在内存中自动生成index页面的插件
//创建一个插件的实例对象
const htmlPlugin=new HtmlWebPackPlugin({
    template:path.join(__dirname,'./src/index.html'),//源文件
     //将来会根据此页面生成内存中的页面
    filename:'index.html'//生成的内存中的首页的名称,index.html浏览器才会默认直接打开
})
module.exports = {
    entry:{
        background:'./src/background.js',
        options:'./src/options.js'
    },//入口文件
    output:{
        filename:'[name].bundle.js',//打包后的文件名
        path:path.resolve(__dirname,'dist'),//路径必须是一个绝对路径
    },
    mode:'production',
    devServer:{
        contentBase:'./dist'
    },
    plugins:[
        htmlPlugin
    ],
    module:{//所有第三方的模块配置规则，。。s的是数组，没有s是对象
        rules:[//第三方匹配规则
            {
                // 加载CSS
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                // 加载图片
                test: /\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
            },
            {//以js或jsx结尾   用的loader，如果有多个，要用数组    排除项（一定要加)
                test:/\.js$/,
                use:{
                    loader: 'babel-loader'
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                },
                exclude:/node_modules/
            },
            {
                test: /\.art$/,
                loader: "art-template-loader"
            }
        ]
    },
}