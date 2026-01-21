if (!localStorage.getItem("loggedIn")) {
  localStorage.setItem("loggedIn", "no");
}

function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const msg = document.getElementById("signupMsg");

  if (!email || password.length < 6) {
    msg.textContent = "Enter valid email & password";
    msg.style.color = "red";
    return;
  }

  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);
  msg.textContent = "Signup successful";
  msg.style.color = "green";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMsg");

  if (
    email === localStorage.getItem("userEmail") &&
    password === localStorage.getItem("userPassword")
  ) {
    localStorage.setItem("loggedIn", "yes");
    msg.textContent = "Logged in successfully";
    msg.style.color = "green";
  } else {
    msg.textContent = "Wrong email or password";
    msg.style.color = "red";
  }
}

async function buy(subject) {
  if (localStorage.getItem("loggedIn") !== "yes") {
    alert("Please login first");
    return;
  }

  const response = await fetch(
    "https://YOUR-BACKEND-NAME.onrender.com/create-order",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2000 })
    }
  );

  const order = await response.json();

  var options = {
    key: "rzp_live_YOUR_KEY_ID",
    amount: order.amount,
    currency: "INR",
    name: "StudyNotes",
    description: subject + " Notes",
    order_id: order.id,
    handler: function (response) {
      alert("Payment successful: " + response.razorpay_payment_id);
    }
  };

  var rzp = new Razorpay(options);
  rzp.open();
}
