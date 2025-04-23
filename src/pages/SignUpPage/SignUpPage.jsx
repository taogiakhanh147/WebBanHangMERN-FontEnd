import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import imageLogo from "../../assets/images/logo-login.png";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const { isPending } = mutation;

  const handleOnChangeEmail = (value) => {
    setEmail(value);
    setEmailError("");
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    const reg = /^\w+([-+.']\w+)*@gmail\.com$/; 
    const isCheckEmail = reg.test(email);
    if (!isCheckEmail) {
      setEmailError("Email không hợp lệ");
      return;
    }
    mutation.mutate({ email, password, confirmPassword }, {
      onSuccess: (data) => {
        if (data.status === "OK") {
          message.success();
          handleNavigateSignIn();
        } else {
          message.error(data.message);
        }
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(0,0,0,0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: `10px` }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
          />
          {emailError && <span style={{ color: "red" }}>{emailError}</span>}
          <div style={{ position: "relative", marginBottom: `10px` }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "8px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "8px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="confirm password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnChangeConfirmPassword}
            />
          </div>
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: `rgb(255,57,69)`,
                height: `48px`,
                width: `100%`,
                border: `none`,
                borderRadius: `4px`,
                margin: `26px 0 10px`,
              }}
              textbutton={"Đăng ký"}
              styletextbutton={{
                color: "#fff",
                fontSize: `15px`,
                fontWeight: `700`,
              }}
            />
          </Loading>
          <p>
            Bạn đã có tài khoản{" "}
            <WrapperTextLight
              onClick={handleNavigateSignIn}
              style={{ cursor: "pointer" }}
            >
              {" "}
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            alt="image-login"
            preview={false}
            height="203px"
            width="203px"
          />
          <h4>Mua sắm tại cửa hàng</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
