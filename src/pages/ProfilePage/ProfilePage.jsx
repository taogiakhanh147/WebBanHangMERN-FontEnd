import React, { useEffect, useState } from "react";
import {
  WrapperContenProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLable,
  WrapperUploadFile,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rest } = data;
    UserService.updateUser(id, access_token, rest);
  });

  const dispatch = useDispatch();
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailUser(user?.id, user?.access_token);
      mutation.reset();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnChangeName = (value) => {
    setName(value);
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePhone = (value) => {
    setPhone(value);
  };

  const handleOnChangeAddress = (value) => {
    setAddress(value);
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };
  
  const handelUpdate = () => {
    mutation.mutate({
      id: user?.id,
      name,
      email,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isPending={isPending}>
        <WrapperContenProfile>
          {/* Name */}
          <WrapperInput>
            <WrapperLable htmlFor="name">Name</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="name"
              value={name}
              onChange={handleOnChangeName}
            />
          </WrapperInput>
          {/* Email */}
          <WrapperInput>
            <WrapperLable htmlFor="email">Email</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="email"
              value={email}
              onChange={handleOnChangeEmail}
            />
          </WrapperInput>
          {/* Phone */}
          <WrapperInput>
            <WrapperLable htmlFor="phone">Phone</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="phone"
              value={phone}
              onChange={handleOnChangePhone}
            />
          </WrapperInput>
          {/* Address */}
          <WrapperInput>
            <WrapperLable htmlFor="address">Address</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="address"
              value={address}
              onChange={handleOnChangeAddress}
            />
          </WrapperInput>
          {/* Avatar */}
          <WrapperInput>
            <WrapperLable htmlFor="avatar">Avatar</WrapperLable>
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select file</Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
            )}
          </WrapperInput>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <ButtonComponent
              onClick={handelUpdate}
              size={40}
              styleButton={{
                height: `30px`,
                width: `fit-content`,
                borderRadius: `4px`,
                padding: `2px 6px 6px`,
              }}
              textbutton={"Cập nhật"}
              styletextbutton={{
                color: "rgb(26,148,255)",
                fontSize: `15px`,
                fontWeight: `700`,
              }}
            />
          </div>
        </WrapperContenProfile>
      </Loading>
    </div>
  );
};

export default ProfilePage;
