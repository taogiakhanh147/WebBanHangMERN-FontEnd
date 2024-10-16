import React, { useEffect, useRef, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import * as XLSX from "xlsx";

const AdminProduct = () => {
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const limit = 6
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const searchInput = useRef(null);

  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
    newType: "",
    discount: "",
  })

  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());

  const [form] = Form.useForm();

  const user = useSelector((state) => state?.user);

  const mutation = useMutationHooks((data) => {
    const res = ProductService.createProduct(data);
    return res;
  });

  const { data, isPending, isSuccess, isError } = mutation;

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const getAllProductAdmins = async () => {
    const res = await ProductService.getAllProductAdmin( limit, currentPage);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data.name,
        price: res?.data.price,
        description: res?.data.description,
        rating: res?.data.rating,
        image: res?.data.image,
        type: res?.data.type,
        countInStock: res?.data.countInStock,
        discount: res?.data.discount,
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if(!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailIsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const queryProduct = useQuery({
    queryKey: ["products", currentPage],
    queryFn: getAllProductAdmins,
    keepPreviousData: true,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const { isLoading: isLoadingProduct, data: products } = queryProduct;

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailIsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "< 50",
          value: "<",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price < 50;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "< 3",
          value: "<",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.rating >= 3;
        }
        return record.rating < 3;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModelOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const exportProductToExcel = () => {
    const filterData = dataTable.map((row) => ({
      name: row.name,
      price: row.price,
      rating: row.rating,
      type: row.type,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filterData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "products");
    XLSX.writeFile(workbook, "products_table.xlsx");
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };
  
    return (
      <div>
        <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
        <div style={{ marginTop: "10px" }}>
          <Button
            style={{
              height: "150px",
              width: "150px",
              borderRadius: "6px",
              borderStyle: "dashed",
            }}
            onClick={() => setIsModelOpen(true)}
          >
            <PlusOutlined style={{ fontSize: "60px" }} />
          </Button>
        </div>
        <div style={{ marginTop: "20px" }}>
          <TableComponent
            handleDeleteMany={handleDeleteManyProducts}
            columns={columns}
            isLoading={isLoadingProduct}
            data={dataTable}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id);
                },
              };
            }}
            pagination={{
              current: currentPage,
              pageSize: 6,
              total: queryProduct.data?.total || 0,
              onChange: handlePageChange,
            }}
            exportToExcel={exportProductToExcel}
          />
        </div>

        <ModalComponent
          forceRender
          title="Thêm sản phẩm"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Loading isPending={isPending}>
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              onFinish={onFinish}
              autoComplete="on"
            >
              {/* Name */}
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.name}
                  onChange={handleOnchange}
                  name="name"
                />
              </Form.Item>
              {/* type */}
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input your type",
                  },
                ]}
              >
                <Select
                  name="type"
                  // defaultValue="lucy"
                  // style={{
                  //   width: 120,
                  // }}
                  value={stateProduct.type}
                  onChange={handleChangeSelect}
                  options={renderOptions(typeProduct?.data?.data)}
                />
              </Form.Item>
              {stateProduct.type === "add_type" && (
                <Form.Item
                  label="New type"
                  name="new-type"
                  rules={[
                    {
                      required: true,
                      message: "Please input your type",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateProduct.newType}
                    onChange={handleOnchange}
                    name="newType"
                  />
                </Form.Item>
              )}

              {/* countInStock */}
              <Form.Item
                label="Count in stock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input your count in stock",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.countInStock}
                  onChange={handleOnchange}
                  name="countInStock"
                />
              </Form.Item>
              {/* price */}
              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.price}
                  onChange={handleOnchange}
                  name="price"
                />
              </Form.Item>
              {/* description */}
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.description}
                  onChange={handleOnchange}
                  name="description"
                />
              </Form.Item>
              {/* rating */}
              <Form.Item
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input your rating",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.rating}
                  onChange={handleOnchange}
                  name="rating"
                />
              </Form.Item>
              {/* discount */}
              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input your discount",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.discount}
                  onChange={handleOnchange}
                  name="discount"
                />
              </Form.Item>
              {/* image */}
              <Form.Item
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please input your image",
                  },
                ]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                  <Button>Select file</Button>
                  {stateProduct?.image && (
                    <img
                      src={stateProduct?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 20,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>

        <DrawerComponent
          title="Chi tiết sản phẩm"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          width="90%"
        >
          <Loading isPending={isPendingUpdate || isPendingUpdated}>
            <Form
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              onFinish={onUpdateProduct}
              autoComplete="on"
              form={form}
            >
              {/* Name */}
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              {/* type */}
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input your type",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.type}
                  onChange={handleOnchangeDetails}
                  name="type"
                />
              </Form.Item>
              {/* countInStock */}
              <Form.Item
                label="Count in stock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input your count in stock",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.countInStock}
                  onChange={handleOnchangeDetails}
                  name="countInStock"
                />
              </Form.Item>
              {/* price */}
              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.price}
                  onChange={handleOnchangeDetails}
                  name="price"
                />
              </Form.Item>
              {/* description */}
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.description}
                  onChange={handleOnchangeDetails}
                  name="description"
                />
              </Form.Item>
              {/* rating */}
              <Form.Item
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input your rating",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.rating}
                  onChange={handleOnchangeDetails}
                  name="rating"
                />
              </Form.Item>
              {/* discount */}
              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input your discount",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.discount}
                  onChange={handleOnchangeDetails}
                  name="discount"
                />
              </Form.Item>
              {/* image */}
              <Form.Item
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please input your image",
                  },
                ]}
              >
                <WrapperUploadFile
                  onChange={handleOnChangeAvatarDetails}
                  maxCount={1}
                >
                  <Button>Select file</Button>
                  {stateProductDetails?.image && (
                    <img
                      src={stateProductDetails?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 20,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Apply
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>

        <ModalComponent
          title="Xóa sản phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteProduct}
        >
          <Loading isPending={isPendingDeleted}>
            <div>Bạn có chắc xóa sản phẩm này không!</div>
          </Loading>
        </ModalComponent>
      </div>
    );
  };

  export default AdminProduct;
