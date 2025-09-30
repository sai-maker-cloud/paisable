import React, { useEffect, useState } from "react";
import api from "../api/axios";

const RecurringTransactions = () => {
  const [recurring, setRecurring] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    amount: "",
    isIncome: false,
    frequency: "monthly",
    startDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRecurring();
  }, []);

  const fetchRecurring = async () => {
    try {
      const { data } = await api.get("/recurring");
      setRecurring(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`http://localhost:5000/api/recurring/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("http://localhost:5000/api/recurring/create", form);
      }
      setForm({
        name: "",
        category: "",
        amount: "",
        isIncome: false,
        frequency: "monthly",
        startDate: "",
      });
      fetchRecurring();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      amount: item.amount,
      isIncome: item.isIncome,
      frequency: item.frequency,
      startDate: item.startDate.slice(0, 10),
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/recurring/${id}`);
      fetchRecurring();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Recurring Transactions</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
        <select
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.isIncome}
            onChange={(e) => setForm({ ...form, isIncome: e.target.checked })}
          />
          <span>Income</span>
        </label>
        <button
          type="submit"
          className="col-span-1 md:col-span-3 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Frequency</th>
              <th className="p-2 text-left">Next Due</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recurring?.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">{r.amount}</td>
                <td className="p-2">{r.isIncome ? "Income" : "Expense"}</td>
                <td className="p-2">{r.frequency}</td>
                <td className="p-2">
                  {new Date(r.nextDueDate).toLocaleDateString()}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringTransactions;
