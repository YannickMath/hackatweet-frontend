import styles from "../styles/Welcome.module.css";
import { useRouter } from "next/router";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiFillBackward } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { BsLightningFill } from "react-icons/bs";
import { useState } from "react";
import { logout } from "@/reducers/user.slice";
import { useEffect } from "react";
import React from "react";
import Tweet from "../components/Tweet";
import UploadImage from "./UploadImage";
import ScrollToTopButton from "./ScrollToTopButton";

// import '../styles/fonts.css';

export default function Welcome() {
  // Router hook
  const router = useRouter();

  // Dispatch hook
  const dispatch = useDispatch();

  // Selectors to access the user and tweet values from the store
  const userRed = useSelector((state) => state.user.value);

  // State for tweet and count
  //Etat pour compter le nombre de hashtag
  const [count, setCount] = useState(0);
  const [hashtagCopy, setHashtagCopy] = useState([]);

  //Etat pour charger tous les hashtags au chargement de la page
  const [hashtag, setHashtag] = useState([]);
  //ETat pour charger l'input du nouveau tweet posté
  const [newTweet, setNewTweet] = useState("");
  //Etat pour charger les user au chargement de lapage
  const [tweets, setTweets] = useState([]);
  //Etat pour compter le nombre de hashtag
  const [clickHashtag, setClickHashtag] = useState(false);
  const [clickNameHash, setClickNameHash] = useState("");

  const [isLightMode, setIsLightMode] = useState(false);


  const handleThemeChange = () => {
    setIsLightMode(!isLightMode);
  };
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/tweets");
      const data = await response.json();
      if (data.result) {
        setTweets(data.user);
        const regex = /#\S+\b/g;
        const tags = data.user
          .map((tweet) => tweet.tweet.tweet)
          .flat()
          .map((message) => {
            if (typeof message === "string") {
              const match = message.match(regex);
              return match ? match : [];
            } else {
              return [];
            }
          })
          .flat();
        setHashtag([...new Set(tags)]);
        setHashtagCopy(tags.filter((tag) => tag !== null));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userRed.token) {
      fetchData();
    }
  }, [userRed.token]);

  //fonction qui detecte si un hashtag est clické : true/false et nom du hashtag
  const handleClickNameHash = (hash) => {
    setClickHashtag(true);
    setClickNameHash(hash);
  };

  const handleTweet = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/tweets/tweet/${userRed.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tweet: newTweet,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post tweet");
      }

      await response.json();
      if (response.ok) {
        setNewTweet("");
        setCount(0);
        fetchData();
      } else {
        throw new Error("Failed to add tweet to the store");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseHashtag = () => {
    setClickHashtag(false);
  };

  const handleLogout = () => {
    router.push("/");
    dispatch(logout());
  };

  const handleDeleteTweet = async (token, tweetId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/tweets/deleteTweet/${token}/${tweetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.result) {
        fetchData();
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  

  const handleLikeTweet = async (token, tweetId) => {
    if (token === userRed.token) {
      alert("You cannot like or dislike your own tweets");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/tweets/likeTweet/${token}/${tweetId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to like tweet");
      }
      await response.json();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

 
  
  const handleDislikeTweet = async (token, tweetId) => {
    if (token === userRed.token) {
      alert("You cannot like or dislike your own tweets");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/tweets/dislikeTweet/${token}/${tweetId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to dislike tweet");
      }
      await response.json();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };
  


  //fonction pour compter le nombre de hashtag identique
  function countIdenticalStrings(arr, str) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === str) {
        count++;
      }
    }
    return count;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTweet();
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setNewTweet(e.target.value.slice(0, 279));
    setCount(e.target.value.length);
  };

  const tweetView = tweets.map((tweet, i) => {
    return (
      <Tweet
        key={i}
        tweet={tweet}
        clickNameHash={clickNameHash}
        clickHashtag={clickHashtag}
        handleDislikeTweet={handleDislikeTweet}
        handleLikeTweet={handleLikeTweet}
        handleDeleteTweet={handleDeleteTweet}
        isLightMode={isLightMode}
      />
    );
  });

  return (
    <div
      className={styles.main}
      style={{
        // fontFamily: "Shantell",
        color: isLightMode ? "black" : "black",
        backgroundColor: isLightMode ? "#ffffff" : "black",
        border: isLightMode ? "gray" : "black",
        overflowY: "hidden",
        overflowX: "hidden",
      }}
    >
      <div
        className={styles.leftContainer}
        style={{ backgroundColor: isLightMode ? "#DCD8F3" : "black" }}
      >
        <div className={styles.logoTweeter}>
          <AiOutlineTwitter
            size={70}
            style={{
              transform: "rotate(180deg)",
              position: "absolute",
              color: isLightMode ? "black" : "#2707F1",
              marginTop: "12px",
              marginLeft: "5px",
            }}
          />
        </div>
        <div
          className={styles.leftContainerBottomPart}
          style={{
            display: "flex",
            //  flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            height: "500px",
            marginBottom: "40px",
            marginLeft: "10px",
          }}
        >
          <div>
            <UploadImage />
          </div>
          <div className={styles.leftContainerBottomPart1}>
            <div className={styles.leftLastBox}>
              <div
                className={styles.firstName}
                style={{
                  color: isLightMode && "black",
                  marginLeft: "5px",
                  fontSize: "18px",
                }}
              >
                {userRed.firstname}
              </div>
              <div
                className={styles.userName}
                style={{
                  color: isLightMode ? "black" : "white",
                  marginLeft: "5px",
                  fontSize: "17px",
                }}
              >
                @{userRed.username}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            className={styles.BtnLogout}
            style={{
              backgroundColor: isLightMode ? "black" : "#2707F1",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div
        className={styles.middleContainer}
        style={{ borderColor: isLightMode ? "black" : "gray" }}
      >
        <div
          className={styles.middleTopContaine}
          style={{ backgroundColor: isLightMode ? "#DCD8F3" : "black" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              style={{
                width: "200px",
                color: isLightMode ? "black" : "white",
                marginLeft: "5px",
              }}
            >
              {!clickHashtag ? "Home" : `${clickNameHash.slice(0, 25)}...`}
            </h3>
            {clickHashtag && (
              // <div>
              <p
                onClick={handleCloseHashtag}
                style={{
                  paddingLeft: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "15px",
                  textDecoration: "underline",
                  width: "20%",
                  cursor: "pointer",
                  color: isLightMode ? "black" : "blue",
                  marginLeft: clickHashtag ? "160px" : "",
                }}
              >
                Back
              </p>
              // </div>
            )}
          </div>
          <div className={styles.tweetInput}>
            <input
              onKeyDown={handleKeyDown}
              value={newTweet}
              onChange={handleChange}
              type="text"
              placeholder="What's up ?"
              className={styles.msgTweet}
              style={{
                color: "black",
                backgroundColor: isLightMode ? "white" : "white",
                borderRadius: "20px",
                width: "90%",
              }}
            />
          </div>
          <div className={styles.tweetCaracters}>
            <span
              className={styles.spanCount}
              style={{ color: isLightMode ? "black" : "white" }}
            >
              {count}/280
            </span>

            <button
              className={styles.BtnTweet}
              onClick={() => handleTweet()}
              style={{
                backgroundColor: isLightMode ? "black" : "#2707F1",
              }}
            >
              Tweet
            </button>
          </div>
        <ScrollToTopButton />
        </div>
        <div
          className={styles.middleBottomContainer}
          style={{ backgroundColor: isLightMode ? "#DCD8F3" : "black" }}
        >
          {tweetView}
        </div>
      </div>
      <div
        className={styles.rightContainer}
        style={{ backgroundColor: isLightMode ? "#DCD8F3" : "black" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            alignItems: "center",
          }}
        >
          <h3 style={{ color: isLightMode ? "black" : "white" }}>Trends</h3>
          <BsLightningFill
            style={{
              cursor: "pointer",
              color: isLightMode ? "black" : "white",
            }}
            size={20}
            onClick={handleThemeChange}
          />
        </div>

        <div className={styles.hashtagContainer} style={{backgroundColor : isLightMode ? "rgb(31, 30, 30)" : "#EAEAE7"}}>
          {hashtag.map((e, i) => {
            let hash = e?.substring(0);

            return (
              <div key={i} className={styles.hashPostContainer}>
                <a
                  // href={hash}
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    cursor: "pointer",
                  }}
                >
                  <h3
                    onClick={() => handleClickNameHash(hash)}
                    style={{ color: isLightMode ? "#ffffff" : "black", fontSize: "20px", height: "0.5vh" }}
                  >
                    {hash.length > 22 ? `${hash.slice(0, 22)}...` : hash}
                  </h3>
                </a>
                <div style={{ display: "flex", color: "gray", height: "5vh" }}>
                  <p>{countIdenticalStrings(hashtagCopy, hash)}</p>
                  <p style={{ marginLeft: "5px" }}>
                    {countIdenticalStrings(hashtagCopy, hash) === 1
                      ? "Tweet"
                      : "Tweets"}{" "}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    // </div>
  );
}
