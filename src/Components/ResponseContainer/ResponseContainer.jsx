import React, { useEffect, useState } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import { urlPrefix, listResponseCodes, generateToken } from '../../Constants/links';
import { wizardBackendInstance, authInstance } from '../../Constants/axios';
function ResponseContainer() {
  const [cards, setCards] = useState([{ id: Date.now() }]);
  const [responseCodes, setResponseCodes] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [token, setToken] = useState("")



  const addCard = () => {
    setCards(prevCards => [...prevCards, { id: Date.now() }]);
  };

  const highlightCard = (id) => {
    setSelectedCardId(id);
  };

  useEffect(() => {
    const tempToken = localStorage.getItem('Token')
    setToken(tempToken)
    if (!token) {
      authInstance.post(generateToken, {
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        console.log(response.data)
        const accessToken = response.data.response.access_token;
        // Save tokens and expiry in localStorage
        localStorage.setItem('Token', accessToken);
        const tempToken = localStorage.getItem('Token')
        setToken(tempToken)
      })
    } else {
      if (token && token.length > 0) {
        const responsecodeurl = `${urlPrefix}${listResponseCodes}`

        console.log(responsecodeurl)
        console.log(token)
        wizardBackendInstance.get(responsecodeurl, {
          headers: { "Authorization": `Token ${token}`, 'Content-Type': 'application/json' },
        }
        ).then((response) => {
          console.log(response.data.response.list)
          const codes = response.data.response.list.map((item) => item.code);

          // Updating the 'methods' state with the 'codes' array
          setResponseCodes(codes);
        })
      }

    }


  }, [token])

  return (
    <div>
      <div className="card-section">
        <div className="cards">
          {cards.map(card => (
            <div
              key={card.id}
              className={`card ${selectedCardId === card.id ? 'highlight' : ''}`}
              onClick={() => highlightCard(card.id)}
            >
              <div className="select-code">
                <select >
                  {responseCodes.map((responseCode, index) => (
                    <option key={index} value={responseCode}>{responseCode}</option>
                  ))}
                </select>
              </div>
              <textarea className="card-textarea" placeholder="Text" />
            </div>
          ))}
          <button className='add-button' onClick={addCard}>
            <GrAddCircle />
          </button>
        </div>

      </div>
    </div>
  );
}

export default ResponseContainer;
