// Function to load text boxes array from localStorage
function loadTextBoxes() {
    var storedTextBoxes = localStorage.getItem("textboxes");
    if (storedTextBoxes) {
        var parsedTextBoxes = JSON.parse(storedTextBoxes);

        // Convert left and top values to pixels if they are in percentage format
        return parsedTextBoxes.map(function (item) {
            return {
                value: item.value,
                left: convertToPixels(item.left),
                top: convertToPixels(item.top)
            };
        });
    } else {
        return [];
    }
}

// Function to convert percentage values to pixels
function convertToPixels(percentage) {
    return parseFloat(percentage);
}

// Function to draw text boxes
// result.js

// Function to convert percentage values to pixels
function convertToPixels(percentage, containerSize) {
    return (parseFloat(percentage) / 100) * containerSize + "px";
}

// Function to draw text boxes
// result.js

function draw(container) {
    var textboxes = loadTextBoxes();

    // Load stored textboxes and display them
    textboxes.forEach(function (item) {
        var textBox = document.createElement("input");
        textBox.type = "text";
        textBox.value = item.value;
        textBox.style.position = "absolute";

        // Convert percentage values to pixels based on the result container size
        textBox.style.left = convertToPixels(item.left, container.clientWidth);
        textBox.style.top = convertToPixels(item.top, container.clientHeight);

        // Append the text box to the result container
        container.appendChild(textBox);

        // Attach the "input" event listener to update the stored value when the text box is moved
        attachInputEventListener(textBox, textboxes);
    });
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
    var resultContainer = document.getElementById("result-container");

    if (storedImageURL) {
        // Create a new div and image element with the stored image URL
        var div = document.createElement("div");
        div.setAttribute("class", "image");
        resultContainer.appendChild(div);

        var img = document.createElement("img");
        img.src = storedImageURL;
        img.alt = "img";
        img.style.width = "100%";
        img.style.height = "100%";

        // Remove any existing images in the container
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        // Append the new image to the image container
        div.appendChild(img);
    }

    // Draw text boxes in the result container
    draw(resultContainer);
});

// Function to save text boxes array in localStorage
function saveTextBoxes(textboxes) {
    localStorage.setItem("textboxes", JSON.stringify(textboxes));
}
