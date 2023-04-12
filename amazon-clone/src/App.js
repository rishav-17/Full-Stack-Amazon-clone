/*import React from "react";*/
import {useEffect} from "react";
import "./App.css";
import Payment from "./payment";
import Header from "./Header";
import Home from "./Home";
import Checkout from "./Checkout";
import Orders from "./Orders";
import Order from "./Order";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe(
  "pk_test_51MvLBNSHn0Sq0DI8rPTBBUAAKQjzBavCcUqyKiwAbB8v4DQXv1F9IXxPCi4G4UIakRUZUvqJipou6z2lhcKvsPJW00LnXnAK5s"
);

function App() {
  const [{user}, dispatch] = useStateValue();

  useEffect(() => {
  // will only run once when the app component loads...

  const unsuscribe = auth.onAuthStateChanged((authUser) => {
    console.log("THE USER IS >>> ", authUser);

    if (authUser) {
      // the user just logged in / the user was logged in

      dispatch({
        type: "SET_USER",
        user: authUser,
      })
    } else {
      // the user is logged out
      dispatch({
        type: "SET_USER",
        user: null,
      });
    }
  });
   
  return () => {
    //Any cleanup operations go in here....
    unsuscribe();
  };

}, []);

console.log("USER IS >>>> ",user);

  return (
    //BEMS
    <Router>
      
      <div className="app">
        <Routes>
          <Route path="/orders" element={[<Header />, <Orders />]} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={[<Header />,<Checkout />]}/>
          <Route path="/" element={[<Header />,<Home />]}/>        
          <Route path="/Payment" element={[<Header />, <Elements stripe={promise}> <Payment /> </Elements>]} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

