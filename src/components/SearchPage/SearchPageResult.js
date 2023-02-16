import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
function SearchPageResult() {
  let params = useParams();
  let navigate = useNavigate();
  let { meal_id } = params;
  let [RestaurantList, setRestaurantList] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [filter, setfilter] = useState({ meal_type: meal_id });

  let getLocationList = async () => {
    try {
      let response = await axios.get("/api/get-location");
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
  let filterOprations = async (filter) => {
    let url = "/api/filter";

    try {
      let { data } = await axios.post(url, filter);
      if (data.status === true) {
        setRestaurantList([...data.result]);
      }
    } catch (error) {
      alert("server error");
      console.log(error);
    }
  };
  let makeFiltration = (event, type) => {
    let value = event.target.value;
    let _filter = { ...filter };
    switch (type) {
      case "location":
        if (Number(value) > 0) {
          _filter["location"] = Number(value);
        }
        break;
      case "sort":
        _filter["sort"] = Number(value);
        break;
      case "cost-for-two":
        let costForTwo = value.split("-");
        _filter["lcost"] = Number(costForTwo[0]);
        _filter["hcost"] = Number(costForTwo[1]);

        break;
      case "Cuisine":
        _filter["cuisine"] = Number(value);

        break;
      case "page":
        console.log(value);
        _filter["page"] = Number(value);

        break;
      default:
        console.log("error");
    }
    setfilter({ ..._filter });
    filterOprations(_filter);
  };

  useEffect(() => {
    filterOprations(filter);
    getLocationList();
  }, [filter]);

  return (
    <>
      <section className="container">
        <div className="row">
          <div className="col-12 ">
            <div className="main-para-content">
              <p className="main-para">Breakfast Places in Mumbai</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-3 col-md-4">
            <div className="accordion mb-3" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button "
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Filter/Sort
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <div className="">
                      <p className="left-section-headings">Select Location</p>
                      <select
                        className="select-location form-select"
                        onChange={(event) => makeFiltration(event, "location")}
                      >
                        <option value="-1">Select Location</option>
                        {locationList.map((location, index) => {
                          return (
                            <option value={location.location_id} key={index}>
                              {location.name}, {location.city}
                            </option>
                          );
                        })}
                      </select>
                      <p className="left-section-headings">Cuisine</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={1}
                          id="flexCheckDefault"
                          onChange={(event) => makeFiltration(event, "Cuisine")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          North Indian
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={2}
                          id="flexCheckChecked"
                          onChange={(event) => makeFiltration(event, "Cuisine")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          South Indian
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={3}
                          id="flexCheckDefault"
                          onChange={(event) => makeFiltration(event, "Cuisine")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Chinese
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={4}
                          id="flexCheckChecked"
                          onChange={(event) => makeFiltration(event, "Cuisine")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          Fast Food
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexCheckDefault"
                          value={5}
                          onChange={(event) => makeFiltration(event, "Cuisine")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Street Food
                        </label>
                      </div>

                      <p className="left-section-headings">Cost For Two</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios1"
                          value="0-500"
                          onChange={(event) =>
                            makeFiltration(event, "cost-for-two")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios1"
                        >
                          Less than 500
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios2"
                          value="500-1000"
                          onChange={(event) =>
                            makeFiltration(event, "cost-for-two")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios2"
                        >
                          500 to 1000
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios1"
                          value="1000-1500"
                          onChange={(event) =>
                            makeFiltration(event, "cost-for-two")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios1"
                        >
                          1000 to 1500
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios1"
                          value="1500-2000"
                          onChange={(event) =>
                            makeFiltration(event, "cost-for-two")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios1"
                        >
                          1500 to 2000
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios2"
                          value="2000-99999"
                          onChange={(event) =>
                            makeFiltration(event, "cost-for-two")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios2"
                        >
                          2000+
                        </label>
                      </div>

                      <p className="left-section-headings">Sort</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios1"
                          id="exampleRadios2"
                          value="1"
                          onChange={(event) => makeFiltration(event, "sort")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios2"
                        >
                          Price low to high
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios1"
                          id="exampleRadios2"
                          value="-1"
                          onChange={(event) => makeFiltration(event, "sort")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios2"
                        >
                          Price high to low
                        </label>
                      </div>
                    </div>
                    <button className="btn btn-outline-danger mt-3">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" col-12 col-lg-8 col-md-8 me-lg-5 me-0  justify-content-end">
            {RestaurantList.map((restaurant, index) => {
              return (
                <div
                  className="card mb-3"
                  key={index}
                  onClick={() => {
                    navigate("/Restaurant/" + restaurant._id);
                  }}
                >
                  <div className="mx-lg-5 mx-3 my-3">
                    <div className="image-name d-flex ">
                      <div id="right-section-image">
                        <img src={"/img/" + restaurant.image} alt="" />
                      </div>
                      <div className=" ms-lg-4 ms-2">
                        <p className="shop-name card-title">
                          {restaurant.name}
                        </p>
                        <p className="place-type card-subtitle">
                          {restaurant.city}
                        </p>
                        <p className="place-address card-text mt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-geo-alt-fill me-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                          </svg>
                          {restaurant.locality}, {restaurant.city}
                        </p>
                      </div>
                    </div>

                    <hr />
                    <div className=" d-flex ">
                      <div className="cuisines-price-head me-5">
                        <p>CUISINES:</p>
                        <p>COST FOR TWO:</p>
                      </div>
                      <div className="cuisines-price-name">
                        <p>
                          {restaurant.cuisine.reduce(
                            (prevValue, CurrentValue) => {
                              return prevValue.name + ", " + CurrentValue.name;
                            }
                          )}
                        </p>
                        <p>{restaurant.min_price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* <!-- pagination elements --> */}
            <div className="pagination_section text-center mt-5">
              <button className="page-number m-1 p-2">❮</button>
              <button
                className="page-number m-1 p-2"
                value={1}
                onClick={(event) => makeFiltration(event, "page")}
              >
                1
              </button>
              <button
                className="page-number m-1 p-2"
                value={2}
                onClick={(event) => makeFiltration(event, "page")}
              >
                2
              </button>
              <button
                className="page-number m-1 p-2"
                value={3}
                onClick={(event) => makeFiltration(event, "page")}
              >
                3
              </button>
              <button
                className="page-number m-1 p-2"
                value={4}
                onClick={(event) => makeFiltration(event, "page")}
              >
                4
              </button>
              <button className="page-number m-1 p-2">❮</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default SearchPageResult;
