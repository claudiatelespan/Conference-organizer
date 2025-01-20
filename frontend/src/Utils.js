export const handleDownload = (fileName) => {
    const baseUrl = "http://localhost:1234/uploads"; // Backend-ul tău
    const fullUrl = `${baseUrl}/${fileName}`;
  
    // Deschide URL-ul în browser pentru descărcare
    window.open(fullUrl, "_blank");
  };

export function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

export function formatDateToDayOnly(dateString) {
  const date = new Date(dateString); // Convertim stringul într-un obiect Date
  const day = date.getUTCDate().toString().padStart(2, '0'); // Ziua cu două cifre
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Luna cu două cifre
  const year = date.getUTCFullYear(); // Anul
  
  return `${year}-${month}-${day}`; // Formatul final: YYYY-MM-DD
}