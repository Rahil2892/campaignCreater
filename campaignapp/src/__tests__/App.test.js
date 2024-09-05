import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Correct import
import App from '../App';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

test('renders the form and uploads a CSV file', async () => {
  render(<App />);

  // Check if form elements are rendered
  expect(screen.getByText('Campaign Title')).toBeInTheDocument();
  expect(screen.getByText('Upload file')).toBeInTheDocument();

  // Simulate entering campaign title and message
  fireEvent.change(screen.getByPlaceholderText(/Green Day/i), { target: { value: 'Test Campaign' } });
  fireEvent.change(screen.getByPlaceholderText(/Leave a comment/i), { target: { value: 'This is a test message' } });

  // Mock file input
  const file = new File(['name,phone\nJohn Doe,1234567890'], 'test.csv', { type: 'text/csv' });
  const fileInput = screen.getByLabelText(/Upload file/i);
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Check if file is processed and parsed
  await screen.findByText('John Doe');  // Expect parsed data to appear in the table

  // Mock the fetch call on form submission
  fetch.mockResponseOnce(JSON.stringify({}));

  // Submit form
  fireEvent.click(screen.getByText(/Submit/i));

  // Check if the fetch call was made
  expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/saveCampaign', expect.any(Object));
});
