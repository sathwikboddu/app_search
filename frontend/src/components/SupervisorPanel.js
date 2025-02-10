import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const SupervisorPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const observer = useRef();

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = () => {
    axios
      .get(`${API_BASE_URL}/reviews/?is_approved=False&page=${currentPage}`)
      .then((res) => {
        setReviews((prev) => [...prev, ...res.data.results]);
        setHasMore(!!res.data.next);
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  const lastReviewRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

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
        setReviews(reviews.filter((review) => !selectedReviews.includes(review.id)));
        setSelectedReviews([]);
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
              {reviews.map((review, index) => (
                <tr key={review.id} ref={index === reviews.length - 1 ? lastReviewRef : null}>
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

      {hasMore && <p className="loading-text">Loading more reviews...</p>}

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

        .loading-text {
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default SupervisorPanel;
