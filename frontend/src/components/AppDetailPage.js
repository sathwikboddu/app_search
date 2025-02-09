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

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/app/${appId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((res) => {
        setAppDetails(res.data);
      })
      .catch((err) => console.error("Error fetching app details:", err));

    axios
      .get(`${API_BASE_URL}/reviews/?app_id=${appId}&is_approved=True`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((res) => {
        setReviews(res.data.results || []);
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [appId]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    try {
      const reviewData = {
        app: parseInt(appId),
        review_text: newReview,
        user: 1,
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

  if (!appDetails) return <p>Loading app details...</p>;

  return (
    <div className="app-detail-page">
      <div className="app-header">
        <h1>{appDetails.app_name}</h1>
        <p className="category">Category: {appDetails.category}</p>
      </div>

      {/* App Info Section (Tiles/Grid Layout) */}
      <div className="app-info-grid">
        <div className="info-tile"><strong>Rating:</strong> {appDetails.rating} ⭐</div>
        <div className="info-tile"><strong>Reviews:</strong> {appDetails.reviews_count}</div>
        <div className="info-tile"><strong>Installs:</strong> {appDetails.installs}</div>
        <div className="info-tile"><strong>Price:</strong> {appDetails.price}</div>
        <div className="info-tile"><strong>Content Rating:</strong> {appDetails.content_rating || "N/A"}</div>
        <div className="info-tile"><strong>Genres:</strong> {appDetails.genres}</div>
        <div className="info-tile"><strong>Current Version:</strong> {appDetails.current_version}</div>
      </div>

      <div className="submit-review">
        <h3>Submit a Review</h3>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write a review..."
        />
        <button onClick={handleReviewSubmit}>Submit Review</button>
      </div>

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
          padding: 20px;
        }

        .app-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .app-header h1 {
          font-size: 28px;
          color: #333;
        }

        .category {
          font-size: 18px;
          color: #666;
        }

        .app-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .info-tile {
          background: #fff;
          padding: 10px;
          text-align: center;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-size: 16px;
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
          text-align: left; /* Ensures text starts from the left */
          padding-left: 0;  /* Removes any unintended left padding */
          font-size: 16px;
          color: #888;
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

      `}</style>
    </div>
  );
};

export default AppDetailPage;
