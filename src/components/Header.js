import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

function Header(props) {
  let navigate = useNavigate();

  let getTokenDetails = () => {
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };

  let [userLogin, setUserLogin] = useState(getTokenDetails());

  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;
    localStorage.setItem("auth-token", token);
    Swal.fire({
      icon: "success",
      title: "Login Successfully",
    }).then(() => {
      window.location.reload();
    });
  };

  let onError = () => {
    Swal.fire({
      icon: "error",
      title: "Oops.. ",
      text: "Login Fail Try Again!",
    }).then(() => {
      window.location.reload();
    });
  };

  let logout = () => {
    Swal.fire({
      title: "Are you sure to Logout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout me!",
    }).then((result) => {
      if (result.isConfirmed) {
        // remove data from localstrorage
        // removeItem
        localStorage.removeItem("auth-token");
        window.location.reload();
      }
    });
  };
  return (
    <>
      <GoogleOAuthProvider clientId="991160019372-is178aik991krb86mu9i315kv7loushh.apps.googleusercontent.com">
        <div
          className="modal fade"
          id="google-sign-in"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Google Sign In
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <GoogleLogin onSuccess={onSuccess} onError={onError} />
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
      <header className={"row justify-content-center " + props.color}>
        <div className="col-10 d-flex justify-content-between py-2">
          <div className="filter-menu-brand-logo">
            <p
              className="filter-menu-logo-name hand"
              onClick={() => navigate("/")}
            >
              e!
            </p>
          </div>
          {userLogin ? (
            <div className=" d-lg-flex">
              <span className="text-white fs-5 me-3 fw-bold mt-2">
                Welcome, {userLogin.given_name}
              </span>
              <button
                className="btn btn-outline-light border border-1"
                onClick={logout}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className=" d-lg-flex">
              <button
                className="btn text-white"
                data-bs-toggle="modal"
                data-bs-target="#google-sign-in"
              >
                Login
              </button>
              <button className="btn btn-outline-light border border-1">
                Create an account
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
export default Header;
