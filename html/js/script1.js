document.addEventListener('DOMContentLoaded', function () {
    var inputFile = document.getElementById('input-file');
    inputFile.addEventListener('change', function (event) {
        var selectedFile = event.target.files[0];
        if (selectedFile) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.body.style.backgroundImage = 'url(' + e.target.result + ')';
                document.body.style.backgroundSize ="cover"; 
                document.body.style.backgroundPosition = '1% 1% 1% 1%'; 
                document.body.innerHTML = '';
            };
            reader.readAsDataURL(selectedFile);
        }
    });
});
