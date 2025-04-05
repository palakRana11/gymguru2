# model.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import LabelEncoder, PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app)  # Allow cross-origin from frontend

# Load and prepare data
calorie_data = pd.read_csv('C:/Users/palak/Downloads/calories.csv')
exercise_data = pd.read_csv('C:/Users/palak/Downloads/exercise.csv')
df = pd.merge(calorie_data, exercise_data, on='User_ID')
df.drop(columns=['User_ID', 'Body_Temp', 'Heart_Rate'], inplace=True)
le = LabelEncoder()
df['Gender'] = le.fit_transform(df['Gender'])
X = df.drop(columns=['Calories'])
y = df['Calories']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
poly = PolynomialFeatures(degree=3)
X_train_poly = poly.fit_transform(X_train)
model = LinearRegression()
model.fit(X_train_poly, y_train)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    Gender = int(data['gender'])  # 0 or 1
    Age = int(data['age'])
    Height = float(data['height'])
    Weight = float(data['weight'])
    Duration = float(data['duration'])

    input_data = [[Gender, Age, Height, Weight, Duration]]
    prediction = model.predict(poly.transform(input_data))
    return jsonify({'calories_burnt': round(prediction[0], 2)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
