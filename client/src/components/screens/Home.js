import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import "../../App.css";
import api from "../../api";

const Home = () => {
  const [data, setData] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const { state } = useContext(UserContext);
  useEffect(() => {
    api.get("/allpost").then(({ data }) => {
      setData(data.posts);
    });
  }, []);

  const likePost = (id) => {
    api
      .put("/like", {
        postId: id,
      })
      .then(({ data: result }) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    api
      .put("/unlike", {
        postId: id,
      })
      .then(({ data: result }) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    api
      .put("/comment", {
        postId,
        text,
      })
      .then(({ data: result }) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const deletePost = (postid) => {
    api.delete(`/deletepost/${postid}`).then(({ data: result }) => {
      const newData = data.filter((item) => {
        return item._id !== result._id;
      });
      setData(newData);
    });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <div className="user-profile">
              <img
                className="user-profile-pic"
                src={item?.postedBy?.pic || "noAvatar.jpg"}
                alt="Profile Pic"
              />
              <h5 style={{ padding: "5px" }}>
                <Link
                  to={
                    item?.postedBy?._id !== state?._id
                      ? "/profile/" + item?.postedBy?._id
                      : "/profile"
                  }
                >
                  {item?.postedBy?.name}
                </Link>{" "}
                {item?.postedBy?._id == state?._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                    }}
                    onClick={() => deletePost(item?._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
            </div>

            <div className="card-image">
              <img src={item?.photo} />
            </div>
            <div className="card-content">
              <div className="likes-container">
                <i
                  onClick={() => {
                    item?.likes?.includes(state?._id)
                      ? unlikePost(item?._id)
                      : likePost(item?._id);
                  }}
                  className="material-icons"
                  style={{ color: "red" }}
                  title={item?.likes?.includes(state?._id) ? "unlike" : "like"}
                >
                  {item?.likes?.includes(state?._id)
                    ? "favorite"
                    : "favorite_border"}
                </i>
                <i
                  className="material-icons"
                  onClick={toggleComments}
                  title="comments"
                >
                  chat_bubble_outline
                </i>
              </div>
              <h6>{item?.likes?.length} likes</h6>
              <h6 style={{ fontWeight: "bold" }}>{item?.title}</h6>
              <p>{item?.body}</p>
              {showComments && (
                <div className="comments">
                  {item?.comments?.map((record) => {
                    return (
                      <h6 key={record?._id}>
                        <span style={{ fontWeight: "500" }}>
                          {record?.postedBy?.name}
                        </span>{" "}
                        {record?.text}
                      </h6>
                    );
                  })}
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item?._id);
                }}
              >
                <input type="text" placeholder="Add a comment..."></input>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
