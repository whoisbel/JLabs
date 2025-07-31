import axios from 'axios';

const loginPayload = {
  username: 'admin',
  password: '1234'
};

async function run() {
  try {
    // Step 1: Get public IP
    const ipRes = await axios.get('https://api.ipify.org?format=json');
    const ip = ipRes.data.ip;

    console.log('Your IP:', ip);

    // Step 2: Login and get token
    const loginRes = await axios.post('http://localhost:3000/api/login', loginPayload);
    const token = loginRes.data.token;

    console.log('Login successful. Token:', token);

    // Step 3: Send IP to /api/geo to get geolocation info
    const geoRes = await axios.post(
      'http://localhost:3000/api/geo',
      { ip },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Geo Info:', geoRes.data);
    process.exit();
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

run();
