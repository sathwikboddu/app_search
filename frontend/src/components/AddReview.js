import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const AddReview = ({ appId }) => {
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/add_review/`, { app_id: appId, text: review });
      setReview("");
      alert("Review submitted for approval!");
    } catch (error) {
      alert("Error submitting review");
    }
  };

  return (
    <div>
      <input placeholder="Add your review..." value={review} onChange={(e) => setReview(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AddReview;
