import React, { useEffect, useState } from "react";
import "./popup.css";
import codeMapping from "./languageCode";

const Popup = () => {
  const [description, setDesription] = useState("");

  console.log("code", codeMapping);

  // const openNewTab = async () => {
  //  await chrome.storage.local.set({"description":description})
  //  await chrome.storage.local.set({"codeMapping":codeMapping})
  //   var newURL = `https://translate.google.co.in/?sl=en&tl=${code}&text=${description}&op=translate`;
  //    await chrome.tabs.create({
  //     url: newURL,
  //     active: true,
  //   });

  // };

  const handleTranslate = async () => {
    await chrome.storage.local.set({ description: description });
    await chrome.storage.local.set({ codeMapping: codeMapping });
    await chrome.storage.local.set({ reachedIndex: 0 });
    chrome.runtime.sendMessage({ type: "FROM_POPUP" });
    // openNewTab("ar");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    let selectedFile =  e.target.files[0];
    console.log("seasd",)
    var reader = new FileReader();

    reader.onload =async function(event) {
      var jsonObj = JSON.parse(event.target.result.toString());
      if(Array.isArray(jsonObj)){
        ///fill apple form
        let [currentTab] =  await chrome.tabs.query({active:true});
        if(currentTab){
          chrome.tabs.sendMessage(currentTab.id,{
            type:"SEND_TO_APPSTORE",
            outputJson:jsonObj
          })
        }
      }
    }
  
    reader.readAsText(selectedFile);
  }
  return (
    <div className="p-4">
      <textarea
        rows={20}
        onChange={(e) => setDesription(e.target.value)}
        value={description}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
      <button
        onClick={handleTranslate}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 "
      >
        Translate
      </button>

      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        Upload file
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Popup;
