import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const SupervisorPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default page size

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = () => {
    axios
      .get(`${API_BASE_URL}/reviews/?is_approved=False&page=${currentPage}`)
      .then((res) => {
        setReviews(res.data.results || []);
        setNextPage(res.data.next);
        setSelectedReviews([]);
        setSelectAll(false);

        // Extract count and page size
        if (res.data.count) {
          setTotalPages(Math.ceil(res.data.count / 10));
          setPageSize(10);
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  const handleSelectReview = (reviewId) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((review) => review.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBatchUpdate = (isApproved) => {
    if (selectedReviews.length === 0) {
      alert("No reviews selected!");
      return;
    }

    axios
      .patch(
        `${API_BASE_URL}/reviews/batch-update/`,
        { review_ids: selectedReviews, is_approved: isApproved },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      )
      .then(() => {
        fetchReviews(); // ✅ Reload table after approval/rejection
      })
      .catch((err) => console.error("Error updating reviews:", err));
  };

  return (
    <div className="supervisor-panel">
      <h1>Supervisor Panel - Review Approvals</h1>

      {reviews.length === 0 ? (
        <p>No pending reviews.</p>
      ) : (
        <>
          <div className="batch-actions">
            <button className="approve-button" onClick={() => handleBatchUpdate(true)}>
              Approve Selected
            </button>
            <button className="reject-button" onClick={() => handleBatchUpdate(false)}>
              Reject Selected
            </button>
          </div>

          <table className="review-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>App Name</th>
                <th>Review Text</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={() => handleSelectReview(review.id)}
                    />
                  </td>
                  <td>{review.app_name}</td>
                  <td>{review.review_text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={!nextPage}>
          Next
        </button>
      </div>

      <style jsx>{`
        .supervisor-panel {
          font-family: Arial, sans-serif;
          padding: 20px;
        }

        .batch-actions {
          margin-bottom: 10px;
        }

        .review-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .review-table th, .review-table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .approve-button, .reject-button {
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

        .reject-button {
          background-color: #dc3545;
          color: white;
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
