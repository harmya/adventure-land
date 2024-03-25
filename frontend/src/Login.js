import { ReactTyped } from 'react-typed';
import './login-page.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [displayHeading, setDisplayHeading] = useState(false);
    const [displayOptionComplete, setDisplayOption] = useState(false);
    const [displayNewUserPrompt, setDisplayNewUserPrompt] = useState(false);
    const [displayUsernameInput, setDisplayUsernameInput] = useState(false);
    const [isNewUser, setIsNewUser] = useState('');
    const [username, setUsername] = useState('');
  
    const [gotUser, setGotUsername] = useState(false);
    const [gotNewUser, setGotNewUser] = useState(false);
  
    const [getNewPasswordPrompt, setGetNewPassword] = useState(false);
    const [getPasswordPrompt, setGetPassword] = useState(false);
    
    const handleHeadingComplete = () => {
      setDisplayHeading(true);
    }
  
    const handleOptionPromptComplete = () => {
      setDisplayOption(true);
    }
  
    const handleKeyPressPrompt = (event) => {
      if (event.key === 'Enter') {
        if (event.target.value === 'yes') {
          setIsNewUser('yes');
        }
        else if (event.target.value === 'no') {
          setIsNewUser('no');
        }
        else {
          console.log('Please enter yes or no');
        }
      }
    }
  
    const handleNewUserPromptComplete = () => {
      setDisplayNewUserPrompt(true);
    }
  
    const handleUsernamePromptComplete = () => {
      setDisplayUsernameInput(true);
    }
  
    const handleKeyPressUsername = (event) => {
      if (event.key === 'Enter' && isNewUser === 'yes') {
        setUsername(event.target.value);
        setGotNewUser(true);
        console.log(username);
      } else if (event.key === 'Enter' && isNewUser === 'no') {
        setUsername(event.target.value);
        setGotUsername(true);
        console.log(username);
      }
    }
  
    const getPassword = () => {
      setGetPassword(true);
    }
  
    const getNewPassword = () => {
      setGetNewPassword(true);
    }
  
    const submit = async (event) => {
      if (event.key === 'Enter') {
        const password = event.target.value;
        const response = await fetch('http://127.0.0.1:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({newUser: isNewUser, username: username, password: password})
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data['login'] === true) {
            navigate('/home', {state: {username: username}});
          }
        })
        .catch(error => console.log(error));
      }
    }
  
    return (
      <div className="login-page">
        <h1>
          Welcome to{" "}
          <ReactTyped
            strings={["Adventure Land"]}
            typeSpeed={30}
            showCursor={false}
            onComplete={handleHeadingComplete}
          />
        </h1>
        <h1 className="prompt">
          {displayHeading && <ReactTyped
            strings={["Are you new here?&nbsp;"]}
            typeSpeed={30}
            showCursor={false}
            onComplete={handleOptionPromptComplete}
          />} 
          { displayOptionComplete &&
            <input className="username-input" type="text" onKeyDown={handleKeyPressPrompt} ref={input => input && input.focus()} />
          }
        </h1>
        <h1 className="prompt" style={{display: isNewUser === 'no' ? 'block' : 'none'}}>
          {isNewUser === 'no' && <ReactTyped
            strings={["Enter your username&nbsp;"]}
            typeSpeed={30}
            showCursor={false}
            onComplete={handleUsernamePromptComplete}
          />} 
          { displayUsernameInput &&
            <input className="username-input" type="text" ref={input => input && input.focus()} onKeyDown={handleKeyPressUsername} />
          }
        </h1>
        <h1 className="prompt" style={{display: isNewUser === 'yes' ? 'block' : 'none'}}>
          {isNewUser === 'yes' && <ReactTyped
            strings={["Welcome! What should we call you?&nbsp;"]}
            typeSpeed={30}
            showCursor={false}
            onComplete={handleNewUserPromptComplete}
          />} 
          { displayNewUserPrompt &&
            <input className="username-input" type="text" ref={input => input && input.focus()} onKeyDown={handleKeyPressUsername} />
            }
        </h1>
    
        <h1 className="prompt" style={{display: gotUser ? 'block' : 'none'}}>
          {gotUser && <ReactTyped
            strings={["Enter your password&nbsp;"]}
            typeSpeed={30}
            showCursor={false}
            onComplete={getPassword}
          />} 
          { getPasswordPrompt &&
            <input className="password-input" type="password" ref={input => input && input.focus()} onKeyDown={submit} />
            }
        </h1>
  
        <h1 className="prompt" style={{display: gotNewUser ? 'block ' : 'none'}}>
          {gotNewUser && <ReactTyped
            strings={["Select a secret word to protect your account&nbsp;"]}
            typeSpeed={30}
            showCursor={false}
            onComplete={getNewPassword}
          />} 
          { getNewPasswordPrompt &&
            <input className="password-input" type="password" ref={input => input && input.focus() } onKeyDown={submit} />
            }
        </h1>
      </div>
    );
}

export default Login;