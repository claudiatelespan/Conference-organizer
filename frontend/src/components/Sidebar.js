import React, { useState , useEffect} from "react";
import { fetchReviewers, createConference } from "../Api.js"
import "../App.css";

const Sidebar = ({ conferences, onAddConference, onSelectConference, userRole,reviewerId,
  registeredConferences, onRegister
  }) => {
    // const mockReviewers = [
    //   { id: 1, name: "Reviewer 1" },
    //   { id: 2, name: "Reviewer 2" },
    //   { id: 3, name: "Reviewer 3" },
    // ]; // Mock pentru lista de revieweri
  
    const [reviewers, setReviewers] = useState([]); 
    const [showForm, setShowForm] = useState(false);
    const [newConference, setNewConference] = useState({
      title: "",
      description: "",
      date: "",
      reviewers: [],
    });
  
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'registered'
    const [selectedReviewer, setSelectedReviewer] = useState("");
    const [error, setError] = useState("");
  

    useEffect(() => {
      
      const loadReviewers = async () => {
        try {
          const data = await fetchReviewers();
          setReviewers(data); 
        } catch (error) {
          setError('Eroare la încărcarea reviewerilor');
          console.error(error);
        }
      };
      if(userRole==='organizer')
        loadReviewers(); 
    }, []); 

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewConference({ ...newConference, [name]: value });
    };
  
    const handleAddReviewer = () => {
      if (selectedReviewer) {
        const reviewer = reviewers?.find(
          (rev) => rev.id === parseInt(selectedReviewer)
        );
  
        if (
          reviewer &&
          !newConference.reviewers.some((r) => r.id === reviewer.id)
        ) {
          setNewConference({
            ...newConference,
            reviewers: [...newConference.reviewers, reviewer],
          });
          setSelectedReviewer("");
          setError("");
        }
      }
    };
  
    const handleRemoveReviewer = (id) => {
      setNewConference({
        ...newConference,
        reviewers: newConference.reviewers.filter((rev) => rev.id !== id),
      });
    };
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
    
      if (newConference.reviewers.length !== 2) {
        setError("Trebuie să adaugi exact 2 revieweri!");
        return;
      }
    
      try {
        const conferenceData = {
          title: newConference.title,
          description: newConference.description,
          date: newConference.date,
          organizer_id: localStorage.getItem('userId'),
          reviewers: newConference.reviewers.map(reviewer => reviewer.id),
        };
    
        const result = await createConference(conferenceData);
        
        onAddConference(result.conference);
    
        setNewConference({ title: "", description: "", date: "", reviewers: [] });
        setShowForm(false);
    
      } catch (error) {
        setError(error.message || "Eroare la trimiterea datelor către server");
      }
    };
    

    const renderConferences = () => {
      if (userRole === "organizer") {
        return conferences?.map((conf) => (
          <div 
            key={conf.id} 
            className="conference-item"
            onClick={() => onSelectConference(conf.id)}
            style={{ cursor: 'pointer' }}
          >
            <strong>{conf.title}</strong>
            <p>{conf.date}</p>
            <p>
              <strong>Revieweri:</strong>{" "}
              {conf?.reviewers?.map((rev) => rev.name).join(", ")}
            </p>
          </div>
        ));
      }
  
      if (userRole === "reviewer") {
        const assignedConferences = conferences?.filter((conf) =>
          conf.reviewers.some((rev) => rev.id === reviewerId)
        );
      
        return assignedConferences?.map((conf) => (
          <div 
            key={conf.id} 
            className="conference-item"
            onClick={() => onSelectConference(conf.id)}
            style={{ cursor: 'pointer' }}
          >
            <strong>{conf.title}</strong>
            <p>{conf.date}</p>
          </div>
        ));
      }
  
      if (userRole === "author") {
        const conferencesToShow = viewMode === 'registered' 
          ? conferences?.filter(conf => registeredConferences.includes(conf.id))
          : conferences;
  
        return conferencesToShow?.map((conf) => (
          <div key={conf.id} className="conference-item">
            <strong>{conf.title}</strong>
            <p>{conf.description}</p>
            <p>{conf.date}</p>
            {registeredConferences.includes(conf.id) ? (
              <button 
                onClick={() => onSelectConference(conf.id)}
                className="select-button"
              >
                Vizualizează
              </button>
            ) : (
              viewMode === 'all' && (
                <button 
                  onClick={() => onRegister(conf.id)}
                  className="register-button"
                >
                  Înscrie-te
                </button>
              )
            )}
          </div>
        ));
      }
    };
    
  
    return (
      <div className="sidebar">
        <h1>Conferințe</h1>
        {userRole === "organizer" && (
          <button className="add-button" onClick={() => setShowForm(true)}>
            +
          </button>
        )}

        {userRole === "author" && (
        <div className="view-mode-buttons">
          <button 
            className={`view-mode-button ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            Toate conferințele
          </button>
          <button 
            className={`view-mode-button ${viewMode === 'registered' ? 'active' : ''}`}
            onClick={() => setViewMode('registered')}
          >
            Conferințele mele
          </button>
        </div>
        )}


        <div className="conference-list">
        {renderConferences()}
        </div>
  
        {showForm && userRole === "organizer" && (
          <div className="modal">
            <div className="modal-content">
              <h3>Adaugă Conferință</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Titlu:</label>
                  <input
                    type="text"
                    name="title"
                    value={newConference.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descriere:</label>
                  <textarea
                    name="description"
                    value={newConference.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Data:</label>
                  <input
                    type="date"
                    name="date"
                    value={newConference.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Adaugă Revieweri:</label>
                  <div className="reviewer-input">
                    <select
                      value={selectedReviewer}
                      onChange={(e) => setSelectedReviewer(e.target.value)}
                    >
                      <option value="">Selectează un reviewer</option>
                      {reviewers?.map((reviewer) => (
                        <option key={reviewer.id} value={reviewer.id}>
                          {reviewer.email}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddReviewer}
                      className="add-reviewer-button"
                    >
                      Adaugă
                    </button>
                  </div>
                  <ul>
                    {newConference?.reviewers?.map((rev) => (
                      <li key={rev.id}>
                        {rev.email}{" "}
                        <button
                          type="button"
                          onClick={() => handleRemoveReviewer(rev.id)}
                        >
                          Șterge
                        </button>
                      </li>
                    ))}
                  </ul>
                  {error && <p className="error">{error}</p>}
                </div>
                <div className="form-actions">
                  <button type="submit">Salvează</button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Anulează
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

export default Sidebar;
