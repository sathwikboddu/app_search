import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AppDetailPage = () => {
  const { appId } = useParams();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const [appDetails, setAppDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  // Fetch app details and approved reviews
  useEffect(() => {
    // Fetch app details
    axios
      .get(`${API_BASE_URL}/app/${appId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((res) => {
        setAppDetails(res.data); // Assuming this gives the app details like name, description, etc.
      })
      .catch((err) => console.error("Error fetching app details:", err));

    // Fetch approved reviews
    axios
      .get(`${API_BASE_URL}/reviews/?app_id=${appId}&is_approved=True`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((res) => {
        setReviews(res.data.results || []); // Extract reviews from `results` key
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [appId]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    try {
      const reviewData = {
        app: parseInt(appId),
        review_text: newReview,
        user: user?.id, // Ensure user ID is included
      };

      const response = await axios.post(`${API_BASE_URL}/review/submit/`, reviewData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      alert(response.data.message || "Review submitted for approval");
      setNewReview("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  // Loading state
  if (!appDetails) return <p>Loading app details...</p>;

  return (
    <div className="app-detail-page p-4">
      {/* Display the App Name */}
      <h1>{appDetails.app_name}</h1>

      {/* Review Submission Section */}
      <div className="submit-review">
        <h3>Submit a Review</h3> {/* Show app name in the review section */}
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write a review..."
        />
        <button onClick={handleReviewSubmit}>Submit Review</button>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h2>Reviews:</h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <p className="review-text">{review.review_text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <style jsx>{`
        .app-detail-page {
          font-family: Arial, sans-serif;
        }

        .submit-review {
          margin-bottom: 20px;
        }

        .submit-review textarea {
          width: 100%;
          height: 100px;
          padding: 10px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 10px;
        }

        .submit-review button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007BFF;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .submit-review button:hover {
          background-color: #0056b3;
        }

        .reviews-list {
          max-height: 400px;
          overflow-y: auto;
          border-top: 2px solid #f0f0f0;
          padding-top: 10px;
        }

        .review-item {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .review-text {
          font-size: 18px;
          color: #333;
          margin-bottom: 5px;
        }

        .reviews-list p {
          text-align: center;
          font-size: 16px;
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default AppDetailPage;
