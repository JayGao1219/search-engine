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


@app.route('/show/<int:num>')
def showList(num):
    print('num');
    print(num);
    man=result[num];
    cururl="";
    if man['photo']:
        response=request.urlopen('https://en.wikipedia.org'+man['photo']);
        page=response.read();
        page=page.decode('utf-8');
        soup=BeautifulSoup(page,'html.parser');
        cururl=soup.select('.fullImageLink a')[0].attrs['href'];
        return render_template('show.html',name=man['name'],photo=cururl,occupy=man['occupation']);
    return render_template('show.html',name=man['name'],photo=man['photo'],occupy=man['occupation'])

if __name__ == '__main__':
    app.run(debug=True)
