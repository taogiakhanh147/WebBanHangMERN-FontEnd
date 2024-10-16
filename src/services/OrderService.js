import { axiosJWT } from "./UserService";

export const createOrder = async (data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/order/create`,
    data,
  );
  return res.data;
};

export const getOrderByUserId = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`,
  );
  return res.data;
};

export const getDetailsOrder = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`,
  );
  return res.data;
};

export const getDetailsOrderAdmin = async (orderId) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/order/get-details-order-admin`,
    {orderId}
  );
  return res.data;
};

export const cancelOrder = async (id, orderItems) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`, 
    {data: orderItems}
  );
  return res.data;
};

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const deleteOrder = async (id) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/order/delete-order-admin/${id}`
  );
  return res.data;
};

export const deleteManyOrder = async (data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/order/delete-many`, data
  );
  return res.data;
};