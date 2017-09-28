var mongo_url = 'mongodb://localhost:27017/stage';
var cheerio = require('cheerio');
var http = require('https');
var iconv = require('iconv-lite');
var url = 'https://en.wikipedia.org/wiki/List_of_stage_names';
var urltitle = 'https://en.wikipedia.org';
var urls = [];
var Info = [];
var count=770;
var max=990;


function getUrl(url) {
	console.log("正在获取整个页面的url");
	http.get(url, function(sres) {
		var chunks = [];
		sres.on('data', function(chunk) {
			chunks.push(chunk);
		});
		sres.on('end', function() {
			var html = iconv.decode(Buffer.concat(chunks), 'utf8');
			var $ = cheerio.load(html, {
				decodeEntities: false
			});
			$('.div-col ul li a').each(function(idx, element) {
				var $element = $(element);
				urls.push({
					title: $element.attr('href')
				});
			});
			getInfo(urls, count);
		});
	});
}

function getInfo(u, n) {
	console.log("开始获取" + n + "个人物信息");
		http.get('https://en.wikipedia.org' + u[n].title, function(sres) {
			var chunks = [];
			sres.on('data', function(chunk) {
				chunks.push(chunk);
			});
			sres.on('end', function() {
				var html = iconv.decode(Buffer.concat(chunks), 'utf8');
				var $ = cheerio.load(html, {
					decodeEntities: false
				});

				Info.push({
					name: $('.infobox .fn').text(),
					photo: $('.infobox .image').attr('href'),
					nation: $('.infobox .role').text(),
					occupation: $('.infobox .category').text()
				})
				if (n < max) {
					getInfo(urls, ++count);
				} else {
					console.log('收集完毕');
					save();
				}

			})
		});
	
}

function save() {
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect(mongo_url, function(err, db) {
		if (err) {
			console.error(err);
			return;
		} else {
			console.log("成功连接数据库");
			var collection = db.collection('stage');
			collection.insertMany(Info, function(err, result) {
				if (err) {
					console.error(err);
				} else {
					console.log("保存数据成功");
				}
			});
			db.close();
		}
	});
}


function main() {
	console.log("开始爬取");
	getUrl(url);
}

main();
