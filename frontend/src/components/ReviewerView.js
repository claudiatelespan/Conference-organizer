// components/Reviewer/ReviewerView.js
import React, { useState } from "react";
import "../App.css";

const ReviewerView = ({ selectedConference, articles, reviewerId, onUpdateReview }) => {

  const assignedArticles = articles.filter(article => 
    article.conferenceId === selectedConference.id 
    // && article.reviews.some(review => review.reviewerId === reviewerId)
  );

  const handleFeedbackChange = (articleId, feedback) => {
    onUpdateReview(articleId, reviewerId, { feedback });
  };

  const handleApproveArticle = (articleId) => {
    onUpdateReview(articleId, reviewerId, { approved: true });
  };

  const filteredArticles = articles.filter(
    (article) => article.reviewerId === reviewerId
  );

  return (
    <div className="reviewer-view">
      <h2>Articles for Conference: {selectedConference.title}</h2>
      {assignedArticles.map((article) => {
        //const review = article.reviews.find(r => r.reviewerId === reviewerId);
        return (
          <div key={article.id} className="article-card">
            <h3>{article.title}</h3>
            <p><strong>Author:</strong> {article.author}</p>
            <p><strong>Status:</strong> {article.status}</p>
            <textarea
              value={article.feedback}
              onChange={(e) => handleFeedbackChange(article.id, e.target.value)}
              placeholder="Add feedback"
              disabled={article.approved}
            />
            <button 
              onClick={() => handleApproveArticle(article.id)}
              disabled={article.approved}
            >
              {article.approved ? 'Approved' : 'Approve'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewerView;
