const BASE_URL = "/api/siput";

async function generateBrat() {

    const text = document.getElementById("text").value.trim();
    const result = document.getElementById("result");

    if (!text) {
        result.innerHTML = `
        <div class="error">
            Masukkan teks terlebih dahulu.
        </div>`;
        return;
    }

    result.innerHTML = `
    <div class="loading">
        ⏳ Sedang membuat Brat...
    </div>`;

    try {

        const imageUrl =
            `${BASE_URL}/m/brat?text=${encodeURIComponent(text)}&delay=500`;

        const img = new Image();

        img.src = imageUrl;

        img.onload = () => {

            result.innerHTML = "";

            result.appendChild(img);

        };

        img.onerror = () => {

            result.innerHTML = `
            <div class="error">
                Gagal mengambil gambar.
            </div>`;

        };

    } catch (err) {

        result.innerHTML = `
        <div class="error">
            ${err.message}
        </div>`;

    }

}
