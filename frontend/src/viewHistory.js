import './password.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from 'react-typed';

function ViewHistory() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDate = (event) => {
        setStartDate(event.target.value);
    }
    const handleEndDate = (event) => {
        setEndDate(event.target.value);
    }

    const getHistory = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({startDate: startDate, endDate: endDate})
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {console.log(error);});
    }

  return (
    <div className="password">
        <h1>
            <ReactTyped 
            strings={['View History']}
            typeSpeed={40}
            showCursor={false}
            />
        </h1>
        <input type="date" onChange={handleStartDate} placeholder="Enter Start Date"></input>
        <br></br>
        <input type="date" onChange={handleEndDate} placeholder="Enter End Date"></input>
        <br></br>
        <button onClick={getHistory}>Get History</button>
    </div>
  );

}
export default ViewHistory;