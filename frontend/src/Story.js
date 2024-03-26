import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './story.css';
import {useState} from 'react';

function Story() {
    const location = useLocation();
    const storyLocation = location.state.location
    console.log(location);

    const getInitialStory = async () => {
        const response = await fetch('http://localhost:5000/api/story/first', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
    }

    return (
        <div className="story">
            <h1>
                <ReactTyped 
                strings={["Once upon a time in {}...".replace("{}", storyLocation)]}
                typeSpeed={40}
                showCursor={false}
                on
                />
            </h1>
        </div>
    );
}

export default Story;
    