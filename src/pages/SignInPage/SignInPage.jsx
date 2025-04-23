import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image, message } from "antd";
import imageLogo from "../../assets/images/logo-login.png";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import {jwtDecode} from "jwt-decode"
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";


const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()

  const mutation = useMutationHooks((data) => UserService.loginUser(data));

  const { isPending } = mutation;

  const handleGetDetailUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token, refreshToken}))
  }

  const handleNavigationSignUp = () => {
    navigate("/sign-up");
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handelSignIn = () => {
    mutation.mutate(
      { email, password }, 
      {
        onSuccess: (data) => {
          if(data.status === "OK") {
            if(location?.state) {
              navigate(location?.state)
            } else {
              navigate('/')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
            if(data?.access_token) {
              const decoded = jwtDecode(data?.access_token)
              if(decoded?.id) {
                handleGetDetailUser(decoded?.id, data?.access_token)
              }
            }
          } else {
            message.error(data.message);
          }
        }});
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
          <div style={{ position: "relative" }}>
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
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handelSignIn}
              size={40}
              styleButton={{
                background: `rgb(255,57,69)`,
                height: `48px`,
                width: `100%`,
                border: `none`,
                borderRadius: `4px`,
                margin: `26px 0 10px`,
              }}
              textbutton={"Đăng nhập"}
              styletextbutton={{
                color: "#fff",
                fontSize: `15px`,
                fontWeight: `700`,
              }}
            />
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <p>
            Chưa có tài khoản{" "}
            <WrapperTextLight onClick={handleNavigationSignUp}>
              {" "}
              Tạo tài khoản
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

export default SignInPage;
