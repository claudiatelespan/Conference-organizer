import React, { useState } from "react";

const OrganizerView = ({ conference, articles }) => {

  const filteredArticles = articles;

  // Funcție pentru a descărca fișierul unui articol
  const handleDownload = (fileName) => {
    const baseUrl = "http://localhost:1234/uploads"; // Backend-ul tău
    const fullUrl = `${baseUrl}/${fileName}`;
  
    // Deschide URL-ul în browser pentru descărcare
    window.open(fullUrl, "_blank");
  };

  // Funcție pentru a reseta statusul unui articol (în cazul unui upload nou)
  // const handleResetStatus = (articleId) => {
  //   const updatedArticles = articles.map((article) =>
  //     article.id === articleId
  //       ? { ...article, status: "pending", reviews: [] }
  //       : article
  //   );
  //   setArticles(updatedArticles);
  // };

  return (
    <div>
      <h2>Detalii conferință: {conference.title}</h2>
      <div className="article-list">
        {filteredArticles?.length > 0 ? (
          filteredArticles?.map((article) => (
            <div key={article.id} className="article-item">
              <h3>{article.title}</h3>
              <button
                onClick={() => handleDownload(article.filePath)}
              >
                Descarcă articol
              </button>
              <p><strong>Autor:</strong> {article.author}</p>
              <p><strong>Status:</strong> {article.status}</p>
              <p><strong>Review-uri:</strong></p>
              <ul>
                {article?.reviews?.length > 0 ? (
                  article?.reviews.map((review, index) => (
                    <li key={index}>
                      <strong>{review.reviewerId}:</strong> {review.feedback} -{" "}
                      {review.approved ? "Aprobat" : "În așteptare"}
                    </li>
                  ))
                ) : (
                  <li>Niciun review încă.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>Niciun articol pentru această conferință.</p>
        )}
      </div>
    </div>
  );
};

export default OrganizerView;
