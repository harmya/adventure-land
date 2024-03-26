import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './story.css';
import {useState} from 'react';

function Story() {
    const location = useLocation();
    const storyLocation = location.state.location
    console.log(location);

    const getInitialStory = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/story/first', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            args: {
                location: storyLocation
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data)
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
        </div>
    );
}

export default Story;
    