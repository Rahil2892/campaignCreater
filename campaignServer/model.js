const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    parsedData: [{
      type: Map,
      of: String,  // or use Mixed if the value types can vary
      default: {}
    }],
  });
    
const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;