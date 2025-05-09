const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const os = require("os");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "ptla_S3ND6wQ9REMJj1eymksB90ylT61xiX3xaGaA989bUct";
const PTERO_URL = "https://panel.icehosting.cloud/api/application/users";
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1348428415425839195/SFI16DBq1FXCkulUg_L_Xi5VWPwY4uQfqRTYVZJLlEbgmxQPRCx1SkpcpnG1myMFHmxW";

async function getPublicIP() {
    try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        return response.data.ip;
    } catch (error) {
        console.error("Error fetching public IP:", error);
        return "Unknown IP";
    }
}

// get local ip for debugging
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

app.post("/sendPurchase", async (req, res) => {
    try {
        const data = req.body;
        const discordEmbed = {
            content: null,
            embeds: [
                {
                    title: "Purchase Log Detected",
                    description: `A new user has signed up for IceHosting\n\n**Discord username:** ${data.discord}\n**Their plan details:**\n  **RAM:** ${data.ram}GB\n  **Processor:** ${data.processor}\n  **First Name:** ${data.firstName}\n  **Last Name:** ${data.lastName}\n**Platform**: ${data.platform}\n**Email:** ${data.email}\n**Hosting Type:** ${data.htype}\n**Storage Amount:** ${data.storage}\n**Storage Type:** ${data.storage_type}\n **Discord bot programming language:** ${data.bot_programming_lang}\n Promocode: ${data.promocode}`,
                    color: 1753560,
                    author: { name: "IceHosting Signup System" }
                }
            ]
        };

        await axios.post(DISCORD_WEBHOOK_URL, discordEmbed);
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error("Error sending to Discord:", error);
        res.status(500).json({ error: "Failed to send webhook" });
    }
});

// promocodes route
app.get("/promo", (req, res) => {
    const promoCodes = {
        "atlantic$": "15",
        "system3m4k": "30",
        "Rawcode": "65",
        "OPERATOR.in": "10",
        "J3llySlime": "20",
        "itar.d3v": "50",
        "blazecore": "15",
        "SpunkzyOMG": "25",
        "EchoSMP": "30",
        "SwiftSMP": "5",
        "PerkSMP": "15",
        "SpeedSMP": "15",
        "CatalystSMP": "15",
        "MoralitySMP25": "25"
    };
    res.json(promoCodes);
});

// create account using ptero app api
app.post("/create-user", async (req, res) => {
    try {
        // anti-exploitation
        if (req.body.root_admin === true) {
            return res.status(403).json({ error: "Root_admin forbidden" });
        }

        // get public ip
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


// start node.js backend
const PORT = 3000;
app.listen(PORT, async () => {
    const publicIP = await getPublicIP();
    console.log(`Backend running on local IP: ${getLocalIP()}, public IP: ${publicIP}, port: ${PORT}`);
});
