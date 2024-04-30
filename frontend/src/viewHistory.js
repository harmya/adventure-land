import './password.css';
import {useState} from 'react';
import { useLocation } from 'react-router-dom';
import { ReactTyped } from 'react-typed';

function ViewHistory() {
    const location = useLocation();
    const username = location.state.username;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [history, setHistory] = useState([{}]);
    const [gotHistory, setGotHistory] = useState(false);

    const handleStartDate = (event) => {
        setStartDate(event.target.value);
    }
    const handleEndDate = (event) => {
        setEndDate(event.target.value);
    }

    const getHistory = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/history?username=' + username + '&rangeStart=' + startDate + '&rangeEnd=' + endDate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({startDate: startDate, endDate: endDate})
        }).then(response => response.json())
        .then(data => {
            setHistory(data);
            setGotHistory(true);
            console.log(data);
        })
        .catch(error => {console.log(error);});

        console.log(history);
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
        {gotHistory && <ul>
            {history.map((item, index) => (
                <li key={index}>{`Location: ${item.location}, Date: ${new Date(item.timestamp).toLocaleString()}`}</li>
            ))}
        </ul>}
    </div>
  );

}
export default ViewHistory;