import React, { useState } from "react";

const AuthorView = ({ 
  selectedConference, 
  isRegistered, 
  articles, 
  onRegister, 
  onUploadArticle 
}) => {
  const [showHistory, setShowHistory] = useState({});
  
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

      if (existingArticleId) {
        // Upload new version
        const existingArticle = articles.find(a => a.id === existingArticleId);
        const updatedArticle = {
          ...articleData,
          history: [...(existingArticle.history || []), {
            ...existingArticle,
            versionDate: new Date().toISOString()
          }]
        };
        onUploadArticle(selectedConference.id, updatedArticle, existingArticleId);
      } else {
        // Upload new article
        onUploadArticle(selectedConference.id, articleData);
      }
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
                  
                  {article.history?.length > 0 && (
                    <button 
                      onClick={() => setShowHistory(prev => ({
                        ...prev, 
                        [article.id]: !prev[article.id]
                      }))}
                      className="history-button"
                    >
                      {showHistory[article.id] ? 'Ascunde istoric' : 'Vezi istoric'}
                    </button>
                  )}
                </div>

                {showHistory[article.id] && article.history?.length > 0 && (
                  <div className="history-section">
                    <h4>Istoric versiuni:</h4>
                    {article.history.map((version, idx) => (
                      <div key={idx} className="version-card">
                        <h5>Versiunea {idx + 1}</h5>
                        <p>Încărcat la: {new Date(version.uploadDate).toLocaleDateString()}</p>
                        <div className="version-reviews">
                          {version.reviews?.map((review, reviewIdx) => (
                            <div key={reviewIdx} className="review">
                              <p><strong>Reviewer {reviewIdx + 1}:</strong></p>
                              <p>{review.feedback}</p>
                              <p>Status: {review.approved ? 'Aprobat' : 'Respins'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorView;