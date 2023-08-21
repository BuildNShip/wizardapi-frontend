// // import './App.css'
// // import React, { useEffect, useState } from 'react';
// // import LeftContainer from './Components/LeftContainer/LeftContainer'
// // import Navbar from './Components/Navbar/Navbar'
// // import RightContainer from './Components/RightContainer/RightContainer'
// // import { generateToken } from './Constants/links';
// // import { authInstance } from './Constants/axios';
// // import tokenUtils from './Constants/tokenUtils';

// // function App() {



// //   return (
// //     <>
// //     {token?(
// //       <div className='App'>
// //       <Navbar />
// //       <div className="main-dash">
// //         <LeftContainer/>
// //         <RightContainer />
// //       </div>
// //     </div>
// //     ):
// //     <div className='App'>
// // LOading    </div>
// //     }
    
// //     </>
// //   )
// // }

// // export default App;


// import './App.css'
// import React, { useEffect, useState } from 'react';
// import LeftContainer from './Components/LeftContainer/LeftContainer'
// import Navbar from './Components/Navbar/Navbar'
// import RightContainer from './Components/RightContainer/RightContainer'
// import { generateToken } from './Constants/links';
// import { authInstance } from './Constants/axios';

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     // Check if a token exists in localStorage
//     const existingToken = localStorage.getItem('Token');
//     if (existingToken) {
//       setToken(existingToken);
//       setLoading(false);
//     } else {
//       // If no token exists, generate and save one
//       authInstance.post(generateToken, {
//         headers: { 'Content-Type': 'application/json' },
//       }).then((response) => {
//         const accessToken = response.data.response.access_token;
//         localStorage.setItem('Token', accessToken);
//         setToken(accessToken);
//         setLoading(false);
//       }).catch((error) => {
//         setLoading(false);
//         console.error('Error generating token:', error);
//       });
//     }
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Display a loading screen while generating the token
//   }

//   // If token is available, display the main content; otherwise, show the loading message
//   return (
//     <div className='App'>
//       {token ? (
//         <>
//           <Navbar />
//           <div className="main-dash">
//             <LeftContainer/>
//             <RightContainer />
//           </div>
//         </>
//       ) : (
//         <div>Loading...</div>
//       )}
//     </div>
//   )
// }

// export default App;
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

