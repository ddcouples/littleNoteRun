
'use strict';
var path=require('path');
var webpack=require('webpack');
var node_modules=path.resolve(__dirname,'node_modules');
var autoprefixer = require('autoprefixer');
module.exports={
	//context:path.resolve(__dirname,'src'),和entry 配合使用 作为 entry的根目录
	entry:[
	  // 'webpack/hot/only-dev-server',//客户端热刷新  only－指热加载成功更新的部分
	  path.resolve(__dirname,'src/index.js')
	 ],
	
	output:{
		path:path.resolve(__dirname,'./build'),
		filename:'bundle.js',
		publicPath:'/'//HMR必须知道加载热更新块
	},
	
	 devtool:'source-map',
	// devServer:{//webpack-dev-server 配置
	// 	hot:true, 　//能热更新服务器
	// 	contentBase:path.resolve(__dirname,'build'),
    // contentBase，publicPath要匹配 output路径
	// 	publicPath:'/'
	// },
	module:{
		loaders:[
		    {
            	test:/\.js|jsx$/,
            	loader:'babel-loader',
            	exclude:/node_modules/
            },
            {
                test: /\.css$/,
                loaders: [
                'style-loader',
                {
			      loader: 'css-loader',
			       options: {
			        modules: true,
			        // localIdentName: '[path][name]__[local]--[hash:base64:5]'
			        localIdentName: '[local]'
			      }
			    },
                'postcss-loader'
                ]
            },
            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
            {test: /\.svg/, loader: 'svg-url-loader'}           
        ]
	},
	 plugins: [
       new webpack.LoaderOptionsPlugin({
         // test: /\.xxx$/, // may apply this only for some modules ／／
         options: {
           postcss: [autoprefixer()]
         }
       })
     ]
}

