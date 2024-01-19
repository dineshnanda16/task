// script1.js

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

document.addEventListener("DOMContentLoaded", function () {
    var storedImageURL = localStorage.getItem("imageURL");
    var imageContainer = document.querySelector(".image");

    if (storedImageURL) {
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

    // Load and display stored textboxes
    var textboxes = loadTextBoxes();
    textboxes.forEach(function (item) {
        var textBox = document.createElement("input");
        textBox.type = "text";
        textBox.value = item.value;
        textBox.style.position = "absolute";
        textBox.style.left = item.left;
        textBox.style.top = item.top;

        // Append the text box to the body element
        document.body.appendChild(textBox);

        // Attach the "input" event listener to update the stored value when the text box is moved
        attachInputEventListener(textBox, textboxes);
    });
});
