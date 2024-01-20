// Selecting input-file and imageContainer
var input = document.getElementById("input-file");
var imageContainer = document.querySelector(".image");

// Function to save text boxes array and image data in localStorage
function saveData(textboxes, imageURL) {
    localStorage.setItem("textboxes", JSON.stringify(textboxes));
    localStorage.setItem("imageURL", imageURL);
}

// Function to load text boxes array and image data from localStorage
function loadData() {
    var storedTextBoxes = localStorage.getItem("textboxes");
    var storedImageURL = localStorage.getItem("imageURL");

    return {
        textboxes: storedTextBoxes ? JSON.parse(storedTextBoxes) : [],
        imageURL: storedImageURL || null
    };
}

// Function to generate a random 3-digit number
// Function to generate a random 3-digit number
function generateRandomNumber() {
    // Example: Generate a random number between 1 and 100
    return Math.floor(Math.random() * 1000) + 1;
}

// Add an event listener to the button
document.getElementById('randomButton').addEventListener('click', function() {
    var { textboxes, imageURL } = loadData();

    textboxes.forEach(function (item) {
        var textBox = document.querySelector(`.image input[value='${item.value}']`);
        if (textBox) {
            var randomValue = generateRandomNumber();
            textBox.value = randomValue;
            item.value = randomValue;
            saveData(textboxes, imageURL);
        }
    });
});

// Function to draw text boxes
function draw() {
    var { textboxes, imageURL } = loadData();

    // Add an event listener to the image container to capture clicks
    imageContainer.addEventListener("click", function (event) {
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

        // Save the textboxes array and image data in localStorage
        saveData(textboxes, imageURL);

        // Attach the "input" event listener to update the stored value when the text box is moved
        textBox.addEventListener("input", function () {
            var index = textboxes.findIndex(
                (item) =>
                    item.left === textBox.style.left && item.top === textBox.style.top
            );
            if (index !== -1) {
                textboxes[index].value = textBox.value;
                saveData(textboxes, imageURL);
            }
        });
    });

    // Set interval to update the value of each text box every 30 seconds
    setInterval(function () {
        textboxes.forEach(function (item) {
            var textBox = document.querySelector(`.image input[value='${item.value}']`);
            if (textBox) {
                textBox.value = generateRandomNumber();
                item.value = textBox.value;
                saveData(textboxes, imageURL);
            }
        });
    }, 30000);
}

// Adding event listener to input-file
input.addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var imageURL = e.target.result;

            // Set the image source directly
            var img = document.createElement("img");
            img.src = imageURL;
            img.alt = "img";
            img.style.width = "100%";
            img.style.height = "100%";

            // Clear existing content in the image container
            imageContainer.innerHTML = "";
            // Append the new image to the image container
            imageContainer.appendChild(img);

            // Save the image URL in localStorage
            saveData([], imageURL);

            // Draw text boxes
            draw();
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    draw();
});
