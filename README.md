# 搜索引擎说明文档

## 开发环境

本项工程是在python3.6，mongoDB，node js，flask下开发的

## 目的

熟悉前端后端陪和开发，熟练使用`python`,以及使用`python`框架下进行数据的爬取。

## 运行方法

在命令行中输入

`python3.6 index.py`

## 主要部分

本次项目开发主要分为三个主要的部分。

1. 数据的爬取
2. 前端框架的构建
3. 数据库的使用

### 数据的爬取

本次数据爬取采取了两种方法。一种是通过node js来进行数据爬取，另一种方法是通过python自带的urllib库与beautifulsoup库来进行数据的解析。

**为何使用两种方法进行爬取**

1. js的异步操作能够极大的加速数据爬取的效率。很多同学1w条信息通过python爬了接近12h，可以说是相当耗时。因为python不能够采取异步爬取，所以在爬取大规模数据的时候我会选择使用js来进行爬取。1w条信息的爬取我大概花了不到2h左右的时间就把数据爬取下来并且储存到数据库中。所以说，大规模的爬取信息js是一种另加理想的选择。

2. 我同时也使用`python`来对于信息进行爬取。之前有讲到，node爬取效率非常高，为何我们还要用python呢？

   _因为我们这门课学的就是python_ 

   当然这不是主要原因，主要原因是当我结束数据爬取的时候，发现照片的数据有问题，并不是照片本身的url，但是通过爬下来的url可以找到照片本身的url，所以我就是用python进行调整，通过urllib这个库对这个URL进行二次调整，所以获得照片的URL

###### 技术细节

1. 使用如下库文件

```javascript
var cheerio = require('cheerio');
var http = require('https');
var iconv = require('iconv-lite');
```

cheerio实现一个类似于bf4的选择器

https获取页面

iconv进行页面转码，使抓取的界面可以进行解析

2. 由于js本身是异步执行的，所以说为了防止IP被封，要随机休眠

```javascript
async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two second later');
}
```

3. 连接数据库,将成功爬取的信息存入数据库中

   ```javascript
   var mongo_url = 'mongodb://localhost:27017/trevor-mongo';
   function save() {
   	var MongoClient = require('mongodb').MongoClient;
   	MongoClient.connect(mongo_url, function(err, db) {
   		if (err) {
   			console.error(err);
   			return;
   		} else {
   			console.log("成功连接数据库");
   			var collection = db.collection('node-reptitle');
   			collection.insertMany(btLink, function(err, result) {
   				if (err) {
   					console.error(err);
   				} else {
   					console.log("保存数据成功");
   				}
   			})
   			db.close();
   		}
   	});
   }
   ```

   ## 前端框架的架构

   前端框架我选择flask这款轻量级的python前端API，因为之前开发使用的时候感觉这款库的效果要好于课上所要求的，所以说我选择flask来进行开发。

   同时，也因为flask能够对于mongoDB这个数据库有很好的兼容。

   这个是前端主要框架

   ![屏幕快照 2017-09-22 16.47.32](/Users/mac/Desktop/屏幕快照 2017-09-22 16.47.32.png)

   这个是程序的主要界面

   ![屏幕快照 2017-09-22 16.49.12](/Users/mac/Desktop/屏幕快照 2017-09-22 16.49.12.png)

   以下两张是程序的第二个界面（list.html），关键字已经标红

   ![屏幕快照 2017-09-22 16.50.20](/Users/mac/Desktop/屏幕快照 2017-09-22 16.50.20.png)



下面是分页

![屏幕快照 2017-09-22 16.50.28](/Users/mac/Desktop/屏幕快照 2017-09-22 16.50.28.png)

下面是第三个界面（show.html）

![屏幕快照 2017-09-22 16.50.44](/Users/mac/Desktop/屏幕快照 2017-09-22 16.50.44.png)

接下来我将简要说明各个功能的实现

1. css已经加在界面中，可以直接查看，下面是一个对于分页按钮样例的css样式,因为按钮是动态生成的，所以这段样式直接写在js代码中

```javascript
                    bb.css('float', 'left');
                    bb.css('backgroundColor', 'white');
                    bb.css('font-weight', 'bold');
                    bb.css('color', '#4a4a4a');
```

