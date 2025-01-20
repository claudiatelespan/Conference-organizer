const API_BASE_URL = "http://localhost:1234/api";

// preia toate conferințele

export const fetchConferences = async () => {
    try {
      const token = localStorage.getItem("authToken"); 
  
      if (!token) {
        throw new Error("JWT token not found. Please login first.");
      }
  
      const response = await fetch(`${API_BASE_URL}/conferences/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch conferences");
      }
  
      const result = await response.json();
      return result.data; 
    } catch (error) {
      console.error("Error in fetchConferences:", error);
      throw error;
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
  
  //reviewers
export const fetchReviewers = async () => {
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        throw new Error("JWT token not found. Please login first.");
      }
  
      const response = await fetch(`${API_BASE_URL}/users/getAllReviewers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch reviewers");
      }
  
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error in fetchReviewers:", error);
      throw error; 
    }
};

//creare conferinta

export const createConference = async (conferenceData) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("JWT token not found. Please login first.");
    }

    const response = await fetch(`${API_BASE_URL}/conferences/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(conferenceData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Eroare la crearea conferinței");
    }

    return result;

  } catch (error) {
    console.error("Error in createConference:", error);
    throw error; 
  }
};

//ia articole pt selectare conferinta

export const fetchArticlesByConference = async (conferenceId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/articles/getAllArticlesPerConference/${conferenceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch articles');
    }

    const data = await response.json();
    console.log(data.articles);
    return data.articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

//inscrie un autor la conferinta

export const registerAuthorToConference = async (authorId, conferenceId) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("JWT token not found. Please login first.");
    }

    const response = await fetch(`${API_BASE_URL}/conferenceRegistration/joinConference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ authorId, conferenceId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Eroare la înregistrarea la conferință");
    }

    return result;

  } catch (error) {
    console.error("Error in registerAuthorToConference:", error);
    throw error; 
  }
};


//upload articole

export const uploadArticle = async (conferenceId, articleData, file, existingArticleId = null) => {
  try {
    const formData = new FormData();
    formData.append("conferenceId", conferenceId);
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("title", articleData.title);
    formData.append("file", file);
    if (existingArticleId) {
      formData.append('articleId', existingArticleId);
    }

    const response = await fetch(`${API_BASE_URL}/articles/${existingArticleId || 'upload'}`, {
      method: existingArticleId ? 'PUT' : 'POST',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload article.");
    }

    const result = await response.json();

    return result.article;
  } catch (error) {
    console.error("Error uploading article:", error);
    throw error;
  }
};
