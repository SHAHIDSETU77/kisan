
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Farmer ID Card Generator</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header>
    <h1>फार्मर आयडी कार्ड / Farmer ID Card</h1>
</header>

<div class="container">
    <form id="farmerForm">
        <h2>Enter Farmer Details</h2>
        <input type="text" id="name" placeholder="Full Name" required>
        <input type="date" id="dob" required>
        <select id="gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>
        <input type="text" id="mobile" placeholder="Mobile Number" required>
        <input type="text" id="aadhaar" placeholder="Aadhaar Number" required>
        <textarea id="address" placeholder="Full Address" required></textarea>
        
        <label>Upload Photo:</label>
        <input type="file" id="photo" accept="image/*" required><br><br>

        <h3>Land Details</h3>
        <table id="landTable">
            <thead>
                <tr>
                    <th>District</th><th>Taluka</th><th>Village</th><th>Gat No.</th><th>Khata No.</th><th>Area (H)</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <button type="button" onclick="addRow()">+ Add Land Detail</button><br><br>

        <button type="submit">Generate ID Card</button>
    </form>

    <div class="card-container">
        <div class="id-card" id="frontCard">
            <div class="header-green">
                <img src="assets/logo.png" class="logo">
                <h2>Agri Record</h2>
            </div>
            <div class="photo-section">
                <img id="photoPreview" src="" alt="Photo">
                <p id="cardName"></p>
                <p>DOB: <span id="cardDob"></span></p>
                <p>Gender: <span id="cardGender"></span></p>
                <p>Mobile: <span id="cardMobile"></span></p>
                <p>Aadhaar: <span id="cardAadhaar"></span></p>
                <div id="qrcode"></div>
            </div>
        </div>

        <div class="id-card" id="backCard">
            <h3>Address</h3>
            <p id="cardAddress"></p>
            <h3>Land Details</h3>
            <table id="backLandTable"></table>
        </div>
    </div>

    <div class="buttons">
        <button onclick="flipCard()">Flip Card</button>
        <button onclick="downloadPDF()">Download PDF</button>
        <button onclick="printCard()">Print</button>
    </div>
</div>

<footer>Powered by S.S.Computer</footer>

<script src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="script.js"></script>
</body>
</html>

body {
    font-family: Arial, sans-serif;
    background: #f4f9f4;
    margin: 0;
    padding: 0;
}
header {
    background: #2e7d32;
    color: #fff;
    text-align: center;
    padding: 15px;
    font-size: 24px;
}
.container {
    max-width: 900px;
    margin: 20px auto;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    text-align: center;
}
input, select, textarea, button {
    width: 90%;
    padding: 10px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}
button {
    background: #2e7d32;
    color: #fff;
    cursor: pointer;
    border: none;
}
button:hover {
    background: #1b5e20;
}
.id-card {
    border: 2px solid #2e7d32;
    border-radius: 8px;
    width: 300px;
    height: 400px;
    margin: 20px auto;
    padding: 10px;
    display: none;
    text-align: center;
    background: #fff;
}
.id-card img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
}
.header-green {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2e7d32;
    color: #fff;
    padding: 5px;
}
.logo {
    width: 40px;
}
footer {
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
    color: #666;
}

let qr;
function addRow() {
    let table = document.getElementById('landTable').querySelector('tbody');
    let row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" placeholder="District"></td>
        <td><input type="text" placeholder="Taluka"></td>
        <td><input type="text" placeholder="Village"></td>
        <td><input type="text" placeholder="Gat No."></td>
        <td><input type="text" placeholder="Khata No."></td>
        <td><input type="text" placeholder="Area"></td>`;
    table.appendChild(row);
}

document.getElementById('farmerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelectorAll('.id-card').forEach(card => card.style.display = 'block');

    let name = document.getElementById('name').value;
    let dob = document.getElementById('dob').value;
    let gender = document.getElementById('gender').value;
    let mobile = document.getElementById('mobile').value;
    let aadhaar = document.getElementById('aadhaar').value;
    let address = document.getElementById('address').value;

    document.getElementById('cardName').innerText = name;
    document.getElementById('cardDob').innerText = dob;
    document.getElementById('cardGender').innerText = gender;
    document.getElementById('cardMobile').innerText = mobile;
    document.getElementById('cardAadhaar').innerText = aadhaar;
    document.getElementById('cardAddress').innerText = address;

    let photo = document.getElementById('photo').files[0];
    if(photo) {
        let reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreview').src = e.target.result;
        }
        reader.readAsDataURL(photo);
    }

    let rows = document.querySelectorAll('#landTable tbody tr');
    let tableHTML = '<tr><th>District</th><th>Taluka</th><th>Village</th><th>Gat No.</th><th>Khata No.</th><th>Area</th></tr>';
    let allLandData = '';
    rows.forEach(row => {
        let cells = row.querySelectorAll('input');
        let rowData = [];
        cells.forEach(cell => rowData.push(cell.value));
        tableHTML += `<tr>${rowData.map(d => '<td>' + d + '</td>').join('')}</tr>`;
        allLandData += rowData.join(', ') + '\n';
    });
    document.getElementById('backLandTable').innerHTML = tableHTML;

    let data = `Name: ${name}\nDOB: ${dob}\nGender: ${gender}\nMobile: ${mobile}\nAadhaar: ${aadhaar}\nAddress: ${address}\nLand Details:\n${allLandData}`;
    document.getElementById('qrcode').innerHTML = '';
    qr = new QRCode(document.getElementById('qrcode'), {
        text: data,
        width: 100,
        height: 100
    });
});

function flipCard() {
    alert('Flip feature will require CSS 3D or separate container toggle.');
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.querySelector('.card-container');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save('FarmerID.pdf');
}

function printCard() {
    let content = document.querySelector('.card-container').innerHTML;
    let original = document.body.innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = original;
    location.reload();
}
