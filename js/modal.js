const captchaText = document.getElementById("captcha-text");
const captchaInput = document.getElementById("captcha-input");
const form = document.getElementById("form-contacto");
const modal = document.getElementById("modal-exito");

// Generar texto aleatorio
const textoCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
captchaText.textContent = textoCaptcha;

// Prevenir envío si el captcha no coincide
form.addEventListener("submit", function (e) {
    if (captchaInput.value.toUpperCase() !== textoCaptcha) {
        e.preventDefault();
        alert("Captcha incorrecto. Intenta de nuevo.");
        return;
    }

    // Mostrar modal y evitar redirección
    e.preventDefault();
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    // Enviar datos manualmente a FormSubmit usando fetch
    const formData = new FormData(form);
    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            alert("Error al enviar el mensaje.");
        }
    }).catch(() => {
        alert("No se pudo enviar. Revisa tu conexión.");
    });
});

function cerrarModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    form.reset();
    location.reload(); // para regenerar el captcha
}