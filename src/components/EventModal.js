import React, { useState, useEffect, useContext } from "react";
import languages from "./Languages";
import recordingImage from "../assets/bars.svg";
import GlobalContext from "../context/GlobalContext";

const labelsClasses = {
  indigo: "bg-indigo-500",
  gray: "bg-gray-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
};

function EventModal() {
  const { setShowEventModal, selectedEvent } = useContext(GlobalContext);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [result, setResult] = useState("");
  const [recording, setRecording] = useState(false);
  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [sendDataDisabled, setSendDataDisabled] = useState(true);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses[selectedEvent.label]
      : Object.values(labelsClasses)[0]
  );

  useEffect(() => {
    setLanguageOptions(
      languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))
    );
  }, []);

  const speechToText = () => {
    try {
      const recognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new recognition();
      recognitionInstance.lang = language;
      recognitionInstance.interimResults = true;
      
       if (recording) {
         stopRecording(); // Stop the recording if it's already in progress
         return; // Exit the function
      }

      setRecording(true);
      recognitionInstance.start();
      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        let interimElement = document.querySelector(".interim");
        if (event.results[0].isFinal) {
          setResult((prevResult) => prevResult + " " + speechResult);
        } else {
          if (!interimElement) {
            interimElement = document.createElement("p");
            interimElement.classList.add("interim");
            document.body.appendChild(interimElement); // append the element to the DOM
          }
          interimElement.innerHTML = " " + speechResult;
        }
        setDownloadDisabled(false);
        setSendDataDisabled(false);
      };

      recognitionInstance.onspeechend = () => {
        speechToText();
      };
      recognitionInstance.onerror = (event) => {
        stopRecording();
        if (event.error === "no-speech") {
          alert("No speech was detected. Stopping...");
        } else if (event.error === "audio-capture") {
          alert(
            "No microphone was found. Ensure that a microphone is installed."
          );
        } else if (event.error === "not-allowed") {
          alert("Permission to use microphone is blocked.");
        } else if (event.error === "aborted") {
          alert("Listening Stopped.");
        } else {
          alert("Error occurred in recognition: " + event.error);
        }
      };
      setRecognitionInstance(recognitionInstance);
    } catch (error) {
      setRecording(false);
      console.log(error);
    }
  };

  const stopRecording = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setRecording(false);
  };

  const download = () => {
    const fileInfo = `Title: ${title}\nStart Date: ${startDate}\nStart Time: ${startTime}\nEnd Date: ${endDate}\nEnd Time: ${endTime}\n\n${result}`;
    const filename = `${title.replace(/ /g, "_").toLowerCase()}.txt`;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(fileInfo)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearResult = () => {
    setResult("");
    setDownloadDisabled(true);
  };

  const sendData = () => {
    const data = {
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      title: title,
      description: result,
    };

    fetch("http://localhost:4000/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <form className="bg-white rounded-lg shadow-2xl w-1/4">
        {/* Header */}
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          {/* Icone de déplacement */}
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          {/* Bouton de fermeture */}
          <button onClick={() => setShowEventModal(false)}>
            <span className="material-icons-outlined text-gray-400">close</span>
          </button>
        </header>
        {/* Contenu principal */}
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-3xl font-semibold mb-4">Speech to Text</h1>
          <div className="max-w-sm mx-auto">
            {/* Sélection de la langue */}
            <div className="space-y-2">
              <label htmlFor="language" className="block">
                Language
              </label>
              <select
                name="input-language"
                id="language"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languageOptions}
              </select>
            </div>
            {/* Sélection de la date et de l'heure de début */}
            <div className="space-y-2">
              <label htmlFor="startDate" className="block">
                Input the date:
              </label>
              <input
                type="date"
                id="startDate"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="time"
                id="startTime"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 mt-1"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            {/* Sélection de la date et de l'heure de fin */}
            <div className="space-y-2">
              <label htmlFor="endDate" className="block">
                Input the end date and time:
              </label>
              <input
                type="date"
                id="endDate"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                type="time"
                id="endTime"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 mt-1"
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            {/* Champ de titre */}
            <div className="space-y-2">
              <label className="title">Title:</label>
              <input
                type="text"
                id="title"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex gap-x-2 pt-4">
              <span className="material-icons-outlined text-gray-400">
                bookmark_border
              </span>
              {Object.values(labelsClasses).map((lblClass, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`${lblClass} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === lblClass && (
                    <span className="material-icons-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </span>
              ))}
            </div>
            {/* Ligne de séparation */}
            <div className="my-8 border-b border-gray-300"></div>
            {/* Bouton de démarrage de l'enregistrement */}
            <button
              className={`btn record flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ${
                recording ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(event) => {
                event.preventDefault(); // Prevent the default event
                if (recording) {
                  stopRecording(); // Stop recording if already in progress
                } else {
                  speechToText(); // Start recording if not in progress
                }
              }}
            >
              <div class="icon">
                {/* Icone d'enregistrement ou d'arrêt d'enregistrement */}
                {recording ? (
                  <img src={recordingImage} alt="recording" />
                ) : (
                  <span class="material-icons-outlined cursor-pointer text-white-600 mx-2">
                    micro
                  </span>
                )}
              </div>
              {/* Texte du bouton */}
              <p>{recording ? "Stop Listening" : "Start Listening"}</p>
            </button>

            {/* Titre de la description */}
            <h2 className="text-xl font-semibold mt-8"> Description :</h2>
            {/* Zone de texte pour afficher le résultat */}
            <textarea
              className="result bg-white border border-gray-300 rounded-md shadow-md mt-4 p-4 resize-none block w-full"
              spellCheck="false"
              readOnly
              value={result}
            ></textarea>
            {/* Pied de page */}
            <footer className="flex justify-center items-center mt-8 space-x-4">
              {/* Bouton de suppression */}
              <button
                className="btn clear flex items-center justify-center space-x-2 bg-gray-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                onClick={clearResult}
                disabled={!result}
              >
                <span class="material-icons-outlined cursor-pointer text-white-600 mx-2">
                  delete
                </span>
                <p>Clear</p>
              </button>
              {/* Bouton de téléchargement */}
              <button
                className={`btn download flex items-center justify-center space-x-2 bg-gray-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ${
                  downloadDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={download}
                disabled={downloadDisabled}
              >
                <span class="material-icons-outlined cursor-pointer text-white-600 mx-2">
                  download
                </span>
                <p>Download</p>
              </button>
              {/* Bouton d'envoi des données */}
              <button
                className={`btn sendData flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ${
                  sendDataDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={sendData}
                disabled={sendDataDisabled}
              >
                <span class="material-icons-outlined cursor-pointer text-white-600 mx-2">
                  save
                </span>
                <p>Save</p>
              </button>
            </footer>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EventModal;
