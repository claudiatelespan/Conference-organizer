import React, { useState } from "react";

const OrganizerView = ({ conference }) => {
  const mockArticles = [
    {
      id: 1,
      title: "Articol despre React",
      author: "Autor 1",
      status: "pending",
      reviews: [
        { reviewer: "Reviewer 1", feedback: "Foarte bine", approved: false },
        { reviewer: "Reviewer 2", feedback: "Necesită îmbunătățiri", approved: false },
      ],
    },
    {
      id: 2,
      title: "Articol despre Inteligență Artificială",
      author: "Autor 2",
      status: "accepted",
      reviews: [
        { reviewer: "Reviewer 1", feedback: "Excelent!", approved: true },
        { reviewer: "Reviewer 2", feedback: "Aprobat!", approved: true },
      ],
    },
  ];

  const [articles, setArticles] = useState(mockArticles);

  // Funcție pentru a reseta statusul unui articol (în cazul unui upload nou)
  const handleResetStatus = (articleId) => {
    const updatedArticles = articles.map((article) =>
      article.id === articleId
        ? { ...article, status: "pending", reviews: [] }
        : article
    );
    setArticles(updatedArticles);
  };

  return (
    <div>
      <h2>Detalii conferință: {conference.title}</h2>
      <div className="article-list">
        {articles.map((article) => (
          <div key={article.id} className="article-item">
            <h3>{article.title}</h3>
            <p><strong>Autor:</strong> {article.author}</p>
            <p><strong>Status:</strong> {article.status}</p>
            <p><strong>Review-uri:</strong></p>
            <ul>
              {article.reviews.length > 0 ? (
                article.reviews.map((review, index) => (
                  <li key={index}>
                    <strong>{review.reviewer}:</strong> {review.feedback} -{" "}
                    {review.approved ? "Aprobat" : "În așteptare"}
                  </li>
                ))
              ) : (
                <li>Niciun review încă.</li>
              )}
            </ul>
            <button onClick={() => handleResetStatus(article.id)}>
              Resetează evaluarea
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerView;
