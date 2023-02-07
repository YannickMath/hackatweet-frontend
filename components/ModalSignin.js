import { useState } from "react";
import styles from "../styles/Modal.module.css";
import { AiOutlineTwitter } from "react-icons/ai";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "@/reducers/user.slice";

export default function ModalSignin({ setModalSignin }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleClickSignin = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: inputUsername,
          password: inputPassword,
        }),
      });
      const data = await response.json();
      if (data.result) {
        dispatch(
            login({
           
              username: inputUsername,
            
            })
        )
    
        router.push("/welcome");
      } else {
        setErrorMessage("Authentication failed");
        setInputPassword("");
        setInputUsername("");
      }
    } catch (error) {
      setErrorMessage("An error occurred, please try again later");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.logoModal}>
        <AiOutlineTwitter
          color="white"
          size={70}
          style={{
            transform: "rotate(180deg)",
          }}
        />
        <span
          onClick={() => setModalSignin(false)}
          style={{ cursor: "pointer" }}
        >
          X
        </span>
      </div>
      <h2>Connect to Hackatweet</h2>

      <input
        type="text"
        placeholder="username"
        className={styles.inputModal}
        value={inputUsername}
        onChange={(e) => setInputUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        className={styles.inputModal}
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
      />
      {errorMessage && <p>{errorMessage}</p>}
      <button className={styles.BtnSignup} onClick={handleClickSignin}>
        Signin
      </button>
    </div>
  );
}