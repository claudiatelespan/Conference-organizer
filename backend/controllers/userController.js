const userModel = require('../models/index').user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');


dotenv.config();


exports.login = async (req, res) => {

    try{
        const {email, password} = req.body;

        const user = await userModel.findOne({
            where: {
                email: email
            }
        });
    
        if(!user){
            return res.status(404).send({message:"user not found", success: false});
        }
    
        const validPassword = bcrypt.compareSync(password, user.password);
    
        if(!validPassword) {
            return res.status(401).send({success:false, message:"Invalid password"});
        }
    
        const token = jwt.sign({id: user.id}, process.env.SECRET_TOKEN, {expiresIn:'1h'});
    
        res.status(200).send({success:true, message:"user found", data: {token, user}});
    
    } catch(error) {
        console.error(error)
        res.status(500).send({message:"server error"});
    }

};

exports.register = async (req, res) => {
    
    try{
        const {email, password, role} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send('invalid email format');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const validRoles = ['author', 'reviewer', 'organizer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Rol invalid"
            });
        }

        const existingUser = await userModel.findOne({
            where: {email: email}
        });
      
        if(existingUser){
            return res.status(400).send("user deja existent cu acest email");
        }
       
        const user = await userModel.create({
            email: email,
            password: hashedPassword,
            role: role
        });

        res.status(201).send({message:"user created successfully", data:{user}});
    } catch(error)
    {console.error(error)
        res.status(500).send('internal server error');
       
    }
}

