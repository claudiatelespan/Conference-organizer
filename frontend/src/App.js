import './App.css';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar.js';
import React, { useState, useEffect } from "react";
import OrganizerView from "./components/OrganizerView.js";
import AuthorView from "./components/AuthorView.js";
import ReviewerView from "./components/ReviewerView.js";
import { fetchConferences, loginUser, fetchArticlesByConference } from "./Api.js";


const App = () => {
  const userRole = "author";
  const reviewerId = 1;
  const authorId = 1;

  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // const hardcodedUser = {
  //   email: "reviewer1@example.com",  
  //   password: "password123",
  //   role: "reviewer",
  //   id: 1
  // };

  // const hardcodedUser2 = {
  //   email: "author1@example.com",  
  //   password: "password123",
  //   role: "author",
  //   id: 1
  // };

  // const hardcodedUser3 = {
  //   email: "organizer1@example.com",  
  //   password: "password123",
  //   role: "organizer",
  //   id: 1
  // };

  const [conferences, setConferences] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConferences = async () => {
      try {
        const data = await fetchConferences();
        setConferences(data); // Actualizează lista de conferințe
      } catch (error) {
        setError("Failed to load conferences. Please try again later.");
      }
    };

    if (isAuthenticated)
      loadConferences();
  }, [isAuthenticated]);

  const [articles, setArticles] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const [registeredConferences, setRegisteredConferences] = useState([]);

  const handleAddConference = (newConference) => {
    setConferences((prevConferences) => [...prevConferences, newConference]);
  };

  const handleConferenceSelect = async (conferenceId) => {
    const conference = conferences.find((conf) => conf.id === conferenceId);
    setSelectedConference(conference);
    try {
      const articlesData = await fetchArticlesByConference(conferenceId);
      setArticles(articlesData);
    } catch (error) {
      setError("Failed to load articles. Please try again later.");
    }
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

  const handleArticleUpload = (conferenceId, articleData, existingArticleId = null) => {
    if (existingArticleId) {
      // Update existing article
      setArticles(prevArticles => 
        prevArticles.map(article => {
          if (article.id === existingArticleId) {
            return {
              ...article,
              ...articleData,
              reviews: article.reviews // Keeping existing reviews
            };
          }
          return article;
        })
      );
    } else {
      // Create new article
      const conference = conferences.find(c => c.id === conferenceId);
      const selectedReviewers = conference.reviewers;

      const newArticle = {
        id: articles.length + 1,
        conferenceId,
        authorId,
        ...articleData,
        status: "pending",
        reviews: selectedReviewers.map(reviewer => ({
          reviewerId: reviewer.id,
          feedback: "",
          approved: false
        }))
      };

      setArticles(prev => [...prev, newArticle]);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      const { token, user } = data.data;
  
      // Stochează token-ul în localStorage pentru autentificare ulterioară
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user.id)
  
      // Actualizează starea
      setIsAuthenticated(true);
      setCurrentUser(user);
  
      alert(`Autentificat cu succes ca ${user.role}`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
  <div className='dashboard-container'>
    {!isAuthenticated ? (
      <div className="full-width-container">
        <LoginView onLogin={handleLogin} />
      </div>
    ) : (
      <>
        <Sidebar
          conferences={conferences}
          onAddConference={handleAddConference}
          onSelectConference={handleConferenceSelect}
          userRole={currentUser.role}
          reviewerId={currentUser.id}
          registeredConferences={registeredConferences}
          onRegister={handleRegisterToConference}
        />
        <div className="main-content">
          {currentUser.role === "organizer" && selectedConference && (
            <OrganizerView conference={selectedConference} articles={articles} />
          )}
          {currentUser.role === "author" && (
            <AuthorView
              selectedConference={selectedConference}
              isRegistered={selectedConference ? registeredConferences.includes(selectedConference.id) : false}
              articles={articles.filter(a => a.authorId === currentUser.id && a.conferenceId === selectedConference?.id)}
              onRegister={() => handleRegisterToConference(selectedConference?.id)}
              onUploadArticle={handleArticleUpload}
            />
          )}
          {currentUser.role === "reviewer" && selectedConference && (
            <ReviewerView
              selectedConference={selectedConference}
              articles={articles}
              reviewerId={currentUser.id}
              onUpdateReview={handleUpdateReview}
            />
          )}
          {!selectedConference && (
            <p>Please select a conference to view details.</p>
          )}
        </div>
      </>
  )}
</div>
);
};


export default App;
