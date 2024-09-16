import React, { useState } from "react";
import {
  WrapperCountOrder,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperPriceDiscount,
  WrapperStyleHeader,
} from "./style";
import { Checkbox } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { WrapperInputNumber } from "../../components/ProductDetailComponent/style";
import { increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct } from "../../redux/slides/orderSlide";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const [listChecked, setListChecked] = useState([])
  const dispatch = useDispatch()

  const onChange = (e) => {
    if(listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const handleChangeCount = (type, idProduct) => {
    if(type === 'increase') {
      dispatch(increaseAmount({idProduct}))
    } else if (type === 'decrease') {
      dispatch(decreaseAmount({idProduct}))
    }
  };

  const handleOnChangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item.product)
      });
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleRemoveAllProduct = () => {
    if(listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({listChecked}))
    }
    console.log("success")
  }

  return (
    <div style={{ background: "#f5f5f5", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox onChange={handleOnChangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                <span>Tất cả ({order.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: "pointer" }} onClick={handleRemoveAllProduct}></DeleteOutlined>
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4",
                      }}
                    >
                      <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{width: '260px', overflow: 'hidden', textOverflow:'ellipsis', whiteSpace: 'nowrap'}}>
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          {order?.price}
                        </span>
                      </span>
                      <WrapperCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => handleChangeCount("decrease", order?.product)}
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => handleChangeCount("increase", order?.product)}
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{
                          color: "rgb(255,66,78)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {order?.price * order?.amount}
                      </span>
                      <DeleteOutlined style={{ cursor: "pointer" }} onClick={() => handleDeleteOrder(order?.product)}/>
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
