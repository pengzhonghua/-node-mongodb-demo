// 用 node 的 express 模块创建一个 GET 请求的接口，
// 返回前端一个添加用户数据的页面
var express = require('express'),
    mongoose = require('mongoose'),
    qs = require('querystring');

var app = express();

var db = mongoose.connect('mongodb://10.1.26.23:27017/proClient');

db.connection.on('open', function(){
	console.log('数据库连接成功');
});
db.connection.on('err', function(err){
	console.log('数据库连接失败', err);
});

//创建数据骨架
var proClientSchema = new mongoose.Schema({
	username: String,
	age: Number,
	tel: Number
});

// 操作数据
var client = db.model('proClient', proClientSchema);


app.get('/add', function(req, res){
	res.sendFile(__dirname + '/add.html');
});

app.post('/addByForm', function(req, res){
	// 获取表单数据
	// console.log(req.query);
	var temp = '';
	req.on('data', function(chunk) {
	    temp += chunk;
	});
	req.on('end', function() {
	    var queryObj = qs.parse(temp.toString());
		console.log(queryObj);
		var username = queryObj.username,
		    age = queryObj.age,
		    tel = queryObj.tel;

		if(!username || !age || !tel){
			var err = {
				code: 2,
				msg: '参数错误，请检查！'
			};
			res.send(JSON.stringify(err));
		}else{
			client.create({
				username: username,
				age: age,
				tel: tel
			}, function(err){
				if(err){
					var err = {
						code: 1,
						msg: '数据写入失败，请稍后重试！'
					};
					res.send(JSON.stringify(err));
				}else{
					var success = {
						code: 0,
						msg: '写入成功！'
					};
					res.send(JSON.stringify(success));
				}
			})
		}
	})
});

app.all('*', function(req, res){
	res.sendFile(__dirname + req.path);
})


// 4. 监听端口号
app.listen(8888, function() {
    console.log('success');
})