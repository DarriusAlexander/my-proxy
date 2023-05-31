// Require axios module
const axios = require('axios');

// Define API endpoints
const ethUrl = "https://api.etherscan.io/api?module=account&action=balance&address=${request.query.address}&tag=latest&apikey=${process.env.3BG8AYUPAAQKZDVIZVBGGVENB49D84NDMA}";
const rateUrl = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

// Make a GET request to the etherscan endpoint
axios.get(ethUrl)
  .then(response => {
    // Parse the response data
    const data = response.data;
    // Check if the request was successful
    if (data.status === '1') {
      // Make another GET request to the coingecko endpoint
      axios.get(rateUrl)
        .then(rateResponse => {
          // Parse the rate response data
          const rateData = rateResponse.data;
          // Get the ETH to USD exchange rate
          const rate = rateData.ethereum.usd;
          // Convert the balance from wei to ETH and multiply by the rate
          const balance = data.result / 1e18 * rate;
          // Return the balance as a JSON response
          response.status(200).json({
            balance: `${balance.toFixed(2)} USD`
          });
        })
        .catch(error => {
          // Log the error
          console.error(error);
        });
    } else {
      // Log the error message
      console.error(data.message);
    }
  })
  .catch(error => {
    // Log the error
    console.error(error);
  });
