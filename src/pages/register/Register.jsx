import "./register.scss";
import { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DarkModeContext } from "../../context/darkModeContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

const Register = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { dispatch: authDispatch } = useContext(AuthContext);
  const { darkMode, dispatch: darkModeDispatch } = useContext(DarkModeContext);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Semua field harus diisi");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password harus minimal 6 karakter");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Format email tidak valid");
      return false;
    }

    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    if (!validateForm()) {
      setError(true);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        authDispatch({ type: "REGISTER", payload: user });
        navigate("/");
      })
      .catch((error) => {
        setError(true);
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("Email sudah terdaftar");
            break;
          case "auth/weak-password":
            setErrorMessage("Password terlalu lemah");
            break;
          case "auth/invalid-email":
            setErrorMessage("Format email tidak valid");
            break;
          default:
            setErrorMessage("Terjadi kesalahan saat registrasi");
        }
      });
  };

  return (
    <div className="register">
      <form onSubmit={handleRegister}>
        <h2>Registrasi</h2>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Konfirmasi password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Daftar</button>

        <div className="navigation">
          <span>Sudah punya akun? </span>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/login")}
          >
            Masuk
          </button>
        </div>

        <div className="items">
          <div className="item">
            {darkMode ? (
              <LightModeOutlinedIcon
                className="icon"
                onClick={() => darkModeDispatch({ type: "TOGGLE" })}
              />
            ) : (
              <DarkModeOutlinedIcon
                className="icon"
                onClick={() => darkModeDispatch({ type: "TOGGLE" })}
              />
            )}
          </div>
        </div>

        {error && <span className="error">{errorMessage}</span>}
      </form>
    </div>
  );
};

export default Register;
