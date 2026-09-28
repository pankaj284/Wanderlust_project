const uploadLimit = 2 * 1024 * 1024; // 2 MB

const input = document.getElementById("imageInput");
const errorMsg = document.getElementById("errorMsg");


const form = document.querySelector(".needs-validation");
const submitBtn = document.querySelector(".add-btn, .edit-btn");

if (form && submitBtn) {
    form.addEventListener("submit", function () {
        if (form.checkValidity()) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                uploading...
            `;
        }
    });
}

input.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (file) {

        if (file.size > uploadLimit) {

            // Show error
            errorMsg.textContent =
                "File is too large! Please choose an image under 2MB.";

            input.classList.add("is-invalid");

            // Remove selected file
            input.value = "";

        } else {

            // Remove error
            input.classList.remove("is-invalid");
            errorMsg.textContent = "";
        }


        // Optional: Compress image to max 1200px width/height and 70% quality
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDimension = 1200;
            let { width, height } = img;
            if (width > height && width > maxDimension) {
                height = (height * maxDimension) / width;
                width = maxDimension;
            } else if (height > maxDimension) {
                width = (width * maxDimension) / height;
                height = maxDimension;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                const compressedFile = new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(compressedFile);
                input.files = dataTransfer.files;
            }, "image/jpeg", 0.75); // 75% quality reduces size by 80-90%
        };
    }

});