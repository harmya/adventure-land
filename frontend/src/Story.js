import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './story.css';
import {useState} from 'react';

function Story() {
    const location = useLocation();
    const storyLocation = location.state.location
    const [firstStoryPrompt, setfirstStoryPrompt] = useState('');
    
    const getInitialStory = async () => {
        console.log(storyLocation);
        const response = await fetch('http://127.0.0.1:5000/api/story/first?location=' + storyLocation, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            setfirstStoryPrompt(data['prompt']);
        })
        .catch(error => {console.log(error);});
    }

    return (
        <div className="story">
            <h1>
                <ReactTyped 
                strings={["Once upon a time in {}...".replace("{}", storyLocation)]}
                typeSpeed={40}
                showCursor={false}
                onComplete={getInitialStory}
                />
            </h1>
            <p>
                <ReactTyped 
                strings={["{}".replace("{}", firstStoryPrompt)]}
                typeSpeed={20}
                showCursor={false}
                />
            </p>
        </div>
    );
}

export default Story;
    