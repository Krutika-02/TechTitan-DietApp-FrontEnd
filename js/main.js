const apiBase = "http://localhost:8001";

// Login
$("#loginForm").submit(function (e) {
    e.preventDefault();

    const email = $("#email").val();
    const password = $("#password").val();

    // Ensure data is sent as JSON
    const payload = JSON.stringify({ email, password });

    $.ajax({
        url: `${apiBase}/userManagement/login`,
        type: "POST",
        contentType: "application/json", // Ensure the server knows it's JSON
        data: payload, // Pass JSON data as a string
        success: (response) => {
            alert("Login successful!");
            localStorage.setItem("userToken", response.token);
            window.location.href = "user-dashboard.html";
        },
        error: (xhr) => {
            const errorMessage = xhr.responseJSON?.detail || "Login failed. Please try again.";
            alert(errorMessage);
        },
    });
});


// Register
$("#registerForm").submit(function (e) {
    e.preventDefault();

    // Collect all form data
    const formData = {
        first_name: $("#firstName").val(),
        last_name: $("#lastName").val(),
        email: $("#email").val(),
        phone_number: $("#phoneNumber").val(),
        password: $("#password").val(),
        gender: $("#gender").val(),
        goal: $("#goal").val(),
        height: parseFloat($("#height").val()),
        weight: parseFloat($("#weight").val()),
        date_of_birth: $("#dob").val(),
    };

    // Send data as JSON
    $.ajax({
        url: `${apiBase}/userManagement/register`,
        type: "POST",
        contentType: "application/json", // Ensure server recognizes JSON
        data: JSON.stringify(formData),
        success: (response) => {
            alert("Registration successful!");
            window.location.href = "login.html";
        },
        error: (xhr) => {
            let errorMessage = "Registration failed. Please try again."; // Default message
            if (xhr.responseJSON && xhr.responseJSON.detail) {
                // Extract meaningful message if available
                errorMessage = xhr.responseJSON.detail;
            } else if (xhr.responseText) {
                // Fallback to raw response text
                errorMessage = xhr.responseText;
            }
            alert(errorMessage); // Display the error
        },
    });
});

$("#dietPlanForm").submit(function (e) {
    e.preventDefault();

    // Collect form data
    const formData = {
        age: parseInt($("#age").val(), 10),
        health_conditions: $("#healthConditions").val(),
        activity_level: $("#activityLevel").val(),
        preferences: $("#preferences").val(),
        height: parseFloat($("#height").val()),
        weight: parseFloat($("#weight").val()),
    };

    // Call API to generate diet plan
    $.ajax({
        url: `${apiBase}/aiSystem/generate-diet-plan/`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: (response) => {
            const formattedPlan = `
                <h4 class="text-primary">BMI: ${response.bmi.toFixed(1)}</h4>
                <p>${response.diet_plan
                    .replace(/[*]/g, "") // Remove all asterisks
                    .replace(/\n/g, "<br>") // Replace line breaks with <br>
                }</p>
            `;

            $("#dietPlanContent").html(formattedPlan);
            $("#dietPlanModal").modal("show"); // Show the modal
        },
        error: (xhr) => {
            const errorMessage = xhr.responseJSON?.detail || "Failed to generate diet plan. Please try again.";
            alert(errorMessage);
        },
    });
});

$(document).ready(function () {
    if (window.location.pathname.endsWith("dietitian.html")) {
        $.ajax({
            url: `${apiBase}/dietitian/`,
            type: "GET",
            success: (response) => {
                const dietitianList = response.map((d) => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${d.name}</h5>
                            <p class="card-text">${d.specialization}</p>
                            <p class="card-text"><small>${d.contact}</small></p>
                        </div>
                    </div>
                `).join("");
                $("#dietitianList").html(dietitianList);
            },
            error: () => {
                $("#dietitianList").html(`<p class="text-danger">Failed to load dietitians.</p>`);
            },
        });
    }
});
