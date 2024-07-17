from flask import Flask, request, render_template
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
import os
import base64

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
tipos = ['carcinoma_celulas_basales',
 'carcinoma_celulas_escamosas',
 'dermatofibroma',
 'lesion_vascular',
 'melanoma',
 'nevus',
 'queratosis_actinica',
 'queratosis_benigna_pigmentada',
 'queratosis_seborreica']

model = tf.keras.models.load_model('model.h5')

# Define la carpeta temporal para guardar las imágenes
CARPETA_TEMPORAL = '/tmp'

# Crea la carpeta temporal si no existe
if not os.path.exists(CARPETA_TEMPORAL):
    os.makedirs(CARPETA_TEMPORAL)

def save_base64_file(base64_string):
    if base64_string.startswith("data:image"):
        base64_string = base64_string.split(",")[1]
    image_data = base64.b64decode(base64_string)
    output_filepath = os.path.join('/tmp/', 'image.jpeg')
    with open(output_filepath, "wb") as output_file:
        output_file.write(image_data)


@app.route('/upload', methods=['POST'])
def upload():
    save_base64_file(request.get_json()['file'])
    img = cv2.imread('/tmp/image.jpeg')
    img = tf.image.resize(img, (224, 224))
    img = img / 255
    img = np.expand_dims(img, axis=0)
    
    prediccion = model.predict(img)
    predict= tipos[list(prediccion[0]).index(max(prediccion[0]))]
    msg = "Tipo: " + str(predict) + " - Con una probabilidad del: " + str(round(max(prediccion[0])*100,2)) +"%"
    return {'status':'success', 'msg':msg}

if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)

