import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import api from "../../api";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  //useEffect will kick in when url changes
  useEffect(() => {
    if (url) {
      //now we can make separate network request to server to post the data
      api
        .post("/createpost", {
          title,
          body,
          pic: url,
        })
        .then(({data}) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Posted successfully",
              classes: "#43a047 green darken-1",
            });
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);
  //first we are posting our image and then we will be making separate network request to our node.js server
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "vivekc2wcloud");
    api
      .post("https://api.cloudinary.com/v1_1/vivekc2wcloud/image/upload", data)
      .then(({data}) => {
        setUrl(data.url); //here we are changing our URL
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className="card input-filed"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={() => postDetails()}
      >
        Add Post
      </button>
    </div>
  );
};

export default CreatePost;
