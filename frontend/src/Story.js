import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './homepage.css';
import {useState} from 'react';

function Story() {
    const location = useLocation();
    const story = location.state.story;
    console.log(story);
}

export default Story;
    