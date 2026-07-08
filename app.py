from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# ===============================
# Load Model & Scaler
# ===============================

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

print("Model Loaded Successfully")
print("Scaler expects", scaler.n_features_in_, "features")


# ===============================
# Home Page
# ===============================

@app.route("/")
def home():
    return render_template("index.html")


# ===============================
# Prediction
# ===============================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        cgpa = float(request.form["cgpa"])
        iq = float(request.form["iq"])
        internship = int(request.form["internship"])
        projects = int(request.form["projects"])
        dsa_rating = float(request.form["dsa_rating"])

        features = np.array([[
            cgpa,
            iq,
            internship,
            projects,
            dsa_rating
        ]])

        scaled = scaler.transform(features)

        prediction = model.predict(scaled)[0]

        probability = model.predict_proba(scaled)[0]

        confidence = round(max(probability) * 100, 2)

        if prediction == 1:

            prediction_text = "Placed"

            message = "Congratulations! The model predicts a high chance of placement."

        else:

            prediction_text = "Not Placed"

            message = "The model predicts a lower chance of placement. Keep improving your skills."

        return jsonify({

            "status": "success",

            "prediction": prediction_text,

            "message": message,

            "confidence": confidence,

            "cgpa": cgpa,

            "iq": iq,

            "internship": internship,

            "projects": projects,

            "dsa_rating": dsa_rating

        })

    except Exception as e:

        print(e)

        return jsonify({

            "status": "error",

            "message": str(e)

        })


if __name__ == "__main__":
    app.run(debug=True)