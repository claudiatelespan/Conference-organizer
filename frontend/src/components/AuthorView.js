import React, { useState } from "react";
import { handleDownload, toTitleCase } from "../Utils.js";
import { uploadArticle } from "../Api.js";
import '../App.css'

const AuthorView = ({ 
  selectedConference, 
  isRegistered, 
  articles, 
  onRegister, 
  onUploadArticle 
}) => {
  
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileUpload = async (event, existingArticleId = null) => {
    let title, file, articleData;

    if (existingArticleId === null){
      event.preventDefault();
      title = event.target[0].value;
      file = event.target[1].files[0];
      if (!file || !title) return;
    
      articleData = {
        title: title,
      };
    }
    else {
      file = event.target.files[0];
      if (!file) return;
    
      articleData = {
        title: file.name,
      };
    }
  
    try {
      const updatedArticle = await uploadArticle(selectedConference.id, articleData, file, existingArticleId);
      console.log("Articol actualizat cu succes:", updatedArticle);
      onUploadArticle(selectedConference.id, articleData, existingArticleId);
      setShowUploadModal(false);
    } catch (error) {
      console.error("Eroare la încărcarea articolului:", error);
    }
  };

  if (!selectedConference) return <p>Selectează o conferință pentru a vedea detalii.</p>;

  return (
    <div className="author-view">
      <h2>Conferință: {selectedConference.title}</h2>
        <div className="articles-section">
          <div className="upload-section">
            <button htmlFor="article-upload" className="upload-button" onClick={() => setShowUploadModal(true)}>
              Încarcă articol nou
            </button>
            {showUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowUploadModal(false)}>&times;</span>
            <h2>Încarcă articol</h2>
            <form onSubmit={handleFileUpload}>
              <div className='form-group'>
                <label>Titlu</label>
                <input
                  type="text"
                  required
                />
              </div>
              <div className="form-group">
                <label>Fișier</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <div className='form-actions'>
                <button type="submit" className='download'>Încarcă</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                  <label htmlFor={`update-${article.id}`} className="upload-button">
                    Încarcă versiune nouă
                  </label>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${article.status ==='accepted' ? 'approved' : 'pending'}`}>
                    {toTitleCase(article.status)}
                  </span>
                </p>                
                <div className="reviews-section">
                  <h4>Review-uri:</h4>
                  {article.reviews?.map((review, idx) => (
                    <div key={idx} className="review">
                      <p><strong>Reviewer {idx + 1}:</strong></p>
                      <p className="reviews-feedback">{review.feedback || 'Niciun feedback încă'}</p>
                      <p>
                         Status: <span className={review.status === 'respins' ? 'rejected' : review.status === 'acceptat' ? 'approved' : ''}>
                         {toTitleCase(review.status)}
                          </span>
                      </p>
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
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default AuthorView;