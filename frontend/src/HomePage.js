import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './homepage.css';
import {useState} from 'react';

function HomePage() {
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
            console.log(location);
        }
    }

    const finishedStoryOptionFunc = () => {
        setFinishedStoryOption(true);
    }

  return (
    <div className="homepage">
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
                            onComplete={finshedStoryOption}
                        />
                    </li>
                ))}
            </ul>
            <input className="location-input" type="text" ref={input => input && input.focus()} onKeyDown={handleStoryOption} />
        </div>

    </div>
  );

}

export default HomePage;