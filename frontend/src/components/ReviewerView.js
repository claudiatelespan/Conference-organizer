import React, { useState } from "react";
import "../App.css";
import { handleDownload } from "../Utils.js";
import { addReview } from "../Api.js";


const ReviewerView = ({ selectedConference, articles, reviewerId, onUpdateReview }) => {
  const [tempFeedback, setTempFeedback] = useState({});

  const getReviewerFeedback = (article) => {
    const review = article?.reviews?.find(r => r.reviewerId === reviewerId);
    return review ? review.feedback : '';
  };

  const isArticleApproved = (article) => {
    return article?.reviews?.every(review => review.approved);
  };

  const handleFeedbackChange = (articleId, feedback) => {
    setTempFeedback({
      ...tempFeedback,
      [articleId]: feedback
    });
  };

  const handleSendReview = async (articleId) => {
    const feedback = tempFeedback[articleId] || '';
    try {
      const result = await addReview(articleId, localStorage.getItem('userId'), { feedback, status: 'respins' });

      onUpdateReview(selectedConference.id);
      setTempFeedback({
        ...tempFeedback,
        [articleId]: ''
      });

    } catch (error) {
      console.error('Eroare la trimiterea review-ului:', error);
    }
  };

  const handleApproveArticle = async (articleId) => {
    const feedback = 'OK!'
    try {
      const result = await addReview(articleId, localStorage.getItem('userId'), { feedback, status: 'acceptat' });
      onUpdateReview(selectedConference.id);
      setTempFeedback({
        ...tempFeedback,
        [articleId]: ''
      });

    } catch (error) {
      console.error('Eroare la trimiterea review-ului:', error);
    }
  };

  return (
    <div className="reviewer-view">
      <h2>Articole de evaluat pentru: {selectedConference.title}</h2>
      <div className="articles-grid">
        {articles?.map((article) => {
          const reviewerReview = article?.reviews?.find(r => r.reviewerId === reviewerId);
          const isReviewerApproved = reviewerReview?.approved;
          const isFullyApproved = isArticleApproved(article);
          const submittedFeedback = getReviewerFeedback(article);

          return (
            <div 
              key={article.id} 
              className={`article-card ${isFullyApproved ? 'approved' : ''}`}
            >
              <h3>{article.title}</h3>
              <button
                onClick={() => handleDownload(article.filePath)}
              >
                Descarcă articol
              </button>
              <p><strong>Autor:</strong> {article.author}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status ${isFullyApproved ? 'approved' : 'pending'}`}>
                  {isFullyApproved ? 'Aprobat' : 'În așteptare'}
                </span>
              </p>
              
              <div className="review-section">
                <div><h4>Review-ul tău:</h4>
                {article.reviews?.filter(review => review.reviewer_id === parseInt(localStorage.getItem('userId')))[0]?.feedback || ''}
                </div>
                <p></p>
                <p></p>
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
                        className="approve-button"                      >
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