import React, { useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import M from "materialize-css";
import api from "../../api";
const SignIn = () => {
  const navigate = useNavigate();
  const [password, setPasword] = useState("");
  const { token } = useParams();
  const PostData = () => {
    api
      .post("/new-password", {
        password,
        token,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>

        <input
          type="password"
          placeholder="enter a new password"
          value={password}
          onChange={(e) => setPasword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Update password
        </button>
      </div>
    </div>
  );
};

export default SignIn;
