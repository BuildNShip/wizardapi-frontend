import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
//     const responsecodeurl=`${urlPrefix}${listResponseCodes}`
   
//     console.log(responsecodeurl)
//     console.log(token)
//     console.log(`Bearer ${token}`)
//     wizardBackendInstance.get(responsecodeurl,{
//       headers: {"Authorization": `Token ${token}`,'Content-Type': 'application/json' },
//     }
//     ).then((response)=>{
//       console.log(response.data.response.list)   
//       const codes = response.data.response.list.map((item) => item.code);

//         // Updating the 'methods' state with the 'codes' array
//         setMethods(codes);
//  })