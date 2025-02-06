const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const os = require("os");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend requests

const API_KEY = "ptla_aSTJlHfPia5QMubiIsQ3kRqAHAV36X2msA7c7ZjcmgV";
const PTERO_URL = "https://panel.icehosting.cloud/api/application/users";

// Function to get public IP
async function getPublicIP() {
    try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        return response.data.ip;
    } catch (error) {
        console.error("Error fetching public IP:", error);
        return "Unknown IP";
    }
}

// Function to get local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const info of iface) {
            if (info.family === "IPv4" && !info.internal) {
                return info.address;
            }
        }
    }
    return "Unknown IP";
}

// Promo codes route
app.get("/promo", (req, res) => {
    const promoCodes = {
        "5entur3d": "25%",
        "atlantic$": "15%",
        "system3m4k": "30%",
        "Rawcode": "65%",
        "OPERATOR.in": "10%",
        "J3llySlime": "20%",
        "itar.d3v": "50%",
        "blazecore": "15%",
        "SpunkzyOMG": "25%"
    };
    res.json(promoCodes);
});


// Create User API Route
app.post("/create-user", async (req, res) => {
    try {
        // Get the public IP asynchronously
        const publicIP = await getPublicIP();
        const localIP = getLocalIP();

        const response = await fetch(PTERO_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json({ 
            user: data,
            local_ip: localIP,
            public_ip: publicIP
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, async () => {
    const publicIP = await getPublicIP();
    console.log(`Backend running on local IP: ${getLocalIP()}, public IP: ${publicIP}, port: ${PORT}`);
});

// Middleware to log user IP and username
app.use((req, res, next) => {
    const userIP = req.ip || req.connection.remoteAddress;
    const { username } = req.body || {}; // Assuming username is sent in JSON body
    console.log(`Request from IP: ${userIP}, Username: ${username || 'Unknown'}`);
    next();
});
