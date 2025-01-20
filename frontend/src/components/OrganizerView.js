import React, { useState } from "react";
import { handleDownload, toTitleCase } from "../Utils.js";
import "../App.css";

const OrganizerView = ({ conference, articles }) => {

  const filteredArticles = articles;

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
              <button className="download"
                onClick={() => handleDownload(article.filePath)}
              >
                Descarcă articol
              </button>
              <p><strong>Autor:</strong> {article.author}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status ${article.status ==='accepted' ? 'approved' : 'pending'}`}>
                  {toTitleCase(article.status)}
                </span>
              </p>
              <p><strong>Review-uri:</strong></p>
              <ul>
                {article?.reviews?.length > 0 ? (
                  article?.reviews.map((review, index) => (
                    <li key={index}>
                      <strong>{review.reviewer.email}:</strong> {review.feedback} -{" "}
                      {toTitleCase(review.status)}
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
