import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import api from "../../api";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [user, setUser] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    api.get("/mypost").then(({ data }) => {
      setPics(data.mypost);
    });

    api.get("/currentUser").then(({ data }) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "vivekc2wcloud");
      api
        .post(
          "https://api.cloudinary.com/v1_1/vivekc2wcloud/image/upload",
          data
        )
        .then(({ data }) => {
          api
            .put("/updatepic", {
              pic: data.url,
            })
            .then(({ data: result }) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={user?.pic || "noAvatar.jpg"}
            />
          </div>
          <div>
            <h4>{user ? user?.name : "loading"}</h4>
            <h5>{user ? user?.email : "loading"}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{mypics?.length} posts</h6>
              <h6>{user ? user?.followers?.length : "0"} followers</h6>
              <h6>{user ? user?.following?.length : "0"} following</h6>
            </div>
          </div>
        </div>

        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update Profile Pic</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics?.map((item) => {
          return [
            <img
              key={item?._id}
              className="item"
              src={item?.photo}
              alt={item?.title}
            />,
          ];
        })}
      </div>
    </div>
  );
};

export default Profile;
