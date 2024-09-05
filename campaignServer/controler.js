const Campaign = require('./model');

const addData = async (req, res) => {
    const { title, message, parsedData } = req.body;
  
    try {
      const existingCampaign = await Campaign.findOne({ title });
  
      if (existingCampaign) {
        existingCampaign.message = message;
        existingCampaign.parsedData = parsedData;
        await existingCampaign.save();
        res.status(200).send('Campaign updated successfully');
      } else {
        const newCampaign = new Campaign({
          title,
          message,
          parsedData,
        });
        await newCampaign.save();
        res.status(201).send('Campaign saved successfully');
      }
    } catch (error) {
      console.error('Error saving/updating campaign:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };

  module.exports = addData;