2. 分页，直接用js实现，通过jquery这个辅助的库来进行DOM元素的显示，代码如下

   ```javascript
               function changeTo(index) {
                   result = $('.list');
                   if (result.length < index * 10)
                       return;
                   for (let i = 0; i < result.length; ++i) {
                       let a = $(result[i]);
                       a.hide();
                   }
                   for (let i = index * 10; i < (index + 1) * 10 && i < result.length; ++i) {
                       let a = $(result[i]);
                       a.show();
                   }

               }
   ```

   3. 关键字高亮（标红），还是直接用js来实现。。代码如下

      ```javascript
                      result = $('.list');
                      reslut = "";
                      key = "";
                      reger1 = new RegExp(key, "gm");
                      var aaa = $('.hhh');
                      for (let i = 0; i < aaa.length; ++i) {
                          a = $(aaa[i]).html();
                          toRed(a, 'whole');
                      }

                      function toRed(content, id) {
                          var bodyHtml = $("#" + id).html();
                          reger = new RegExp("(>|^)([^<]*)(" + content + ")([^>]*<)", "gm");
                          reslut = bodyHtml.replace(reger, "$1$2<font color='red'>$3</font>$4");
                          $("#" + id).html(reslut);
                      }
      ```

      4. 多字段查询

         调用`pymongo`中的find函数

         代码如下

         ```python
         from flask import Flask,render_template
         from flask.ext.wtf import Form
         from flask.ext.bootstrap import Bootstrap
         from wtforms import StringField,SubmitField
         from wtforms.validators import Required;
         from pymongo import *;
         from urllib import request;
         from bs4 import BeautifulSoup;

         client=MongoClient();
         client=MongoClient('localhost',27017);
         client=MongoClient('mongodb://localhost:27017/');
         db=client.film;
         collection=db.film;
         @app.route('/',methods=['GET','POST'])
         def index():
             name = None
             nameForm = NameForm();
             if nameForm.validate_on_submit():
                 name = nameForm.name.data
                 current=name.split(' ');
                 for k in range(0,len(indexOfList)):
                     findIt=indexOfList[k];
                     for i in range(0,len(current)):
                         h=collection.find({findIt:{'$regex':current[i]}});
                         for j in h:
                             result.append(j);
                             pass;
                         pass;
                     pass;
                 nameForm.name.data = ''
                 nation=nameForm.nation.data;
                 if nation:
                     current.append(nation);
                     w=collection.find({'nation':nation});
                     for x in w:
                         result.append(x);
                         pass;
                     pass;
                 nation="";
                 occupy=nameForm.occpupation.data;
                 if occupy:
                     current.append(occupy);
                     w=collection.find({'nation':nation});
                     for x in w:
                         result.append(x);
                         pass;
                     pass;
                 occupy="";

                 if len(result):
                     return render_template('list.html',list=result,query=current);
                 return render_template('main.html',form=nameForm);
             return render_template('main.html',form=nameForm);
         ```

         5. 支持多属性查找，代码如上
         6. 多查询词，通过模糊查询，优先选择重复率高的元素，代码如上

## 数据库

使用MongoDB这个数据库，因为这个数据库接口简单，并且是纯c手写，所以性能高，检索时非常快，关于数据库的代码如下

1. 储存数据

```javascript
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


```

2. 调用数据

   ```python
   from flask import Flask,render_template
   from flask.ext.wtf import Form
   from flask.ext.bootstrap import Bootstrap
   from wtforms import StringField,SubmitField
   from wtforms.validators import Required;
   from pymongo import *;
   from urllib import request;
   from bs4 import BeautifulSoup;

   client=MongoClient();
   client=MongoClient('localhost',27017);
   client=MongoClient('mongodb://localhost:27017/');
   db=client.film;
   collection=db.film;

   indexOfList=['name','nation','occupy'];

   class NameForm(Form):
       name = StringField('你要查询的是？',validators=[Required()])
       submit = SubmitField('提交');
       nation=StringField();
       occpupation=StringField();

   app = Flask(__name__)
   app.config['SECRET_KEY'] = 'ni cai'
   bootstrap = Bootstrap(app)
   result=[];

   @app.route('/',methods=['GET','POST'])
   def index():
       name = None
       nameForm = NameForm();
       if nameForm.validate_on_submit():
           name = nameForm.name.data
           current=name.split(' ');
           for k in range(0,len(indexOfList)):
               findIt=indexOfList[k];
               for i in range(0,len(current)):
                   h=collection.find({findIt:{'$regex':current[i]}});
                   for j in h:
                       result.append(j);
                       pass;
                   pass;
               pass;
           nameForm.name.data = ''
           nation=nameForm.nation.data;
           if nation:
               current.append(nation);
               w=collection.find({'nation':nation});
               for x in w:
                   result.append(x);
                   pass;
               pass;
           nation="";
           occupy=nameForm.occpupation.data;
           if occupy:
               current.append(occupy);
               w=collection.find({'nation':nation});
               for x in w:
                   result.append(x);
                   pass;
               pass;
           occupy="";

           if len(result):
               return render_template('list.html',list=result,query=current);
           return render_template('main.html',form=nameForm);
       return render_template('main.html',form=nameForm);


   ```

   ## 总结

   感谢张广艳老师和助教学长的辛勤工作，我学到好多新的知识，编程能力较之前有较大的提升，非常感谢。