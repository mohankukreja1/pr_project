from flask import Flask,render_template,url_for,request, jsonify, request
from werkzeug import secure_filename
import pandas as pd 
import pickle
import os
from fastai.vision import *
#from sklearn.feature_extraction.text import CountVectorizer
#from sklearn.naive_bayes import MultinomialNB
#from sklearn.externals import joblib
from PIL import ImageFile

#load data 
PATH_ts1 = Path('CombinedImages')
tfms = get_transforms(flip_vert = True)
data = (ImageItemList.from_folder(PATH_ts1) 
        .random_split_by_pct(valid_pct=0.1)
        .label_from_folder()
        .transform(tfms, size=600)
        .databunch(bs=16)
        .normalize(imagenet_stats))

ImageFile.LOAD_TRUNCATED_IMAGES = True

#load model
learn = create_cnn(data, models.resnet18, metrics =accuracy)
learn.load('30it_0401')


app = Flask(__name__)


UPLOAD_FOLDER = '/images'
ALLOWED_EXTENSIONS = set(['jpeg','jpg','png'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
	return render_template('home.html')



# when saving the file


@app.route('/',methods=['POST'])
def predict():
    #model
    if request.method=='POST':
        os.makedirs(os.path.join(app.instance_path, 'images'), exist_ok=True)
        f = request.files['pic']
        print(f)
        f.save(os.path.join(app.instance_path, 'images', secure_filename('pic.jpeg'))) #instead of pic.jpeg use
                                                                                        #f.filename to save with name
                                                                                        #of uploaded file
                                                                                        #(although this will eat space)
        #prediction
        img = open_image('instance/images/pic.jpeg')
        output = str(learn.predict(img))
        ans = output.split(' ')[1]
        print(ans)
        my_prediction = ans[:-1]
        
        if (ans[0] is 'N'):
            my_prediction = 'Benign'
        elif (ans[0] is 'M'):
            my_prediction = 'Malignant'
            
        file = open('result.txt','w') 
        file.write(my_prediction) 
        file.close() 
         
    return render_template('results.html', prediction=my_prediction)



if __name__ == '__main__':
	app.run(debug=True)
