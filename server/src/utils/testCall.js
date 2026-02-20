import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

client.calls.create({
  to: "+917022544934", // your number
  from: "+12133701583", // your Twilio number
  url: "https://subepiglottic-nonrousing-elbert.ngrok-free.dev/api/voice/call"
})
.then(call => console.log("Call SID:", call.sid))
.catch(err => console.error(err));