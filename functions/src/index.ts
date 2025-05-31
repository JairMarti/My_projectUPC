import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest((req, res) => {
  res.json({ message: "Hello from Firebase!", status: 200 });
});