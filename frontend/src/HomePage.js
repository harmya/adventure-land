import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './homepage.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;
    const [gotStoryOptions, setGotStoryOptions] = useState(false);
    const [storyOptions, setStoryOptions] = useState([]);
    const [finishedStoryOption, setFinishedStoryOption] = useState(false);

    const getStoryOptions = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/stories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
        .then(data => {
            setStoryOptions(data);
            console.log(storyOptions);
            setGotStoryOptions(true);
        })
        .catch(error => {console.log(error);});
    }

    const handleStoryOption = async (event) => {
        if (event.key === 'Enter') {
            const location = event.target.value;
            navigate('/story', {state: {username: username, location: location}});
        }
    }

    const finishedStoryOptionFunc = () => {
        setFinishedStoryOption(true);
    }

    const changePassword = () => {
        navigate('/changepassword', {state: {username: username}});
    }

  return (
    <div className="homepage">
        <div className="top-bar">
            <button className="change-password-button" onClick={changePassword}>Change Password</button>
            <button className="change-password-button" onClick={() => navigate('/viewhistory', {state: {username: username}})}>View History</button>
        </div>
        <h1>
            <ReactTyped 
            strings={['Hello ' + username + '!']}
            typeSpeed={40}
            showCursor={false}
            onComplete={getStoryOptions}
            />
        </h1>
        <h2 className='story-options-heading'>
        <ReactTyped 
            strings={['Choose a location to start your story.']}
            typeSpeed={20}
            showCursor={false}
        />
        </h2>
        <div className="story-options" style={{display: gotStoryOptions ? 'block' : 'none'}}>
            <ul style={{listStyleType: 'None'}}>
                {storyOptions.map((story) => (
                    <li style={{fontSize: '1.5rem'}}>
                        <ReactTyped 
                            strings={[story]}
                            typeSpeed={40}
                            showCursor={false}
                            onComplete={finishedStoryOptionFunc}
                        />
                    </li>
                ))}
            </ul>
            <input className="location-input" type="text" ref={input => input && input.focus()} onKeyDown={handleStoryOption} style={{display: finishedStoryOption ? 'block' : 'none'}}/>
        </div>
    </div>
  );

}

export default HomePage;