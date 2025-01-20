import './App.css';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar.js';
import React, { useState, useEffect } from "react";
import OrganizerView from "./components/OrganizerView.js";
import AuthorView from "./components/AuthorView.js";
import ReviewerView from "./components/ReviewerView.js";
import { fetchConferences, loginUser, fetchArticlesByConference, registerAuthorToConference } from "./Api.js";


const App = () => {
  const userRole = "author";
  const reviewerId = 1;
  const authorId = 1;

  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [conferences, setConferences] = useState([]);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const [registeredConferences, setRegisteredConferences] = useState([]);

  useEffect(() => {
    const loadConferences = async () => {
      try {
        // Obține userId din localStorage
        const userId = parseInt(localStorage.getItem("userId"), 10);
  
        // Fetch pentru toate conferințele
        const data = await fetchConferences();
  
        // Filtrăm conferințele la care utilizatorul este autor
        const userRegisteredConferences = data.filter(conference =>
          conference.authors?.some(author => author.id === userId)
        );
  
        // Actualizăm stările
        setConferences(data); // Lista completă de conferințe
        setRegisteredConferences(userRegisteredConferences.map(conf => conf.id)); // ID-urile conferințelor înregistrate
      } catch (error) {
        console.error("Error loading conferences:", error);
        setError("Failed to load conferences. Please try again later.");
      }
    };
  
    // Se apelează doar dacă utilizatorul este autentificat
    if (isAuthenticated) {
      loadConferences();
    }
  }, [isAuthenticated]);

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

  const handleRegisterToConference = async (conferenceId) => {
    try {
      await registerAuthorToConference(currentUser.id, conferenceId);
  
      setRegisteredConferences((prev) => [...prev, conferenceId]);
  
      alert("Te-ai înscris cu succes la conferință!");
    } catch (error) {
      alert(error.message || "Eroare la înscrierea la conferință.");
    }
  };

  const handleArticleUpload = (conferenceId, articleData, existingArticleId = null) => {
    if (existingArticleId) {
      setArticles(prevArticles => 
        prevArticles.map(article => {
          if (article.id === existingArticleId) {
            return {
              ...article,
              ...articleData,
              reviews: article.reviews 
            };
          }
          return article;
        })
      );
    } else {
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
  
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user.id)
  
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
