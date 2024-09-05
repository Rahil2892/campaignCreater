const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Import the express app
const Campaign = require('../model'); // Ensure the Campaign model is imported

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log('MongoMemoryServer URI:', uri); // Log URI to verify in-memory DB

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase(); // Clean up database after each test
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop(); // Stop in-memory server
});

describe('POST /api/saveCampaign', () => {
  it('should save a new campaign and return 201 status', async () => {
    const campaignData = {
      title: "Test Campaign",
      message: "This is a test message",
      parsedData: [
        { Name: "John Doe", "Phone Number": "1234567890", status: "Pending" },
        { Name: "Jane Smith", "Phone Number": "0987654321", status: "Pending" }
      ]
    };

    const response = await request(app)
      .post('/api/saveCampaign')
      .send(campaignData)
      .expect(201); // Expect 201 Created

    // Verify the campaign is saved in the database
    const campaign = await Campaign.findOne({ title: "Test Campaign" });
    expect(campaign).not.toBeNull();
    expect(campaign.parsedData.length).toBe(2);
    expect(campaign.message).toBe("This is a test message");
  });
});
