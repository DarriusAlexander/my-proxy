// Require axios and etherscan API
const axios = require('axios');
const etherscan = require('etherscan-api').init('3BG8AYUPAAQKZDVIZVBGGVENB49D84NDMA');

// Define a function that takes a wallet address as a parameter and returns a promise with the ETH balance
function getEthBalance(address) {
  return etherscan.account.balance(address)
    .then(result => {
      // Convert the balance from wei to ether and return it
      return etherscan.utils.convertWeiToEther(result.result);
    })
    .catch(error => {
      // Handle any errors and return null
      console.error(error);
      return null;
    });
}

// Define a function that listens for a call with a wallet address and responds with the ETH balance
function listenForCall() {
  // Use axios to create a server instance
  const server = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000
  });

  // Use server.get to listen for requests on the /balance endpoint
  server.get('/balance', async (req, res) => {
    // Get the wallet address from the query parameters
    const address = req.query.address;

    // Validate the address format
    if (!etherscan.utils.isAddress(address)) {
      // If the address is invalid, send a 400 error response
      res.status(400).send('Invalid address format');
    } else {
      // If the address is valid, get the ETH balance using the getEthBalance function
      const balance = await getEthBalance(address);

      // Check if the balance is null
      if (balance === null) {
        // If the balance is null, send a 500 error response
        res.status(500).send('Could not get balance');
      } else {
        // If the balance is not null, send a 200 success response with the balance
        res.status(200).send(`The ETH balance of ${address} is ${balance}`);
      }
    }
  });
}

// Call the listenForCall function to start listening for calls
listenForCall();
