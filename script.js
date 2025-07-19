
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
