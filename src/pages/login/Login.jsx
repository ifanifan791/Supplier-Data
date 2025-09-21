import "./login.scss"; 
import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DarkModeContext } from "../../context/darkModeContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

const Login = () => { 
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const { user, dispatch: authDispatch } = useContext(AuthContext);
  const { darkMode, dispatch: darkModeDispatch } = useContext(DarkModeContext);

  const handleLogin = (e) => {
    e.preventDefault();
  
    signInWithEmailAndPassword(auth, email, password)
     .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        authDispatch({ type: "LOGIN", payload: user });
        navigate("/");
      })
     .catch((error) => {
        setError(true);
      });
  };

  return (
    <div className="login">
      <form data-testid="form" onSubmit={handleLogin}>
        {user && <span>Welcome, {user.displayName}!</span>}
        <h2>Masuk</h2>
        <input
          id="email"
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="password"
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" data-testid="submit">Masuk</button>
        <div className="navigation">
          <span>Belum punya akun? </span>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Daftar
          </button>
        </div>
        <div className="items">
          <div className="item">
            {darkMode? (
              <LightModeOutlinedIcon className="icon"
                onClick={() => darkModeDispatch({ type: "TOGGLE" })} />
            ) : (
              <DarkModeOutlinedIcon className="icon"
                onClick={() => darkModeDispatch({ type: "TOGGLE" })} />
            )}
          </div>      
        </div>
        {error && <span>Wrong email or password!</span>}
      </form>
    </div>
  );
};

export default Login;