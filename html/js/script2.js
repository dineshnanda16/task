// Selecting draw-box and input-file
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

            // Ensure the image takes the full size of the container
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

    // Add an event listener to the image container to capture clicks
    imageContainer.addEventListener("click", function (event) {
        // Create a text box at the clicked position on the image
        var textBox = document.createElement("input");
        textBox.type = "text";
        textBox.placeholder = "Enter value";
        textBox.style.position = "absolute";

        // Calculate the correct coordinates relative to the image container
        var containerRect = imageContainer.getBoundingClientRect();
        textBox.style.left = ((event.clientX - containerRect.left) / containerRect.width) * 100 + "%";
        textBox.style.top = ((event.clientY - containerRect.top) / containerRect.height) * 100 + "%";

        // Append the text box to the image container
        imageContainer.appendChild(textBox);

        textboxes.push({
            value: "",
            left: textBox.style.left,
            top: textBox.style.top
        });
        saveTextBoxes(textboxes);

        // Attach the "input" event listener to update the stored value when the text box is moved
        attachInputEventListener(textBox, textboxes);
    });

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
    var imageContainer = document.querySelector(".image img");

    if (storedImageURL) {
        // Create a new div and image element with the stored image URL
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


// Function to clear all textboxes
function clearTextBoxes() {
    var textboxes = document.querySelectorAll(".image input[type='text']");
    textboxes.forEach(function (textbox) {
        textbox.remove();
    });

    // Clear the stored textboxes in localStorage
    saveTextBoxes([]);
}
