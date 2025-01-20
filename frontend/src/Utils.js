export const handleDownload = (fileName) => {
    const baseUrl = "http://localhost:1234/uploads"; // Backend-ul tău
    const fullUrl = `${baseUrl}/${fileName}`;
  
    // Deschide URL-ul în browser pentru descărcare
    window.open(fullUrl, "_blank");
  };