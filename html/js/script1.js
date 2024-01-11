// Selecting draw-box and input-file
var drawButton = document.getElementById("draw-box");
var input = document.getElementById("input-file");
var imageContainer = document.querySelector(".image");

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
    }
});

// Function to handle drawing
function draw() {
    // Add an event listener to the image container to capture clicks
    imageContainer.addEventListener("click", function (event) {
        // Create a text box at the clicked position on the image
        var textBox = document.createElement("input");
        textBox.type = "text";
        textBox.placeholder = "Enter value";
        textBox.style.position = "absolute";
        textBox.style.left = (event.offsetX / imageContainer.clientWidth) * 100 + "%";
        textBox.style.top = (event.offsetY / imageContainer.clientHeight) * 100 + "%";

        // Append the text box to the image container
        imageContainer.appendChild(textBox);
    });
}
