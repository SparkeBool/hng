const express = require('express');
const requestIp = require('request-ip');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const ipAddress = requestIp.getClientIp(req).split(":").pop();

    try {
        // Fetch geolocation data
        
        const location = "Lagos";

        // Fetch weather data
        const weatherData = await getWeatherData(location);

        // Prepare response
        const greeting = `Hello, ${visitorName}! The temperature is ${weatherData.temperature} degrees Celsius in ${location}.`;
        const data = {
            client_ip: ipAddress,
            location,
            greeting
        };
        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to fetch weather data from OpenWeatherMap API
async function getWeatherData(city) {
    try {
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const response = await axios.get(apiUrl);
        const temperature = response.data.main.temp;
        return { temperature };
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error;
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});