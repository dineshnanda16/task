// Selecting draw-box, input-file, and clear-boxes
var drawButton = document.getElementById("draw-box");
var input = document.getElementById("input-file");
var imageContainer = document.querySelector(".image");
var clearButton = document.getElementById("clear-boxes");

// Function to save text boxes array and image data in localStorage
function saveData(textboxes, imageDataUrl) {
    localStorage.setItem("textboxes", JSON.stringify(textboxes));
    localStorage.setItem("imageDataUrl", imageDataUrl);
}

// Function to load text boxes array and image data from localStorage
function loadData() {
    var storedTextBoxes = localStorage.getItem("textboxes");
    var storedImageDataUrl = localStorage.getItem("imageDataUrl");

    return {
        textboxes: storedTextBoxes ? JSON.parse(storedTextBoxes) : [],
        imageDataUrl: storedImageDataUrl || null
    };
}

// Function to generate a random 3-digit number
function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100; // Random number between 100 and 999
}

// Function to attach the "input" event listener to update the stored value when the text box is moved
function attachInputEventListener(textBox, textboxes) {
    textBox.addEventListener("input", function () {
        var index = textboxes.findIndex(
            (item) =>
                item.left === textBox.style.left && item.top === textBox.style.top
        );
        if (index !== -1) {
            textboxes[index].value = textBox.value;
            saveData(textboxes);
        }
    });
}

// Adding event listener to input-file
input.addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var imageDataUrl = e.target.result;

            // Set the image source directly
            var img = document.createElement("img");
            img.src = imageDataUrl;
            img.alt = "img";
            img.style.width = "100%";
            img.style.height = "100%";

            // Clear existing content in the image container
            imageContainer.innerHTML = "";
            // Append the new image to the image container
            imageContainer.appendChild(img);

            // Save the image data URL in localStorage
            saveData([], imageDataUrl);

            // Draw text boxes
            draw();
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
    }
});

// Load stored image on page load
document.addEventListener("DOMContentLoaded", function () {
    var { textboxes, imageDataUrl } = loadData();

    if (imageDataUrl) {
        var img = document.createElement("img");
        img.src = imageDataUrl;
        img.alt = "img";
        img.style.width = "100%";
        img.style.height = "100%";

        // Clear existing content in the image container
        imageContainer.innerHTML = "";
        // Append the stored image to the image container
        imageContainer.appendChild(img);
    }

    // Draw text boxes
    draw();
});

// Draw text boxes
function draw() {
    var { textboxes, imageDataUrl } = loadData();
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

          

            // Append the text box to the image container
            imageContainer.appendChild(textBox);

            // Add the new textbox to the array
            textboxes.push({
                value: textBox.value,
                left: textBox.style.left,
                top: textBox.style.top
            });

            // Save the textboxes array and image data in localStorage
            saveData(textboxes, imageDataUrl);

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
                saveData(textboxes, imageDataUrl);
            }
        });
    }, 30000);
}
