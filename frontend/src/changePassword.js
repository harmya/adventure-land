import { ReactTyped } from 'react-typed';
import { useLocation } from 'react-router-dom';
import './password.css';
import {useState} from 'react';

function ChangePassword() {
    const location = useLocation();
    const username = location.state.username;
    const [correctOldPassword, setCorrectOldPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const oldPassword = event.target.elements['old-password'].value;
        const newPassword = event.target.elements['new-password'].value;
        
        const response = await fetch('http://127.0.0.1:5000/api/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, oldPassword: oldPassword, newPassword: newPassword})
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
                strings={['Change Password']}
                typeSpeed={40}
                showCursor={false}
                />
            </h1>

            <form className='password-form' onSubmit={handleSubmit}>
                <label htmlFor="old-password">Old Password:</label>

                <input type="password" id="old" name="old-password"></input>
                <label htmlFor="new-password">New Password:</label>
                <input type="password" id="new" name="new-password"></input>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ChangePassword;
