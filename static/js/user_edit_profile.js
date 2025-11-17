// Avatar Preview Script
document.addEventListener("DOMContentLoaded", () => {
  const avatarInput = document.getElementById("avatar");
  const avatarPreview = document.getElementById("avatarPreview");

  if (avatarInput) {
    avatarInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
