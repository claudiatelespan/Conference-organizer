# Conference-organizer

Studenti participanti:
- Banciu Diana Elena
- Stroe Ioana Ruxandra
- Teleșpan Claudia Ioana

Ghid proiect:

1. Clonați proiectul într-un folder dedicat și accesați-l, utilizând comenzile în Git Bash:

git clone https://github.com/claudiatelespan/Conference-organizer.git
cd Conference-organizer/
code . 

2. Deschideți o aplicație de gestiune a bazelor de date MySQL (noi am folosit Laragon) și creați o bază de date numită “tehnologiiWeb”.

3. Deschideți un terminal în VS Code, unde instalață modulele necesare și porniți serverul, utilizând comenzile:

cd .\backend\
npm install
node server.js

Serverul funcționează pe portul 1234.
Pentru a crea tabelele necesare în baza de date, accesați ruta: "http://localhost:1234/reset-database"


4. Deschideți un terminal în VS Code, unde porniți aplicația, folosind:

cd .\frontend\
npm install
npm start

