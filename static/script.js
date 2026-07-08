const form = document.getElementById("predictionForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    resultDiv.innerHTML = `
        <h2>🔄 Predicting...</h2>
        <p>Please wait...</p>
    `;

    try {

        const response = await fetch("/predict", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        // Real server error
        if (data.status === "error") {

            resultDiv.innerHTML = `
                <h2 class="danger">Server Error</h2>
                <p>${data.message}</p>
            `;

            return;
        }

        let icon = "";
        let color = "";

        if (data.prediction === "Placed") {

            icon = "✅";
            color = "success";

        }

        else {

            icon = "❌";
            color = "danger";

        }

        resultDiv.innerHTML = `

            <h2 class="${color}">
                ${icon} ${data.prediction}
            </h2>

            <p>${data.message}</p>

            <br>

            <p><strong>CGPA :</strong> ${data.cgpa}</p>

            <p><strong>IQ :</strong> ${data.iq}</p>

            <p><strong>Internship :</strong> ${data.internship == 1 ? "Yes" : "No"}</p>

            <p><strong>Projects :</strong> ${data.projects}</p>

            <p><strong>DSA Rating :</strong> ${data.dsa_rating}</p>

            <br>

            <div class="progress-container">

                <div class="progress-label">

                    Confidence : ${data.confidence}%

                </div>

                <div class="progress">

                    <div class="progress-bar"
                         style="width:${data.confidence}%">

                    </div>

                </div>

            </div>

        `;

    }

    catch(error){

        resultDiv.innerHTML = `

            <h2 class="danger">

                Connection Error

            </h2>

            <p>

                Unable to connect to Flask server.

            </p>

        `;

        console.error(error);

    }

});