import React, { useState,useEffect}from 'react';
import './RightContainer.css';
import { addUrl,viewUrl, listCategories, listResponseCodes, urlPrefix } from '../../Constants/links';
import {wizardBackendInstance } from '../../Constants/axios';
import { GrAddCircle } from 'react-icons/gr';


function RightContainer({selectedURLId}) {
  console.log("sele",selectedURLId)
  const methods = ['GET','POST','PUT','DELETE']
  const methodMapping = {
    GET: '1',
    POST: '2',
    PUT: '3',
    DELETE: '4',
  };
  const getMethodName = (methodId) => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const methodMapping = {
      GET: '1',
      POST: '2',
      PUT: '3',
      DELETE: '4',
    };
    // Invert the methodMapping object to get method names from method IDs
    const invertedMapping = Object.fromEntries(Object.entries(methodMapping).map(([key, value]) => [value, key]));
  
    return invertedMapping[methodId] || methods[0]; // Return the method name or default to 'GET'
  };

  const [cards, setCards] = useState([{ id: Date.now(), selectedResponseCodeId: '', responseBody: '' }]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [categories,setCategories]=useState([])
  const [url,setUrl]=useState('')
  const [responseCodes, setResponseCodes] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState('1');
  const [selectedURLData, setSelectedURLData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  // const [selectedResponseCodeId, setSelectedResponseCodeId] = useState('');
  const [urlCards, setUrlCards] = useState({});
  const [selectedResponseCode, setSelectedResponseCode] = useState('');
 
  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10; 
    let randomId = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
    return randomId;
  };

  const addCard = () => {
    if (selectedURLId) {
      const randomCardId = generateRandomId();
      const newCard = { id: randomCardId, selectedResponseCodeId: selectedResponseCode, responseBody: '' };
      setUrlCards((prevUrlCards) => ({
        ...prevUrlCards,
        [selectedURLId]: [...(prevUrlCards[selectedURLId] || []), newCard],
      }));
    } else {
      const newCard = { id: Date.now(), selectedResponseCodeId: '', responseBody: '' };
    setCards((prevCards) => [...prevCards, newCard]);
    }
  };
  
  const highlightCard = (id) => {
    setSelectedCardId(id);
    console.log('Selected Card ID:', id);
  };
  
  
 
  useEffect(()=>{

    if (selectedURLId) {
      setUrlCards({ [selectedURLId]: [] });
      const tempToken = localStorage.getItem("Token");
      const url = `${urlPrefix}${viewUrl}`;
      const body = {
        pk: selectedURLId,
      };

      console.log("bodyurl",body)

      wizardBackendInstance
        .post(url, body, {
          headers: { Authorization: `Token ${tempToken}`, "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log("View URL response:", response.data);
          setSelectedURLData(response.data); 
          setSelectedCategoryId(response.data?.response?.category || '');
          const responseCards = response.data.response.responses.map((responseItem) => ({
            id: generateRandomId(),
            selectedResponseCodeId: responseItem.responseCode,
            responseBody: responseItem.body || '',
          }));
          setCards(responseCards);
          setUrlCards({
            [selectedURLId]: responseCards,
          });
        })
        .catch((error) => {
          console.error("Error viewing URL:", error);
        });
    }

    const token=localStorage.getItem('Token')
    console.log("token",token)
    const categoryurl=`${urlPrefix}${listCategories}`
    wizardBackendInstance.get(categoryurl,{
      headers: {"Authorization": `Token ${token}`,'Content-Type': 'application/json' },
    }).then((response)=>{
      console.log("category",response.data)
      const categoryList = response.data.response.list;
      console.log("categorylist",categoryList)
      setCategories(categoryList)
    })
    if (token && token.length > 0) {
      const responsecodeurl = `${urlPrefix}${listResponseCodes}`
      console.log("codeurl",responsecodeurl)
      console.log("token",token)
      wizardBackendInstance.get(responsecodeurl, {
        headers: { "Authorization": `Token ${token}`, 'Content-Type': 'application/json' },
      }
      ).then((response) => {
        console.log("list",response.data.response.list)
        const codes = response.data.response.list;
        console.log("codes",codes)
        setResponseCodes(codes);
      })
    }
    },[selectedURLId])
    console.log("rcodes",responseCodes)
  
    
    
    const handleEdit=(selectedurlId)=>{
      const token = localStorage.getItem('Token');
      console.log("id",selectedurlId)
      console.log("id",selectedCategoryId)
      console.log("url",selectedURLData.response.url)
      console.log("method",selectedMethodId)


      const updatedResponseCards = urlCards[selectedURLId] || [];

      const responses = updatedResponseCards.map((card) => ({
        default: card.id === selectedCardId ? "True" : "False",
        responseCode: card.selectedResponseCodeId,
        body: [card.responseBody] || [],
      }));

      console.log("responses", responses);
      const dataPayload = {
        id:selectedurlId,
        method: selectedMethodId,
        category: selectedCategoryId,
        url: selectedURLData.response.url,
        responses: responses, 
      };
      console.log("datapayload", dataPayload);
      const urlInsert = `${urlPrefix}${addUrl}`;
      wizardBackendInstance.post(urlInsert, dataPayload, {
        headers: { "Authorization": `Token ${token}`, 'Content-Type': 'application/json' },
      }).then((response) => {
        console.log("API response edit:", response.data);
      }).catch((error) => {
        console.error("Error saving data:", error);
      });
    }
   

    // const handleResponseCodeChange = (cardId, value) => {
      
    //   // If a card is selected, update its selectedResponseCodeId
    //   // setCards((prevCards) =>
    //   //   prevCards.map((card) =>
    //   //     card.id === cardId ? { ...card, selectedResponseCodeId: value } : card
    //   //   )
    //   // );
    
    //   // If a URL is selected, update the selectedResponseCodeId for that card within the URL
    //   if (selectedURLId) {
    //     setUrlCards((prevUrlCards) => ({
    //       ...prevUrlCards,
    //       [selectedURLId]: prevUrlCards[selectedURLId].map((card) =>
    //         card.id === cardId ? { ...card, selectedResponseCodeId: value } : card
    //       ),
    //     }));
    //   }
      


   
    // };
    

    const handleResponseCodeChange = (isURLSelected, cardId, value) => {
      console.log("selected url",value)
      if (isURLSelected) {

        // If a URL is selected, update the selectedResponseCodeId for that card within the URL
        setUrlCards((prevUrlCards) => ({
          ...prevUrlCards,
          [selectedURLId]: prevUrlCards[selectedURLId].map((card) =>
            card.id === cardId ? { ...card, selectedResponseCodeId: value } : card
          ),
        }));
      } else {
        // If no URL is selected, update the selectedResponseCode state
        setSelectedResponseCode(value);
      }
    };
    
    const handleResponseBodyChange = (cardId, value) => {
      if(selectedURLId){
        setUrlCards((prevUrlCards) => ({
          ...prevUrlCards,
          [selectedURLId]: prevUrlCards[selectedURLId].map((card) =>
            card.id === cardId ? { ...card, responseBody: value } : card
          ),
        }));
      }

      setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, responseBody: value } : card
      )
    );

      try {
        JSON.parse(value);
      } catch (error) {
        console.error("Invalid JSON input:", error);
      }
    };
    
    const handleSave = () => {
      const token = localStorage.getItem('Token');
      console.log("Selected Method:", selectedMethodId);
      console.log("Selected Category:", selectedCategoryId);
      console.log("URL:", url);
      console.log("token:", token);
      console.log("code",selectedResponseCode)
      // const selectedCard = cards.find((card) => card.id === selectedCardId);
      // console.log("selected",selectedCard)
      // if (selectedCard) {
      //   setSelectedResponseCodeId(selectedCard.selectedResponseCodeId);
      // }

      
      const responses = cards.map((card) => ({
        default: card.id === selectedCardId ? 'True' : 'False',
        responseCode: selectedURLId ? card.selectedResponseCodeId : selectedResponseCode,
        body: [card.responseBody] || [],
      }));

      const dataPayload = {
        method: selectedMethodId,
        category: selectedCategoryId,
        url: url,
        responses: responses, 
      };
    
      console.log("datapayload", dataPayload);
      
      const urlInsert = `${urlPrefix}${addUrl}`;
      wizardBackendInstance.post(urlInsert, dataPayload, {
        headers: { "Authorization": `Token ${token}`, 'Content-Type': 'application/json' },
      }).then((response) => {
        console.log("API response:", response.data);
      }).catch((error) => {
        console.error("Error saving data:", error);
      });
    }
    
  return (
    <div className='right-container'>
      <div className="input">
        <div className="input-type-box">
          <div className="select-method">
            <select
              onChange={(e) => setSelectedMethodId(e.target.value)}
              value={selectedMethodId}
            >
              {selectedURLData?.response?.method && (
                <option value={selectedURLData.response.method}>
                  {getMethodName(selectedURLData.response.method)}
                </option>
              )}

              {methods.map((method, index) => {
                const methodId = methodMapping[method];
                const methodName = getMethodName(methodId);

                if (methodId !== selectedURLData?.response?.method) {
                  return (
                    <option key={index} value={methodId}>
                      {methodName}
                    </option>
                  );
                }
                return null;
              })}
            </select>
          </div>

          <div className="select-category">
            <select
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                value={selectedCategoryId}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
            </select>
        </div>
        
        <div className="input-type">
          <input
            type="text" 
            placeholder="Enter URL" 
            value={selectedURLId === null ? url : selectedURLData?.response?.url}
            onChange={(e) => {
              if (selectedURLId === null) {
                setUrl(e.target.value);
              } else {
                setSelectedURLData({
                  ...selectedURLData,
                  response: {
                    ...selectedURLData.response,
                    url: e.target.value,
                  },
                });
              }
            }}
          />
        </div>
      </div>
      <button 
          className='save-button' 
          onClick={() => {
              if (selectedURLId) {
                handleEdit(selectedURLId); 
              } else {
                handleSave()
              }
        }} >
           Save
      </button>
    </div>

    <div className="response-card">
      <div className="card-section">
        <div className="cards">
          {(selectedURLId && urlCards[selectedURLId] ? urlCards[selectedURLId] : cards).map((card)=> (
            <div
                key={card.id}
                className={`card ${selectedCardId === card.id ? 'highlight' : ''}`}
                onClick={() => highlightCard(card.id)}
              >
                <div className="select-code">
                <select
                  onChange={(e) => handleResponseCodeChange(selectedURLId, card.id, e.target.value)}
                  value={card.selectedResponseCodeIed}
                >
                  {responseCodes.map((responseCode, index) => (
                    <option key={responseCode.id} value={responseCode.id}>
                      {responseCode.code}
                    </option>
                  ))}
                </select>
              </div>
                
                
                <textarea 
                  className="card-textarea" placeholder="Text" 
                  value={card.responseBody}
                  onChange={(e) => handleResponseBodyChange(card.id, e.target.value)}/>
            </div>
          ))}
          <button className='add-button' onClick={addCard}>
              <GrAddCircle />
          </button>
        </div>
      </div>
    </div>
  </div>

  );
}

export default RightContainer;

