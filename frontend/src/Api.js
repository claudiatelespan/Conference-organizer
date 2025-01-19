
const API_BASE_URL = "http://localhost:1234/api";

// Funcție pentru a prelua toate conferințele

export const fetchConferences = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Preluăm JWT-ul din localStorage
  
      if (!token) {
        throw new Error("JWT token not found. Please login first.");
      }
  
      const response = await fetch(`${API_BASE_URL}/conferences/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Adăugăm header-ul Authorization
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch conferences");
      }
  
      const result = await response.json();
      console.log(result);
      return result.data; // Returnează doar datele necesare
    } catch (error) {
      console.error("Error in fetchConferences:", error);
      throw error; // Aruncă eroarea pentru a putea fi tratată în componentă
    }
  };


// login
export const loginUser = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Eroare la login.");
      }
      return data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
  

  //register
  export const registerUser = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Eroare la înregistrare.");
      }
  
      return data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
  