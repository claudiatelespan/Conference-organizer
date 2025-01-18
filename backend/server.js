const express = require('express');
const sequelize = require('./config/database');
const {connection} = require('./models/index');
const router = require('./routes/index');
const app = express();
app.use(express.json());

app.use('/api', router);

const PORT = 1234;

app.get('/', (req,res) => {
    res.send('Hello ai pornit serverul');
})

const resetDatabase = async (req,res) => {
    try{
        await connection.sync({force:true});
        res.status(201).send({
            message: "Reset complete!"
        });
    } catch (error) {
        console.error("error reseting database: ", error);
        res.status(500).send({
            message: "Internal server error"
        });
    }  
};

app.get('/reset-database', resetDatabase);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


