import express, { application } from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import 'dotenv/config'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const payload = client_id + ":" + client_secret;
const encodedPayload = Buffer.from(payload).toString("base64");

const options = {
  method: "POST",
  body: "grant_type=client_credentials",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Basic" + " " + encodedPayload
  },
  json: true
};


app.get('/', cors(), async (req, res) => {
    const data = await getToken();
    res.json(data);
})


async function getToken(){
  const res = await fetch("https://accounts.spotify.com/api/token", options)
  const data = await res.json()
  return data;
}

app.listen(8000)