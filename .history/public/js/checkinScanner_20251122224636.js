// public/js/checkinScanner.js

document.addEventListener("DOMContentLoaded", () => {

  const resultBox = document.getElementById("result");

  function onScanSuccess(decodedText) {
    let parsed;

    try {
      parsed = JSON.parse(decodedText);   // QR contains JSON
    } catch (err) {
      resultBox.innerHTML = `<span class="text-red-600">Invalid QR Format</span>`;
      return;
    }

    // Send uniqueId to backend to verify & mark attendance
    fetch("/checkin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId: parsed.uniqueId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          resultBox.innerHTML = `
            <span class="text-green-600 font-bold">
              ✔️ Checked-in: ${parsed.name} (USN: ${parsed.usn})
            </span>
          `;
        } else {
          resultBox.innerHTML = `
            <span class="text-red-600 font-bold">
              ❌ Invalid QR or User Not Found
            </span>
          `;
        }
      })
      .catch(err => {
        resultBox.innerHTML = `<span class="text-red-600">Server Error</span>`;
      });
  }

  // Initialize the QR scanner
  const scanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: { width: 250, height: 250 }
  });

  scanner.render(onScanSuccess);
});
