import axios from "axios";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function QuickSearch() {
  let navigate = useNavigate(); //instance of it
  let [mealtypeList, setMealtypeList] = useState([]); //it always provide array

  let getMealtypes = async () => {
    try {
      let response = await axios.get("/api/get-meal-type");
      let data = response.data;
      if (data.status === true) {
        setMealtypeList([...data.result]); //recreating array by using spread oprator (...)
      } else {
        setMealtypeList([]);
      }
    } catch (error) {
      alert("server error");
      console.log(error);
    }
  };

  let getQuickSearchPage = (id) => {
    navigate("/search-page/" + id);
  };
  useEffect(() => {
    getMealtypes();
  }, []);

  return (
    <>
      <section className="container-lg second-section d-md-flex justify-content-md-center ">
        <div className="container-lg">
          <div className="row container-lg">
            <div className="col-12 quick-search-div">
              <p className="quick-search-head ">Quick Searches</p>
              <p className="quick-search-para pb-3">
                Discover restaurants by type of meal
              </p>
            </div>
          </div>
          {/* <!-- first row --> */}
          <div className="row d-flex menu-item-list justify-content-center ">
            {mealtypeList.map((mealType, index) => {
              return (
                <div
                  className="col-md-6 col-lg-4 col-10 cards mt-4"
                  key={index}
                  onClick={() => getQuickSearchPage(mealType.meal_type)}
                >
                  <img src={"/img/" + mealType.image} alt="" />
                  <div className="cards-body ">
                    <p className="cards-title">{mealType.name}</p>
                    <p className="cards-text">{mealType.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
export default QuickSearch;
