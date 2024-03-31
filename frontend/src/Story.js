import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './story.css';
import {useState} from 'react';

function Story() {
    const location = useLocation();
    const storyLocation = location.state.location
    const [firstStoryPrompt, setfirstStoryPrompt] = useState('');
    const [firstChoice, setFirstChoice] = useState([]);
    const [gotChoices, setGotChoices] = useState(false);
    
    const getInitialStory = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/story/first?location=' + storyLocation, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
        .then(data => {
            setfirstStoryPrompt(data['prompt']);
        })
        .catch(error => {console.log(error);});
    }

    const getFirstChoice = async () => {
        console.log('getting first choice');
        const response = await fetch('http://127.0.0.1:5000/api/story/choices?choice=' + 0, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            setFirstChoice(data['choices']);
            setGotChoices(true);
        })
        .catch(error => {console.log(error);});
    }

    return (
        <div className="story">
            <h1>
                <ReactTyped 
                strings={["Once upon a time in {}...".replace("{}", storyLocation)]}
                typeSpeed={10}
                showCursor={false}
                onComplete={getInitialStory}
                />
            </h1>
            <p>
                <ReactTyped 
                strings={["{}".replace("{}", firstStoryPrompt)]}
                typeSpeed={5}
                showCursor={false}
                onComplete={getFirstChoice}
                />
            </p>
            <p>
                <ReactTyped 
                strings={['Choose your next move:']}
                typeSpeed={20}
                showCursor={false}
            />
            </p>
            <ul style={{listStyleType: 'none', display: gotChoices ? 'block' : 'none'}}>
                {firstChoice.map((choice, index) => (
                
                    <li key={index}>
                        <ReactTyped
                        strings={["{}".replace("{}", choice)]}
                        typeSpeed={40}
                        showCursor={false}
                    />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Story;