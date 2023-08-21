import React, { useEffect, useState } from 'react';
import './LeftContainer.css';
import {AiOutlineFileAdd,} from 'react-icons/ai'
import {GrEdit,} from 'react-icons/gr'
import Swal from "sweetalert2";
import { wizardBackendInstance } from '../../Constants/axios';
import { addCategory,urlPrefix,listCategories,listUrls,viewUrl } from '../../Constants/links';

function LeftContainer({ setSelectedURLId }) {
  const [categories, setCategories] = useState([]);
  const [urls, setUrls] = useState([]);

  const handleAddCategory = () => {
    const categoryName = prompt('Enter category name:');
    const url=`${urlPrefix}${addCategory}`
    const body={
      categoryName:categoryName
    }

    if (categoryName) {
    const tempToken = localStorage.getItem('Token')

      console.log("bod",body)
      console.log("tken",tempToken)
     wizardBackendInstance.post(url,body,{
      headers: { "Authorization": `Token ${tempToken}`, 'Content-Type': 'application/json' },

     }
     ).then((response)=>{
      console.log(response.data)
      if(response.data.errorCode == -1){
        setCategories([...categories, categoryName ]);
        console.log("categories",categories)
      }

     })
    }
  };

  const handleEditCategory = (categoryId)=>{
    const tempToken = localStorage.getItem('Token')
    console.log("cataegoryid",categoryId)
    const categoryName = prompt('Enter category name:');
    const url=`${urlPrefix}${addCategory}`
    const body={
      id:categoryId,
      categoryName:categoryName
    }
    console.log('url',url)
    console.log('body',body)

    wizardBackendInstance.post(url,body,{
      headers: { "Authorization": `Token ${tempToken}`, 'Content-Type': 'application/json' },

     }
     ).then((response)=>{
      console.log("her",response.data)
     })


  }
  const handleViewURL = (urlId) => {
    setSelectedURLId(urlId);
  };

  useEffect(()=>{
    const token=localStorage.getItem('Token')
      const categoryurl=`${urlPrefix}${listCategories}`
      wizardBackendInstance.get(categoryurl,{
        headers: {"Authorization": `Token ${token}`,'Content-Type': 'application/json' },
      }).then((response)=>{
        console.log("category",response.data)
        const categoryList = response.data.response.list;
        console.log("categorylist",categoryList)
        setCategories(categoryList)
      })
      const listurl=`${urlPrefix}${listUrls}`
      wizardBackendInstance.get(listurl,{
        headers: {"Authorization": `Token ${token}`,'Content-Type': 'application/json' },
      }).then((response)=>{
        console.log("urlslist",response.data)
        const urlList = response.data.response.list;
        console.log("urllistsss",urlList)
        setUrls(urlList)
      })

    },[])


 
  return (
    <div className={`left-container ${categories.length}`}>
    {categories.length === 0 ? (
      <div className="category">
        <p style={{ color: "white" }}>Category Not added yet</p>
        <button
          style={{
            padding: "8px 16px",
            color: "black",
            backgroundColor: "white",
          }}
          onClick={handleAddCategory}
        >
          Add new
        </button>
      </div>
    ) : (
      <div className="after-category">
         <button
          style={{
            padding: "8px 16px",
            color: "black",
            backgroundColor: "white",
          }}
          onClick={handleAddCategory}
        >
          Add new
        </button>
        <div className="added-categories">
          {categories.map((category, index) => (
          <>
            <div key={index}>
              <h3>{category.categoryName}</h3>
              <AiOutlineFileAdd style={{marginTop:"-11px"}}/>
              <GrEdit style={{marginTop:"-11px"}} onClick={() => handleEditCategory(category.id)}/>
            </div>
          
            <div>{urls
          .filter((url) => url.category === category.id)
          .map((url, urlIndex) => (
            <div key={urlIndex}>
              <p onClick={() => handleViewURL(url.id)}>{url.url}</p>
              <GrEdit style={{ marginTop: "-11px" }} onClick={() => handleEditURL(url.id)} />
            </div>
          ))}
            </div>
          </>

          ))}
        </div>
      </div>
    )}
  </div>
  
  );
}

export default LeftContainer;
