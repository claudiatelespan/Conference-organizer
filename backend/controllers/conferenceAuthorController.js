const ConferenceModel = require("../models/ConferenceModel");

const userModel = require("../models").user;
const conferenceModel = require("../models").conference
const conferenceAuthorModel = require("../models").conferenceAuthor

const authorJoinConference = async (req, res) => {
    const { authorId, conferenceId } = req.body;
    
    try {
      const user = await userModel.findOne({
        where: {
          id: authorId,
          role: 'author'
        }
      });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found or is not an author'
        });
      }
  
      
      const conference = await conferenceModel.findByPk(conferenceId);
      if (!conference) {
        return res.status(404).json({
          success: false,
          message: 'Conference not found'
        });
      }
  
    
      const existingRegistration = await conferenceAuthorModel.findOne({
        where: {
          authorId: authorId,
          conferenceId: conferenceId
        }
      });
  
      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message: 'Author is already registered for this conference'
        });
      }
  
      await conferenceAuthorModel.create({
        authorId: authorId,
        conferenceId: conferenceId
      });
  
      res.status(201).json({
        success: true,
        message: 'Author successfully registered for conference'
      });
  
    } catch (error) {
      console.error('Error registering author for conference:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

module.exports = {
    authorJoinConference
};
