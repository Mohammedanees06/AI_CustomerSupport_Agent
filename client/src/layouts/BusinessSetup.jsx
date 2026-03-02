import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { setBusiness } from "../store/business.slice";

export default function BusinessSetup() {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    // create business
    const res = await apiClient.post("/business", { name });

    //  store business globally (no refresh needed)
    dispatch(setBusiness(res.data));

    //after creating business go to dashboard
    navigate("/dashboard/chat");
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Create Your Business
      </h2>

      <form onSubmit={handleCreate} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Business Name"
          className="w-full border p-2 rounded"
          required
        />

        <button className="w-full bg-gray-900 text-white py-2 rounded">
          Create Business
        </button>
      </form>
    </div>
  );
}