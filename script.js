const BASE_URL = "/api/siput";

function generateBrat() {
    const text = document.getElementById("text").value;

    document.getElementById("result").innerHTML =
        `<img src="${BASE_URL}/m/brat?text=${encodeURIComponent(text)}">`;
}
