const serverUrl = "http://localhost:5000";
async function loadAccounts() {
   try {
      const response = await fetch(`${serverUrl}/accounts`);
      const data = await response.json();

      if (data.success) {
         const select1 = document.getElementById("fromaccountSelect");
         const select2 = document.getElementById("toaccountSelect");
         select1.innerHTML = "";
         select2.innerHTML = "";

         data.accounts.forEach(account => {
            const option1 = document.createElement("option");
            option1.value = account;
            option1.textContent = account;
            select1.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = account;
            option2.textContent = account;
            select2.appendChild(option2);
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
   const toAccount = document.getElementById("toaccountSelect").value;

   const response = await fetch(`${serverUrl}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount, transactionId, details,toAccount })
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
