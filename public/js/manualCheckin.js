const form = document.getElementById("manualCheckinForm");
const msg = document.getElementById("manualMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    seat: document.getElementById("seat").value.trim(),
    email: document.getElementById("email").value.trim()
  };

  const res = await fetch("/checkin/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  msg.textContent = data.message;
  msg.style.color = data.success ? "green" : "red";

  if (data.success) {
    setTimeout(() => window.location.reload(), 1200);
  }
});
