import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
function RestaurentPage() {
  let [tab, setTab] = useState(1);
  let { id } = useParams();
  let defaultValue = {
    _id: -1,
    name: "",
    city: "",
    location_id: -1,
    city_id: -1,
    locality: "",
    thumb: [],
    aggregate_rating: 0,
    rating_text: "",
    min_price: 0,
    contact_number: 0,
    cuisine_id: [],
    cuisine: [],
    image: "search-item.png",
    mealtype_id: -1,
  };

  let [restaurant, setRestaurant] = useState({ ...defaultValue });
  let [menuItems, setMenuItems] = useState([]);
  let [totalPrice, setTotalPrice] = useState(0);
  let getTokenDetails = () => {
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };
  let [userDetails, setUserDetails] = useState(getTokenDetails());

  let getRestaurantDetails = async () => {
    try {
      let URL =
        "https://zometo-api.onrender.com/api/get-restaurant-detail-by-id/" + id;
      let { data } = await axios.get(URL);

      if (data.status === true) {
        setRestaurant({ ...data.result });
      } else {
        setRestaurant({ ...defaultValue });
      }
    } catch (error) {
      console.log(error);
    }
  };
  let getMenuItems = async () => {
    let Url =
      "https://zometo-api.onrender.com/api/get-menu-item-list-by-restaurant-id/" +
      id;
    let { data } = await axios.get(Url);
    if (data.status === true) {
      setMenuItems([...data.result]);
    } else {
      setMenuItems([]);
    }
  };
  let addItemQuantity = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty += 1;

    let _price = Number(menuItems[index].price);
    setTotalPrice(totalPrice + _price); //updating total price state
    setMenuItems(_menuItems); //updating menu item state
  };
  let removeItemQuantity = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty -= 1;

    let _price = Number(menuItems[index].price);
    setTotalPrice(totalPrice - _price); //updating total price state
    setMenuItems(_menuItems); //updating menu item state
  };

  async function loadScript(src) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);
  }

  let dispalyRazorpay = async () => {
    let isLoaded = await loadScript();
    if (isLoaded === false) {
      alert("sdk is not loaded");
      return false;
    }
    var serverData = {
      amount: totalPrice,
    };
    var { data } = await axios.post(
      "https://zometo-api.onrender.com/api/payment/gen-order",
      serverData
    );
    var order = data.order;
    console.log(order);
    var options = {
      key: "rzp_test_cML0MmeKla2OLq", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zometo Clone Payment",
      description: "Buying product from zometo",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATAAAACmCAMAAABqbSMrAAABAlBMVEX/////M0H/NEP8//////7/8/j0Ul3/LUD/IDr0cXb7ys/8HTX//f//M0D///z9//v/Kzz+IDD5IDL/6ev70df/Kzr/Mkf/LUP7N0T2fn//Jjb94Ob/Jj73P0z+9/b/8fLzHzL9qbD3hI3yXmXzdH38kKH8tL7+/vL9xcrxOU/zHCvyZXD6paf73Njyj4f0WGT0saz0QUL5u7n8KU/tLkL7o7L95u30SF3wiZL0n5v1Tl/zgpP0qar81M/wUWb0t8D2YGL1RU/xgXb/FSj3iYj6xsL0QF/1maD2d3P55dz7lZfuQVD8p6TpgofsOkH0bnrylaT/ZHv/xMb4yNX2W3r0dIbeOcnxAAAJyklEQVR4nO2dj1ebOhuAQ4JCC4EADVSKFGtXrW3trnNandV51c/Z7s79+Pb//ytfEnTTXbd9zLY59OQ5Zx5GU855nxOSQHlfAFAoFAqFQqFQKBQKhUKhUCgUCoVCofgBm/1DYgvNAn4s5Oi63KDmTFDdaFU2h6vPZ9hrv+jUUtkBzQ3WG7a2X3R3PCsmBiHGMyGc2M+yXn/ADm4j2fHNnsEu9inmaHBWaBok1Bq+3ELLJUxHYNDOyMw8PTTGnBlxt78lO8aZgtJWQn+Mc5Zg76892UHOkrNXFNfnKYz1Mq/SBK4rO9LZ0LKMJ86kGRvT6H4VLcEKA6HmqYfx/XAzL18cnLwWK71Sg9DBIWHz4kIIrYnseJ9PMPW1RQmD2BuBcq8vUHNKxMprMcLgq+RIdsjPw+5RqC1IFzcWajtnsmN+FqNkXiP8z8Bao8QnZZXObUr8KfTYkR32H+KAdKotXhj2rmVH/mc4DthN5rfo+oWx7EB27H+Egw6iSIow2pYd+x/yxgilCNOSgezQ/4igPs/roF8Jo2ugfPetbXSUzPNi+5fKjMAp3VSJ7GkkS5gWn8gOvzho7M31ds4vIaul62AA9GNNmjCMm7LDL84p0b7d/1r4wB+X74qyuY9lChvJjr8wNU+mMPxWdvyFOZMqTFsv3b3q13Thkh4AjRXZAorSMqQKMw/K9gtSRa4wqyZbQFEqxuIHrofCqrIFFEW6sLLdqFbCCqKEFUQJK4hcYZoSpoQpYY9RwgqihBVECSuIElYQJawgSlhBlLCCKGEFUcIKooQVRAkriBJWECWsIHMVhokSVgQjmZ7/5lc8JeyBi/rfNXT+mz6mhN2DsyueAlD/TT7OUgrjT6l8y9v6nsGFNf7N8HsrjEUJAdEAGre8hECT3KXI5Zlf/37apfTCDPoAMf5g4vm+b4pmkAsxCX/G3ve9CDJlxPN8cdoZ8U72tlKpvM0S1pRe9PnRaxdxzL4JjcTy/8oy718naMmFQTzcvVy7Z7LJ+kfcvbwaDMb9/5hYw2Gv0r7ee2eQcHfcqLUTGJn/1BqNNYO1W39RE0/i6I1RohmtjRvdBiB4edY5NDRitK6CNL3ZG5pwuYTFj3L+JxT713fPIzkTC9NzmxeGubYOeUaCvnUartf4DntI6FFuS5Ry6Cf+GDj3T+VMcbw64Pmkuq67E3+5hHljHlYOAKM4OQO6y590Zn+vKZ6m3M9k2gQOQiz6MODJzwC8j+MjlD9yj3QHOcd+A+gOP4gDgsjvrSBHZx8w3BZZJmHaTiCEschYqM6m12Fxsw3R0lknxzr3888A5LtGVVF5RgcnlJy7IKh2Xndc/rzXKEsd2+G6AGhk60wzt8mO6egrj+fNkgvDH75/4IBd/1aktoxHY7Hn2hvy08z5AtL8PK2hu40TqiXv26FlWp54yrdPXtZYDwPOXufsjV9lqpDT+biF+Gm6RpdJWPhpOBweCz/uKMkGPMSbMDoUTb94Iv3MQVf0Y57jXgsrvGAWaFEILT6Z+t6pbevgOrE+ctdB4sXJELgu64QXXp+Pa+h9vETC2HKBUIvnszjg2o+GjssGsDWiJQFv2siXCijYt16LokPBh7glKowNiRZ3R2w2HYzHwGYCDfOMC6uZbCXyErku2PqASU8Iu/KWSRhbWiYbfK5z+1FIPgKXjWbrGGdC2OBiW3zlltI8H+GNEb/mvpw6MfrpffEOJqyHswYX9jmGMGu4TNg4hviUJ7OCq6XqYWyezBOLT7IwpHtMmN6MMDZEhsv4osbPxBtC/BoPs5mF+ROXATGuEHKdoFods9Fetw9x1uTCNpiwepN30xML4lvWhJ2byyXsrmbJXhSFYfyZd4lmgvG52PlxR3jbY51FbHz2oNngG1VmGaF0LWN80W2Uhnidz7ZgxMa2esonWiaM9Ll/8HWZBn3IxiQ+EZ5lmWlZubDUoHe9bji1eTnDI2p0+X/RiQfzrte3Ar6e9dnlZHeFXUEGFh4KYcMYGvWUH2Uv5vm37Nx09pdHGJvp2lyX7nY2Op29vVdsWmOLqZ41FVXSGjuf8m8QI9+4jI08kWMtTNn3PrELKbMDbBvUYtIGvEjkqffh3U7AehibKMyJw3oY6CTLsw6Dya3YhVxRGrNpDl0+EKXVVJT7+m884uO6s2qQlmjXo2QoVhXTiJeE3K4TfJJ3UMpacGHBWN+7YPvYWB/UttglgN5cf5ygU3Jh4gS7Lya6nUVjR1zPiIueazPu8I/TukY3RLsuJZe8hGlqiPQElA6aqMkbXxMuLD/+JDlkC1Z+BL6SRe348S2eUgvjUxsQF9DiLwu7G7Bhh10Asi53ZPILTcYBhb6YG1dCLJZsYGCRr2xs40uzq77OGk8M7fj++L0kYv2RL0/YcdOvPlwmYfWVtNkMcpp2m2Kjm6+8QK1nwtAfB0Ej+LwDo/EBo+pjetJoNIK+CZM37CLUGbzxP7MjpC0CI7HGBcFGGEXJrZhLgb19Hv+YMlduYZAtC/wctgVFoa/1y6Ojy3OP8rulESEkiXhVPt+3rITPqpbnWbxwj5GtT/dNqtXZFyNeBiM5brUuVy2TZ+ATf3PCjrLu0/wu7bII0x4VxLrbxoRScdv5W9+AT6Phb1vir0Eo+b4LWzF9qj5ZyYX9jFkUwcXaUxXdlLCf8/AHlGUXNj+UMCVMCXuMElYQJawgSlhBlLCCKGEFUcIKooQVRAkriBJWECWsIEpYQZSwgihhBakQJawQlUSyMNkCilL5bTrQfIWVrkJdmyzu3SlPCRuU7ZScxDKF4exGtoCiPH6+beHCwq2yFXIdWzIHfbLqlq3eeRD+Pqy5AekaKJswZypxmoT0ZemEgZHMQcwMQMkKBf/43PxiIeel618Apevy1hXxpGyrMAbalVbvHPuNspXuZqCBL6mLQdor2yIs51ZWF0u2+UPq5eNLUpfiixyX9O3V6J2Um4jYK929sHsCGT0Me2V9+R9jw1t8F6P7QflW+d/YXPxJ6W0jp3xrinua3cXOlBB7L3j2ZGm7GKpli3yZCgzjd45eZmE62l7g8hVq3qYD8loPZcUG28aijMHQ3GzytxmX722c33FcUNtf0O8h2L/l+ZXlFsZvSwWHMU/ImruvbOLyVMGSC+Pj2FbLpHiut6whhHF9W6Toll8YZzw1wzl2MQgjv5XKDnKGOEjvdC0yn9cmwgjTpFfOV3v/HATSk3OP4tk7w8TL2uMyr+6fxGbK3MFkasXEMJ6d8XeX94cJjS3S6zQB4kWyZMc4D9yb7VGvu2+Ys6AeHrffj3kCfilvF/5fiOJNwF6ZDbY4os2RHFe5UMIUCoVCoVAoFAqFQqFQKBQKhaKc/A8T5f+pZQJKGQAAAABJRU5ErkJggg==",
      order_id: order.id, //This is a sample Order ID.generated in server side
      handler: async function (response) {
        var sendData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };

        var { data } = await axios.post(
          "https://zometo-api.onrender.com/api/payment/verify",
          sendData
        );
        if (data.status === true) {
          Swal.fire({
            icon: "success",
            title: "Payment succesfully Done",
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Payment failed Retry again!",
          }).then(() => {
            window.location.reload();
          });
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  useEffect(() => {
    getRestaurantDetails();
  }, []);
  return (
    <>
      <Header color="heading" />

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="staticBackdrop"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <Carousel showThumbs={false} infiniteLoop={true}>
                {restaurant.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/img/" + value} alt="" srcset="" />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body py-0 ">
              {menuItems.map((menu_item, index) => {
                return (
                  <div className="row  m-0 mt-3 " key={index}>
                    <div className="col-9 p-0 ">
                      <i className="fa-solid fa-leaf mb-0"></i>
                      <p className="mb-0 h6">{menu_item.name}</p>
                      <p className="mb-0">@{menu_item.price}</p>
                      <p className="small text-muted">
                        {menu_item.description}
                      </p>
                    </div>
                    <div className="col-3 justify-content-end">
                      <div className="menu-food-item position-relative">
                        <img src={"/img/" + menu_item.image} alt="" />
                        {menu_item.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addItemQuantity(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section">
                            <span
                              className="hand"
                              onClick={() => removeItemQuantity(index)}
                            >
                              -
                            </span>
                            <span>{menu_item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addItemQuantity(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
            {totalPrice > 0 ? (
              <div className="modal-footer d-flex justify-content-between">
                <p className="h4">Subtotal {totalPrice}</p>
                <button
                  className="btn btn-danger"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Pay Now
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                Modal 2
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Name
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={userDetails.name}
                  readOnly={true}
                  onChange={() => {}}
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Mobile Number
                </label>
                <input
                  type="cal"
                  className="form-control"
                  value={userDetails.email}
                  readOnly={true}
                  onChange={() => {}}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Address
                </label>
                <textarea
                  className="form-control"
                  value={""}
                  onChange={() => {}}
                  rows="3"
                  placeholder="Enter your adress"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                className="btn btn-danger"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                Back Back
              </button>
              <button className="btn btn-success" onClick={dispalyRazorpay}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="row justify-content-center">
          <div className="col-10 mt-lg-5 mt-1 restaurant-menuitem-image position-relative">
            <img src={"/img/" + restaurant.image} alt="" />
            <button
              className="btn btn-light d-lg-flex d-none"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Click to see Image Gallery
            </button>
          </div>
          <div className="col-10">
            <p className="main-para">{restaurant.name}</p>

            <div className="restaurant-menu-details  mb-2">
              <div className="restaurant-left-menu d-flex justify-content-between align-items-start">
                <ul className="list-unstyled d-flex gap-3 fw-bold">
                  <li className="pb-2 hand" onClick={() => setTab(1)}>
                    Overview
                  </li>
                  <li className="pb-2 hand" onClick={() => setTab(2)}>
                    Contact
                  </li>
                </ul>

                {userDetails ? (
                  <button
                    className="btn"
                    onClick={getMenuItems}
                    data-bs-toggle="modal"
                    href="#exampleModalToggle"
                  >
                    Place Online Order
                  </button>
                ) : (
                  <button className="btn" disabled={true}>
                    please Login to Place Order
                  </button>
                )}
              </div>
              <hr />
              {tab === 1 ? (
                <div className="restaurant-overview">
                  <p className="restaurant-overview-heading">
                    About this place
                  </p>

                  <p className=" restaurant-overview-subtitle m-0">Cuisine</p>
                  <p className="text-muted">
                    {restaurant.cuisine.length > 0
                      ? restaurant.cuisine.reduce((prevValue, CurrentValue) => {
                          return prevValue.name + ", " + CurrentValue.name;
                        })
                      : null}
                  </p>

                  <p className=" restaurant-overview-subtitle m-0">
                    Average Cost
                  </p>
                  <p className="text-muted">
                    ₹{restaurant.min_price} for two people (approx.)
                  </p>
                </div>
              ) : (
                <div className="restaurant-overview contact">
                  <p className="restaurant-overview-heading">
                    About this place
                  </p>

                  <p className=" restaurant-overview-subtitle m-0">
                    Phone Number
                  </p>
                  <p className="text-danger">+{restaurant.contact_number}</p>

                  <p className=" restaurant-overview-subtitle m-0">
                    {restaurant.name}
                  </p>
                  <p className="text-muted">
                    {restaurant.locality}, {restaurant.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RestaurentPage;
