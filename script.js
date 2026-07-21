const BASE_URL="/api/siput";

function executeRequest(){

const endpoint=document.getElementById("endpoint").value;
const text=document.getElementById("text").value;
const delay=document.getElementById("delay").value;

document.getElementById("result").innerHTML=`
<img src="${BASE_URL}${endpoint}?text=${encodeURIComponent(text)}&delay=${delay}" width="100%">
`;

}
