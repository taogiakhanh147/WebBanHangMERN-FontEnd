import { Table } from "antd";
import React, { useState } from "react";
import Loading from "../LoadingComponent/Loading";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
    exportToExcel
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("selectedRowKeys: ", selectedRowKeys)
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  const handleExportToExcel = () => {
    if (exportToExcel) {
      exportToExcel();
    }
  };

  return (
    <Loading isPending={isLoading}>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: "#1d1ddd",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleExportToExcel}
          style={{
            background: "green",
            marginTop: "10px",
            marginBottom: "10px",
            color: "white",
            padding: "10px",
            fontSize: "12px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Export to Excel
        </button>
      </div>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
