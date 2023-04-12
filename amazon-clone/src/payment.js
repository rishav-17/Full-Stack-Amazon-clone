import React, { useState } from "react";
import"./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getBasketTotal } from "./reducer";
import CurrencyFormat from "react-currency-format";
import { useEffect } from "react";
import axios from "./axios";
import { useNavigate } from "react-router-dom";
import {db} from "./firebase"

function Payment(){
    const [{ basket, user }, dispatch] = useStateValue();

    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();
     const [succeeded, setSucceeded] = useState(false);
     const [processing, setProcessing] = useState("");
     const [error, setError] = useState(null);
     const [disabled, setDisabled] = useState(true);
     const [clientSecret, setClientSecret] = useState(true);

     useEffect(() => {
        //generate the special stripe stuff
    
        const getClientSecret = async () => {
          const response = await axios({
            method: "post",
            url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
          });
    
          setClientSecret(response.data.clientSecret);
        };
    
        getClientSecret();
      }, [basket]);
    
      console.log("THE CLIENT SECRET IS >>>", clientSecret);
      console.log("person", user)
    


     const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            //payment Intent = payment confirmation

            db
            .collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent.id)
            .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
            })


            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: "EMPTY_BASKET",
              });

            navigate("../orders", { replace: true });
         })

    
    }
     

    const handleChange = event =>{
    setDisabled(event.empty);
    setError(event.error ? error.error.message : "");

    }


    return (
        <div className="payment">
            <div className="payment__container">
            <h1>
             Checkout (<Link to="/checkout">{basket?.length} items</Link>)
            </h1>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Adress</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <form>
                            Home Address: <input className="input_txt" type="text" required />
                            <br/>
                            City Name: <input className="input_txt" type="text" required />
                            <br />
                        </form>
                    </div>
                </div>

                <div className="payment__section">
                <div className="payment__title">
                 <h3>Review items and Delivery</h3>
                </div>
                <div className="payment__items">
                {basket?.map((item, i) => (
                 <CheckoutProduct
                 key={i}
                 id={item.id}
                 title={item.title}
                 image={item.image}
                 price={item.price}
                 rating={item.rating}
                 />
                 ))}
                 </div>

                </div>

                <div className="payment__section">
                <div className="payment__title">
                 <h3>Payment Method</h3>
                </div>

                <div className="payment__details">
                <form onSubmit={handleSubmit}>
                    <CardElement onChange={handleChange}/>
                    <div className="payment__priceContainer">
                     <CurrencyFormat
                     renderText={(value) => (
                        <>
                         <h3>Order Total: {value}</h3>
                        </>
                     )}
                     decimalScale={2}
                     value={getBasketTotal(basket)}
                     displayType={"text"}
                     thousandSeparator={true}
                     prefix={"₹"}
                    />

                     <button type="submit" className="button__payments" disabled={processing || disabled || succeeded}>
                     <span type="submit">{processing ? <p>Proccesing...</p> : "Buy Now"}</span>
                     </button>

                    </div>
                    
                </form>
                {error && <div>{error}</div>}
                </div>
                </div>

            </div>


        </div>
    )
}

export default Payment;