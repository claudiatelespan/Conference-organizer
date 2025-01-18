import './App.css';
import Sidebar from './components/Sidebar.js';
import React, { useState } from "react";
import OrganizerView from "./components/OrganizerView.js";
import AuthorView from "./components/AuthorView.js";
import ReviewerView from "./components/ReviewerView.js";

const App = () => {
  const userRole = "organizer";
  const reviewerId = 1;
  const authorId = 1;

  const [conferences, setConferences] = useState([
    {
      id: 1,
      title: "Conferința Internațională de Tehnologie",
      description: "Detalii despre conferința 1",
      date: "2025-01-20",
      reviewers: [{ id: 1, name: "Reviewer 1" }, { id: 2, name: "Reviewer 2" }],
    },
    {
      id: 2,
      title: "Conferința de Inteligență Artificială",
      description: "Detalii despre conferința 2",
      date: "2025-03-15",
      reviewers: [{ id: 3, name: "Reviewer 3" }],
    }
  ]);

  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Article 1",
      author: "Author 1",
      feedback: "Needs more citations",
      status: "pending",
      reviewerId: 101,
      conferenceId: 1,
    },
    {
      id: 2,
      title: "Article 2",
      author: "Author 2",
      feedback: "",
      status: "pending",
      reviewerId: 102,
      conferenceId: 1,
    },
  ]);

  const [selectedConference, setSelectedConference] = useState(null);
  const [registeredConferences, setRegisteredConferences] = useState([]);

  const handleAddConference = (newConference) => {
    setConferences((prevConferences) => [...prevConferences, newConference]);
  };

  const handleConferenceSelect = (conferenceId) => {
    const conference = conferences.find((conf) => conf.id === conferenceId);
    setSelectedConference(conference);
  };

  const handleUpdateReview = (articleId, reviewerId, updates) => {
    setArticles(prevArticles => 
      prevArticles.map(article => {
        if (article.id === articleId) {
          const updatedReviews = article.reviews.map(review => 
            review.reviewerId === reviewerId 
              ? { ...review, ...updates }
              : review
          );
          return { ...article, reviews: updatedReviews };
        }
        return article;
      })
    );
  };

  const handleRegisterToConference = (conferenceId) => {
    setRegisteredConferences(prev => [...prev, conferenceId]);
  };

  const handleArticleUpload = (conferenceId, articleData) => {
    // Alocă random 2 revieweri din conferința selectată
    const conference = conferences.find(c => c.id === conferenceId);
    const availableReviewers = conference.reviewers;
    const selectedReviewers = availableReviewers
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const newArticle = {
      id: articles.length + 1,
      conferenceId,
      authorId,
      ...articleData,
      status: "pending",
      reviewers: selectedReviewers,
      reviews: selectedReviewers.map(reviewer => ({
        reviewerId: reviewer.id,
        feedback: "",
        approved: false
      })),
      history: []
    };

    setArticles(prev => [...prev, newArticle]);
  };

  return (
    <div className='dashboard-container'>
      <Sidebar
        conferences={conferences}
        onAddConference={handleAddConference}
        onSelectConference={handleConferenceSelect}
        userRole={userRole}
        reviewerId={reviewerId}
        registeredConferences={registeredConferences}
        onRegister={handleRegisterToConference}
      />
      <div className="main-content">
        {userRole === "organizer" && selectedConference && (
          <OrganizerView conference={selectedConference} />
        )}
        {userRole === "author" && (
          <AuthorView
            selectedConference={selectedConference}
            isRegistered={selectedConference ? registeredConferences.includes(selectedConference.id) : false}
            articles={articles.filter(a => a.authorId === authorId && a.conferenceId === selectedConference?.id)}
            onRegister={() => handleRegisterToConference(selectedConference?.id)}
            onUploadArticle={handleArticleUpload}
          />
        )}
        {userRole === "reviewer" && selectedConference && (
          <ReviewerView
            selectedConference={selectedConference}
            articles={articles}
            reviewerId={reviewerId}
            onUpdateReview={handleUpdateReview}
          />
        )}
        {!selectedConference && (
          <p>Please select a conference to view details.</p>
        )}
      </div>
    </div>
  );
};

export default App;
