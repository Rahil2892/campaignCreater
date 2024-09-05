import { useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  const [campaignData, setCampaignData]= useState({
    title: "",
    message: ""
  });

  const [messageState, setMessageState] = useState([]);

  const {title, message} = campaignData;  

  const onChange = (e) => {
    e.preventDefault();
    setCampaignData({
      ...campaignData,
      [e.target.name] : e.target.value,
    });
  };

  // State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  // State to store the values
  const [values, setValues] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const changeHandler = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    if (file) {
      const fileType = file.type;
      if (fileType !== "text/csv") {
        setFileError("Please upload a CSV file.");
        alert("Please upload a CSV file.");
      } else {
        setFileError("");
        // Parsing the CSV file using Papa.parse
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            const rowsArray = [];
            const valuesArray = [];
            const initialMessageState = [];
            
            console.log(results.data); // Check the parsed data
  
            // Dynamically mapping the data
            const formattedData = results.data.map((d) => {
              // Capture all columns dynamically
              let dataObj = { status: "Pending" };
              for (const [key, value] of Object.entries(d)) {
                dataObj[key] = value;
              }
              return dataObj;
            });
  
            setParsedData(formattedData);
  
            results.data.forEach((d) => {
              rowsArray.push(Object.keys(d));
              valuesArray.push(Object.values(d));
              initialMessageState.push("Pending");
            });
  
            // Filtered Column Names
            setTableRows(rowsArray[0]);
  
            // Filtered Values
            setValues(valuesArray);
  
            // Initialize messageState with Pending status
            setMessageState(initialMessageState);
          },
        });
      }
    }
  };
  
  

  const sendMessage = (num, index) => {
    let number = num.replace(/[^\w\s]/gi, "").replace(/ /g, "");
    let url = `https://web.whatsapp.com/send?phone=${number}`;
    url += `&text=${encodeURI(title + ' ' + message)}&app_absent=0`;
  
    try {
      window.open(url);
  
      // Update status to "Success"
      setMessageState((prevState) => {
        const newState = [...prevState];
        newState[index] = "Success";
        return newState;
      });
  
      // Update parsedData directly
      setParsedData((prevState) => {
        const newParsedData = [...prevState];
        newParsedData[index].status = "Success";
        return newParsedData;
      });
    } catch (error) {
      // Update status to "Failed"
      setMessageState((prevState) => {
        const newState = [...prevState];
        newState[index] = "Failed";
        return newState;
      });
  
      // Update parsedData directly
      setParsedData((prevState) => {
        const newParsedData = [...prevState];
        newParsedData[index].status = "Failed";
        return newParsedData;
      });
    }
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (fileError || !selectedFile) {
      alert("Please upload a CSV file.");
    } else {
      try {
        console.log('Parsed Data to be sent:', parsedData);  // Log the parsed data
  
        const response = await fetch('http://localhost:5000/api/saveCampaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            message,
            parsedData,
          }),
        });
  
        if (response.ok) {
          console.log('Data saved to MongoDB');
        } else {
          console.error('Failed to save data to MongoDB');
        }
  
        values.forEach((value, index) => {
          sendMessage(value[0], index);
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  
  
  

  return (
    <div className="App">
      <div className="w-full min-h-screen bg-slate-600 items-center justify-center flex flex-col p-2">
        <form
          className="flex flex-col w-2/3 md:w-1/4 bg-slate-300 rounded-lg m-4 px-4 py-12 gap-1"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="website-admin"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Campaign Title
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-calendar"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
              </svg>
            </span>
            <input
              type="text"
              id="website-admin"
              name="title"
              className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Green Day"
              onChange={onChange}
            />
          </div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Your message
          </label>
          <textarea
            id="message"
            rows="4"
            name="message"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Leave a comment..."
            onChange={onChange}
          ></textarea>
          <label
            className="block mb-2 text-sm font-medium text-gray-900"
            htmlFor="user_avatar"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            type="file"
            name="file"
            accept=".csv"
            onChange={changeHandler}
          />
          <button type="submit" className="bg-white text-black m-1 w-1/2">
            Submit
          </button>
        </form>

        {values.length > 0 && (
        <table className="text-white">
          <thead>
            <tr>
              {tableRows.map((rows, index) => (
                <th key={index}>{rows}</th>
              ))}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {values.map((value, index) => (
              <tr key={index}>
                {value.map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
                <td>{messageState[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
}

export default App;
