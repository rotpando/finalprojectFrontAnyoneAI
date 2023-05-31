import React, { useState } from 'react';
import './App.css'; // Archivo CSS para los estilos
import axios from 'axios';
import formSchema from './formSchema.json';
import logo from "./pig.png";

const DynamicForm = () => {
  const [isDayMode, setIsDayMode] = useState(true);
  const [language, setLanguage] = useState('es');
  const [formData, setFormData] = useState({});
  const [startIndex, setStartIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [optionSelect, setOptionSelect] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");


  const handleOptionChange = (event, key) => {
    setFormData({
      ...formData,
      [key]: event.target.value,
    });
  };

  const formKeys = Object.keys(formSchema.properties);
  const progressPercent = Math.floor((startIndex / formKeys.length) * 100);

  const handleInputChange = (event, key) => {
    setFormData({
      ...formData,
      [key]: event.target.value,
    });
  };

  const handleSubmit = () => {
    setAlertMsg("")
    let formIncomplete=false;
    
    // Controls if the form is correctly completed
    Object.keys(formSchema["properties"]).map((key)=>{
      if(!formData[key]){
        language === 'es' ? setAlertMsg("Por favor complete correctamente: "+formSchema["properties"][key].title) : setAlertMsg("Please complete: "+formSchema["properties"][key].title)
        formIncomplete = true;

      }
    })

    if (!formIncomplete)
    {
      // correct form JSON
      Object.keys(formSchema["properties"]).map((key)=>{
        if(!formData[key]){
          language === 'es' ? setAlertMsg("Por favor complete correctamente: "+formSchema["properties"][key].title) : setAlertMsg("Please complete: "+formSchema["properties"][key].title)
          formIncomplete = true;
  
        }
      })

      // Post Method
      axios
      .post('http://127.0.0.1:5001/credit', formData)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        language === 'es' ? setAlertMsg("Lo sentimos, ha habido un error en el servidor.") : setAlertMsg("Server error. ")
        if (error.response) {
          // La solicitud se realizó y el servidor respondió con un código de estado diferente de 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // La solicitud se realizó pero no se recibió respuesta
          console.log(error.request);
        } else {
          // Ocurrió un error al configurar la solicitud
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
    }
  };

  const toggleMode = () => {
    setIsDayMode(!isDayMode);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    setLanguage(newLanguage);
  };

  const renderInputs = () => {
    const endIndex = startIndex + 10;
    const inputs = formKeys.slice(startIndex, endIndex);

    return inputs.map((key) => (
      <div key={key}>
        <div className="label-container"> 
          <label htmlFor={key} className={`mode-toggle ${isDayMode ? 'darkText' : 'lightText'}`}>
            {language === 'es' ? formSchema.properties[key].titleEs : formSchema.properties[key].title}
          </label>
        </div>
        <div className="label-container">
          {formSchema.properties[key].type === "options" && (
            <select className="input-select" id={key} value={formData[key] || ''} onChange={(event) => handleOptionChange(event, key)}>
          <option value="">{language === 'es' ? "Seleccionar" : "Select"}</option>

          {formSchema.properties[key].enum.map((option,i) => (
    <option key={option} value={option}>{
      language === 'es' ? formSchema.properties[key].enumFaceEs[i] : formSchema.properties[key].enumFace[i]
    }</option>
  ))}
        </select>
          )}

          {(formSchema.properties[key].type === "text" || formSchema.properties[key].type === "number") && (
            <input
              type={formSchema.properties[key].type}
              id={key}
              value={formData[key] || ''}
              onChange={(event) => handleInputChange(event, key)}
              className="input"
            />
          )}
          
        </div>
    
      </div>
    ));
  };

  const handleNext = () => {
    const nextIndex = startIndex + 10;
    setStartIndex(nextIndex);
    setProgress((nextIndex / formKeys.length) * 100);
  };

  const handlePrevious = () => {
    const nextIndex = startIndex - 10;
    setStartIndex(nextIndex);
    setProgress((nextIndex / formKeys.length) * 100);
  };

  const progressStyle = {
    width: `${progressPercent}%`,
    backgroundColor: progressPercent < 50 ? 'blue' : 'green',
  };

  return (
    <div className={`app ${isDayMode ? 'day-mode' : 'night-mode'}`}>
      <nav className="nav">
        <button
          className={`mode-toggle ${isDayMode ? 'dark' : 'light'} button`}
          onClick={toggleMode}
        >
        {language === 'es' ? (isDayMode ? 'Modo Noche' : 'Modo Día') : (isDayMode ? 'Night Mode' : 'Day Mode')}

        </button>
        <button
          className={`mode-toggle ${isDayMode ? 'dark' : 'light'} button`}
          onClick={toggleLanguage}
        >
          {language === 'es' ? 'Cambiar a inglés' : 'Change to Spanish'}
        </button>
      </nav>
      <div className={`mode-toggle ${isDayMode ? 'darkText' : 'lightText'} title`}>
        <h1>{language === 'es' ? formSchema.titleEs : formSchema.title}</h1>
        </div>
      <div className="container-content"> 
      
      <form className='left-container'>
        {renderInputs()}
      </form>

      <div className={`mode-toggle ${isDayMode ? 'darkText' : 'lightText'} content-right`}>
        <img src={logo} alt="logo" className="logo"></img>
        <div>{alertMsg}</div>
        </div>
      
      </div>
     
      
      <div className="container-footer"> 
      <div className="progress-bar-container">
        <div className="progress-bar" style={progressStyle}></div>
      </div>
      <div>
        <button className={`mode-toggle ${isDayMode ? 'dark' : 'light'} button`} onClick={handlePrevious}>
          {language === 'es' ? 'Previo' : 'Previous'}
        </button>
        <button className={`mode-toggle ${isDayMode ? 'dark' : 'light'} button`} onClick={handleNext}>
          {language === 'es' ? 'Siguiente' : 'Next'}
        </button>
        <button className={`mode-toggle ${isDayMode ? 'dark' : 'light'} button`} onClick={handleSubmit}>
          {language === 'es' ? 'Enviar' : 'Submit'}
        </button>
      </div>
      
      </div>
     
    </div>
  );
};

export default DynamicForm;
