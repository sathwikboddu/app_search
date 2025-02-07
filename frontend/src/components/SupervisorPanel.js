import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const SupervisorPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null); // Store next page URL from API response

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = () => {
    axios
      .get(`${API_BASE_URL}/reviews/?is_approved=False&page=${currentPage}`)
      .then((res) => {
        setReviews(res.data.results || []);
        setNextPage(res.data.next); // Store the next page URL
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  const handleStatusUpdate = (reviewId, isApproved) => {
    axios
      .patch(
        `${API_BASE_URL}/review/approve/${reviewId}/`,
        { is_approved: isApproved },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      )
      .then(() => {
        setReviews(reviews.filter((review) => review.id !== reviewId));
      })
      .catch((err) => console.error("Error updating review status:", err));
  };

  return (
    <div className="supervisor-panel">
      <h1>Supervisor Panel - Review Approvals</h1>

      {reviews.length === 0 ? (
        <p>No pending reviews.</p>
      ) : (
        <table className="review-table">
          <thead>
            <tr>
              <th>App Name</th>
              <th>Review Text</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.app_name}</td>
                <td>{review.review_text}</td>
                <td>
                  <button
                    className="approve-button"
                    onClick={() => handleStatusUpdate(review.id, true)} // Approve (true)
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleStatusUpdate(review.id, false)} // Reject (false)
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!nextPage} // Disable Next button if there's no next page
        >
          Next
        </button>
      </div>

      <style jsx>{`
        .supervisor-panel {
          font-family: Arial, sans-serif;
          padding: 20px;
        }

        .review-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .review-table th,
        .review-table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .approve-button,
        .reject-button {
          padding: 8px 12px;
          font-size: 14px;
          margin: 0 5px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
        }

        .approve-button {
          background-color: #28a745;
          color: white;
        }

        .approve-button:hover {
          background-color: #218838;
        }

        .reject-button {
          background-color: #dc3545;
          color: white;
        }

        .reject-button:hover {
          background-color: #c82333;
        }

        .pagination {
          margin-top: 20px;
          text-align: center;
        }

        .pagination button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          margin: 0 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .pagination button:disabled {
          cursor: not-allowed;
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default SupervisorPanel;
