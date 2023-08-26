import './App.css'
import React, { useEffect, useState } from 'react';
import LeftContainer from './Components/LeftContainer/LeftContainer'
import Navbar from './Components/Navbar/Navbar'
import RightContainer from './Components/RightContainer/RightContainer'
import tokenUtils from './Constants/tokenUtils';

function App() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [selectedURLId, setSelectedURLId] = useState(null);

  useEffect(() => {
    tokenUtils().then((accessToken) => {
      setToken(accessToken);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      console.error('Error generating or retrieving token:', error);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='App'>
      {token ? (
        <>
          <Navbar />
          <div className="main-dash">
            <LeftContainer setSelectedURLId={setSelectedURLId}/>
            <RightContainer selectedURLId={selectedURLId}/>
          </div>
        </>
      ) : (
        <div>No token available. Please check your network connection or try again later.</div>
      )}
    </div>
  )
}

export default App;

