// Import axios
const axios = require("axios");

// Create an axios instance with the base URL of etherscan API
const etherscan = axios.create({
  baseURL: "https://api.etherscan.io/api",
});

// Export a default function that takes req and res as parameters
export default async function handler(req, res) {
  try {
    // Get the wallet address from the req.query parameter
    const address = req.query.address;

    // Use axios to make a GET request to the etherscan API with the wallet address and your API key
    const response = await etherscan.get("", {
      params: {
        module: "account",
        action: "balance",
        address: address,
        tag: "latest",
        apikey: "3BG8AYUPAAQKZDVIZVBGGVENB49D84NDMA", // replace with your own API key
      },
    });

    // Parse the response data as JSON and get the balance property
    const data = response.data;
    const balance = data.result;

    // Convert the balance from wei to ether using web3.fromWei or a custom function
    // For example, using web3.fromWei:
    // const web3 = require("web3");
    // const ether = web3.fromWei(balance, "ether");
    // Or using a custom function:
    const ether = weiToEther(balance);

    // Send the balance as a response with res.json
    res.json({ balance: ether });
  } catch (error) {
    // Handle any errors and send an appropriate response
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// A custom function to convert wei to ether
function weiToEther(wei) {
  // One ether is 10^18 wei
  const divisor = 10 ** 18;
  // Convert wei to a number and divide by divisor
  const ether = Number(wei) / divisor;
  // Return ether as a string
  return ether.toString();
}
