const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
    'sk_test_51MvLBNSHn0Sq0DI8E3wBJyRskCcd9cTCQAI5qfLpriMbRpWuHoNLmyevnIEK2hwBXZ095kTXqXVTQTzK2NYnif7a00vAa3KZsJ'
  );

  //-App config
  const app = express();
  
  //-Middleware;
  app.use(cors({ origin: true }));
  app.use(express.json());

  //Router
  app.get("/", (req, res) => res.status(200).send("hello World"));
  app.get("/user", (req, res) => res.status(200).send("What's up User!"));

  app.post("/payments/create", async (req, res) => {
    const total = req.query.total;
    console.log(`Request payment amount >>> ${total}`);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "inr",
      });

      res.status(201).send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    
  





  //Listen
  exports.api = functions.https.onRequest(app);
  
  //Example
  // http://127.0.0.1:5001/challange-de07c/us-central1/api
