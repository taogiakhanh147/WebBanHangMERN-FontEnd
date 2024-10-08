import React from "react";
import {
  StyleNameProduct,
  WrapperReportText,
  WrapperPriceText,
  WrapperDiscountText,
  WrapperCardStyle,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
  const {countInStock, description, image, name, price, rating, type, selled, discount, id} = props
  const navagate = useNavigate()
  const handleDetailsProduct = (id) => {
    navagate(`/product-detail/${id}`)
  }
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 200, borderRadius: '0 0 5px 5px'}}
      cover={
        <img
          alt="example"
          src={image}
          style={{borderRadius: `5px 5px 0 0`}}
        />
      }
      onClick={() => handleDetailsProduct(id)}
      disabled={countInStock === 0}
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{marginRight: '4px'}}>
          <span>{rating} </span>
          <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
        </span>
        <WrapperStyleTextSell> | Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{marginRight: '8px'}}>{convertPrice(price)}</span>
        <WrapperDiscountText>-{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
