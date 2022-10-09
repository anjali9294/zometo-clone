import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../Header";
function Wallpaper() {
  let [locationList, setLocationList] = useState([]);
  let [disabled, setDisabled] = useState(true);
  let getLocationId = async (event) => {
    let value = event.target.value;
    if (value !== "")
      try {
        let url =
          "http://localhost:5003/api/get-restaurant-by-location-id/" + value;
        let { data } = await axios.get(url);
        if (data.status === true) {
          if (data.result.length === 0) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        }
      } catch (error) {
        console.log(error);
        alert("server side error 1");
      }
  };

  let getLocationList = async () => {
    try {
      let response = await axios.get("http://localhost:5003/api/get-location");
      let data = response.data;
      if (data.status === true) {
        setLocationList([...data.result]);
      } else {
        setLocationList([]);
      }
    } catch (error) {
      console.log(error);
      alert("server side error");
    }
  };
  useEffect(() => {
    getLocationList();
  }, []);
  return (
    <>
      <section className="main-section">
        <Header color="" />

        <section>
          <div className="row mt-3 d-flex justify-content-center">
            <div className="col-12 brand-logo">
              <p className="brand-name">e!</p>
            </div>
          </div>
          <div className="row py-3 d-flex justify-content-center">
            <p className="col-lg-9  col-10  main-heading  text-white ">
              Find the best restaurants, cafés, and bars{" "}
            </p>
          </div>
          <div className="row d-lg-flex  justify-content-center">
            <div className="col-lg-3 col-10 ">
              <select
                className="form-select type-location pe-2 input-box"
                onChange={getLocationId}
              >
                <option value="">Please Select location</option>
                {locationList.map((location, index) => {
                  return (
                    <option value={location.location_id} key={index}>
                      {location.name}, {location.city}
                    </option>
                  );
                })}
              </select>
              <ul className="list-group">
                <li className="list-group-item">An item</li>
                <li className="list-group-item">A second item</li>
                <li className="list-group-item">A third item</li>
                <li className="list-group-item">A fourth item</li>
                <li className="list-group-item">And a fifth one</li>
              </ul>
            </div>
            <div className=" col-lg-4 col-10 ">
              <div className="input-group">
                <i className="fa fa-search text-black input-group-text pt-2"></i>
                <input
                  type="text"
                  className="form-control  search-restaurant input-box"
                  placeholder="Search for restaurants"
                  disabled={disabled}
                />
              </div>
              <ul className="list-group">
                <li className="list-group-item d-flex">
                  {" "}
                  <img src="./img/idli.png" alt="" className="search-image" />
                  <div className="ms-2">
                    <p className="search-heading m-0">The Big Chill Cakery</p>
                    <p className="search-para m-0">Sarjapur Road, Bengaluru</p>
                  </div>
                </li>
                <li className="list-group-item  d-flex">
                  {" "}
                  <img src="./img/idli.png" alt="" className="search-image" />
                  <div className="ms-2">
                    <p className="search-heading m-0">Punjabi Rasoi</p>
                    <p className="search-para m-0">Sarjapur Road, Bengaluru</p>
                  </div>
                </li>
                <li className="list-group-item  d-flex">
                  {" "}
                  <img src="./img/idli.png" alt="" className="search-image" />
                  <div className="ms-2">
                    <p className="search-heading m-0">Punjabi Rasoi</p>
                    <p className="search-para m-0">Sarjapur Road, Bengaluru</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
export default Wallpaper;
