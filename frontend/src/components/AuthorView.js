import React, { useState } from "react";
import { handleDownload } from "../Utils.js";


const AuthorView = ({ 
  selectedConference, 
  isRegistered, 
  articles, 
  onRegister, 
  onUploadArticle 
}) => {
  const handleFileUpload = (event, existingArticleId = null) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const articleData = {
        title: file.name,
        content: e.target.result,
        uploadDate: new Date().toISOString(),
      };

      onUploadArticle(selectedConference.id, articleData, existingArticleId);
    };
    reader.readAsText(file);
  };


  if (!selectedConference) return <p>Selectează o conferință pentru a vedea detalii.</p>;

  return (
    <div className="author-view">
      <h2>Conferință: {selectedConference.title}</h2>
      
      {!isRegistered ? (
        <button onClick={onRegister} className="register-button">
          Înscrie-te la conferință
        </button>
      ) : (
        <div className="articles-section">
          <div className="upload-section">
            <input
              type="file"
              id="article-upload"
              onChange={(e) => handleFileUpload(e)}
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
            />
            <label htmlFor="article-upload" className="upload-button">
              Încarcă articol nou
            </label>
          </div>

          <div className="articles-list">
            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <h3>{article.title}</h3>                  
                <button 
                    onClick={() => handleDownload(article.filePath)}
                    className="download-button"
                  >
                    Descarcă articol
                </button>
                <p className="status">Status: {article.status}</p>
                
                <div className="reviews-section">
                  <h4>Review-uri:</h4>
                  {article.reviews?.map((review, idx) => (
                    <div key={idx} className="review">
                      <p><strong>Reviewer {idx + 1}:</strong></p>
                      <p>{review.feedback || 'Niciun feedback încă'}</p>
                      <p>Status: {review.approved ? 'Aprobat' : 'În așteptare'}</p>
                    </div>
                  ))}
                </div>

                <div className="article-actions">
                  <input
                    type="file"
                    id={`update-${article.id}`}
                    onChange={(e) => handleFileUpload(e, article.id)}
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`update-${article.id}`} className="upload-button">
                    Încarcă versiune nouă
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorView;