const serverUrl = "http://localhost:5000";
async function loadAccounts() {
   try {
      const response = await fetch(`${serverUrl}/accounts`);
      const data = await response.json();

      if (data.success) {
         const select = document.getElementById("fromaccountSelect");
         select.innerHTML = "";

         data.accounts.forEach(account => {
            const option = document.createElement("option");
            option.value = account;
            option.textContent = account;
            select.appendChild(option);
         });
      } else {
         console.error("Failed to fetch accounts:", data.error);
      }
   } catch (error) {
      console.error("Error fetching accounts:", error);
   }
}

// Call loadAccounts when page loads
window.onload = loadAccounts;

// Function to transfer funds
async function transferFunds() {
   const id = document.getElementById("id").value;
   const amount = document.getElementById("amount").value;
   const transactionId = document.getElementById("transactionId").value;
   const details = document.getElementById("details").value;
   const fromAccount = document.getElementById("fromaccountSelect").value;

   const response = await fetch(`${serverUrl}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount, transactionId, details,fromAccount})
   });

   const data = await response.json();
   alert(data.message);
}

// Function to get transaction details
async function getTransaction() {
   const searchId = document.getElementById("searchId").value;

   const response = await fetch(`${serverUrl}/transaction/${searchId}`);
   const data = await response.json();

   document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}
