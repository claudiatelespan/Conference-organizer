import React, { useState } from "react";

const OrganizerView = ({ conference, articles }) => {

  const filteredArticles = articles.filter(
    (article) => article.conferenceId === conference.id
  );

  // Funcție pentru a descărca fișierul unui articol
  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop(); // Numele fișierului din URL
    link.click();
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
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div key={article.id} className="article-item">
              <h3>{article.title}</h3>
              <button
                onClick={() => handleDownload(article.fileUrl)}
              >
                Descarcă articol
              </button>
              <p><strong>Autor:</strong> {article.author}</p>
              <p><strong>Status:</strong> {article.status}</p>
              <p><strong>Review-uri:</strong></p>
              <ul>
                {article.reviews.length > 0 ? (
                  article.reviews.map((review, index) => (
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
