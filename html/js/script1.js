// Selecting draw-box, input-file, and clear-boxes
var drawButton = document.getElementById("draw-box");
var input = document.getElementById("input-file");
var imageContainer = document.querySelector(".image");
var clearButton = document.getElementById("clear-boxes");

// Function to save text boxes array in localStorage
function saveTextBoxes(textboxes) {
    localStorage.setItem("textboxes", JSON.stringify(textboxes));
}

// Function to load text boxes array from localStorage
function loadTextBoxes() {
    var storedTextBoxes = localStorage.getItem("textboxes");
    return storedTextBoxes ? JSON.parse(storedTextBoxes) : [];
}

// Function to generate a random 3-digit number
function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100; // Random number between 100 and 999
}

// Adding event listener to input-file
input.addEventListener("change", function (event) {
    // Get the selected file
    var file = event.target.files[0];

    // Check if a file was selected
    if (file) {
        // Find the existing image element
        var existingImage = document.querySelector(".image img");

        // If an existing image is found, replace its source
        if (existingImage) {
            existingImage.src = URL.createObjectURL(file);
        } else {
            // If no existing image, create a new div and image element
            var div = document.createElement("div");
            div.setAttribute("class", "image");

            var img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.alt = "img";
            img.style.width = "100%";
            img.style.height = "100%";

            div.appendChild(img);

            // Append the new div to the drawButton's parent element
            drawButton.parentNode.insertBefore(div, drawButton.nextSibling);
        }

        // Save the image URL in localStorage
        localStorage.setItem("imageURL", URL.createObjectURL(file));

        // Draw text boxes
        draw();
    }
});

// Function to handle drawing
// ...

// Function to handle drawing
function draw() {
    var textboxes = loadTextBoxes();
    var isTextBoxCreated = false; // Flag to check if a text box has been created

    // Add an event listener to the image container to capture clicks
    imageContainer.addEventListener("click", function (event) {
        // Check if the click target is an input element (prevents creating a new textbox when clicking on an existing one)
        if (event.target.tagName.toLowerCase() === "input") {
            return;
        }

        // Check if a text box has already been created
        if (!isTextBoxCreated) {
            // Create a text box at the clicked position on the image
            var textBox = document.createElement("input");
            textBox.type = "text";
            textBox.placeholder = "Enter value";
            textBox.style.position = "absolute";
            textBox.style.left = (event.offsetX / imageContainer.clientWidth) * 100 + "%";
            textBox.style.top = (event.offsetY / imageContainer.clientHeight) * 100 + "%";

            // Generate and set a random 3-digit number
            textBox.value = generateRandomNumber();

            // Append the text box to the image container
            imageContainer.appendChild(textBox);

            // Add the new textbox to the array
            textboxes.push({
                value: textBox.value,
                left: textBox.style.left,
                top: textBox.style.top
            });

            // Save the textboxes array in localStorage
            saveTextBoxes(textboxes);

            // Attach the "input" event listener to update the stored value when the text box is moved
            attachInputEventListener(textBox, textboxes);

            // Set the flag to true to indicate that a text box has been created
            isTextBoxCreated = true;
        }
    });

    // Load stored textboxes and display them
    textboxes.forEach(function (item) {
        var textBox = document.createElement("input");
        textBox.type = "text";
        textBox.value = item.value;
        textBox.style.position = "absolute";
        textBox.style.left = item.left;
        textBox.style.top = item.top;

        // Append the text box to the image container
        imageContainer.appendChild(textBox);

        // Attach the "input" event listener to update the stored value when the text box is moved
        attachInputEventListener(textBox, textboxes);
    });

    // Set interval to update the value of each text box every 30 seconds
    setInterval(function () {
        textboxes.forEach(function (item) {
            var textBox = document.querySelector(`.image input[value='${item.value}']`);
            if (textBox) {
                textBox.value = generateRandomNumber();
                item.value = textBox.value;
                saveTextBoxes(textboxes);
            }
        });
    }, 30000);
}

// ...


// Function to attach the "input" event listener to update the stored value when the text box is moved
function attachInputEventListener(textBox, textboxes) {
    textBox.addEventListener("input", function () {
        var index = textboxes.findIndex(item => item.left === textBox.style.left && item.top === textBox.style.top);
        if (index !== -1) {
            textboxes[index].value = textBox.value;
            saveTextBoxes(textboxes);
        }
    });
}

// Load stored image on page load
document.addEventListener("DOMContentLoaded", function () {
    var storedImageURL = localStorage.getItem("imageURL");
    var imageContainer = document.querySelector(".image");

    if (storedImageURL) {
        // Create a new div and image element with the stored image URL
        var div = document.createElement("div");
        div.setAttribute("class", "image");
        document.body.appendChild(div); // Append to the body

        var img = document.createElement("img");
        img.src = storedImageURL;
        img.alt = "img";
        img.style.width = "100%";
        img.style.height = "100%";

        // Remove any existing images in the container
        while (imageContainer.firstChild) {
            imageContainer.removeChild(imageContainer.firstChild);
        }

        // Append the new image to the image container
        imageContainer.appendChild(img);
    }

    // Draw text boxes
    draw();
});

// Function to clear all textboxes and the stored image
function clearTextBoxes() {
    var textboxes = document.querySelectorAll(".image input[type='text']");
    textboxes.forEach(function (textbox) {
        textbox.remove();
    });

    // Clear the stored textboxes and image in localStorage
    saveTextBoxes([]);
    localStorage.removeItem("imageURL");
}