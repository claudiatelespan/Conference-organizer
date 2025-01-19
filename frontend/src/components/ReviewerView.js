import React, { useState } from "react";
import "../App.css";

const ReviewerView = ({ selectedConference, articles, reviewerId, onUpdateReview }) => {
  const [tempFeedback, setTempFeedback] = useState({});

  // Filter articles for this conference where this reviewer is assigned
  const assignedArticles = articles.filter(article => 
    article.conferenceId === selectedConference.id &&
    article.reviews.some(review => review.reviewerId === reviewerId)
  );

  const getReviewerFeedback = (article) => {
    const review = article.reviews.find(r => r.reviewerId === reviewerId);
    return review ? review.feedback : '';
  };

  const isArticleApproved = (article) => {
    return article.reviews.every(review => review.approved);
  };

  const handleFeedbackChange = (articleId, feedback) => {
    setTempFeedback({
      ...tempFeedback,
      [articleId]: feedback
    });
  };

  const handleSendReview = (articleId) => {
    const feedback = tempFeedback[articleId] || '';
    onUpdateReview(articleId, reviewerId, { feedback });
    // Clear temporary feedback after sending
    setTempFeedback({
      ...tempFeedback,
      [articleId]: ''
    });
  };

  const handleApproveArticle = (articleId) => {
    onUpdateReview(articleId, reviewerId, { approved: true });
  };

  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop();
    link.click();
  };

  return (
    <div className="reviewer-view">
      <h2>Articole de evaluat pentru: {selectedConference.title}</h2>
      <div className="articles-grid">
        {assignedArticles.map((article) => {
          const reviewerReview = article.reviews.find(r => r.reviewerId === reviewerId);
          const isReviewerApproved = reviewerReview?.approved;
          const isFullyApproved = isArticleApproved(article);
          const submittedFeedback = getReviewerFeedback(article);

          return (
            <div 
              key={article.id} 
              className={`article-card ${isFullyApproved ? 'approved' : ''}`}
            >
              <h3>{article.title}</h3>
              <p><strong>Autor:</strong> {article.author}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status ${isFullyApproved ? 'approved' : 'pending'}`}>
                  {isFullyApproved ? 'Aprobat' : 'În așteptare'}
                </span>
              </p>
              
              <div className="review-section">
                <h4>Review-ul tău:</h4>
                
                {/* Display submitted review if it exists */}
                {submittedFeedback && (
                  <div className="submitted-review">
                    <p>{submittedFeedback}</p>
                  </div>
                )}

                {/* Textarea for new review */}
                <div className="new-review">
                  <h5>Adaugă/Modifică review:</h5>
                  <textarea
                    value={tempFeedback[article.id] || ''}
                    onChange={(e) => handleFeedbackChange(article.id, e.target.value)}
                    placeholder="Adaugă feedback"
                    disabled={isReviewerApproved}
                    className={isReviewerApproved ? 'approved' : ''}
                  />
                </div>
                
                <div className="action-buttons">
                  {!isReviewerApproved && (
                    <>
                      <button 
                        onClick={() => handleSendReview(article.id)}
                        className="send-review-button"
                        disabled={!tempFeedback[article.id]}
                      >
                        Trimite Review
                      </button>
                      <button 
                        onClick={() => handleApproveArticle(article.id)}
                        className="approve-button"
                        disabled={!submittedFeedback}
                      >
                        Aprobă
                      </button>
                    </>
                  )}
                  {isReviewerApproved && (
                    <span className="approved-badge">Review Aprobat ✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewerView;