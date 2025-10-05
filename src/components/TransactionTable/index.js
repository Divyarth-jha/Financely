import { Radio, Table, Input, Select } from 'antd';
import React, { useState } from 'react';
import SearchImg from "../../assets/search.svg";
import Papa from 'papaparse';
import { toast } from 'react-toastify';

const { Option } = Select;

const TransactionsTable = ({ transactions, addTransaction }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortkey, setSortKey] = useState("");

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Type", dataIndex: "type", key: "type" },
  ];

  const filteredTransactions = transactions.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "" || item.type === typeFilter)
  );

  const sortedTransaction = [...filteredTransactions].sort((a, b) => {
    if (sortkey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortkey === "amount") {
      return a.amount - b.amount;
    }
    return 0;
  });

  // ✅ Export CSV
  function exportCsv() {
    const csv = Papa.unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: sortedTransaction,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = csvURL;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ✅ Import CSV (fixed async + mapping)
  async function importCsv(e) {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        complete: async function (results) {
          console.log("Parsed CSV results: ", results.data);

          for (let item of results.data) {
            if (item.name && item.amount) {
              const newTransaction = {
                name: item.name,
                type: item.type,
                tag: item.tag,
                date: item.date,
                amount: parseInt(item.amount),
              };
              await addTransaction(newTransaction, true);
            }
          }

          toast.success("Transactions imported successfully");
        },
        error: function (err) {
          console.error("CSV Parse error: ", err);
          toast.error("Failed to import CSV");
        },
      });

      e.target.value = null;
    } catch (err) {
      console.error("CSV Import error: ", err);
      toast.error("Error importing CSV");
    }
  }

  return (
    <div style={{ width: "100%", padding: "0rem " }}>
      <div
        style={{
          
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={SearchImg} width="16" alt="Search" />
          <Input
            placeholder="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          className="select-input"
          onChange={setTypeFilter}
          value={typeFilter}
          placeholder="Filter by Type"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortkey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <div
            style={{
              marginRight:"10",
              display: "flex",
              justifyContent: "space-between",
              width: "400px",
              gap: "1rem",
            }}
          >
            <button className="btn" style={{padding:""}} onClick={exportCsv}>
              Export To CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import From CSV
            </label>
            <input
              onChange={importCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table
          dataSource={sortedTransaction.map((item, index) => ({
            ...item,
            key: index,
          }))}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
