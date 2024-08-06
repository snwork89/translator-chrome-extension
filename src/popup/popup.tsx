import React, { useEffect, useState } from "react";
import "./popup.css";
import codeMapping from "./languageCode";
import TextAreaComponent from "./texteArea";

const Popup = () => {
  const [smallSizedDescription, setSmallSizedDescription] = useState("");
  const [description, setDescription] = useState("");
  const [mediumSizedDescription, setMediumSizedDescription] = useState("");

  const [smallSizedtitle, setSmallSizedtitle] = useState("");
  const [title, setTitle] = useState("");
  const [mediumSizedTitle, setMediumSizedTitle] = useState("");

  const [smallSizedSubTitle, setSmallSizedSubTitle] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const [mediumSizedSubTitle, setMediumSizedSubTitle] = useState("");

  const [selectedInputType, setSelectedInputType] = useState("description");
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
    await chrome.storage.local.set({
      title,
    });
    await chrome.storage.local.set({
      subtitle,
    });
    await chrome.storage.local.set({
      description: description,
    });
    await chrome.storage.local.set({
      allSizeDescription: [
        description,
        mediumSizedDescription,
        smallSizedDescription,
      ],
    });
    await chrome.storage.local.set({
      allSizeTitle: [title, mediumSizedTitle, smallSizedtitle],
    });
    await chrome.storage.local.set({
      allSizeSubTitle: [subtitle, mediumSizedSubTitle, smallSizedSubTitle],
    });
    await chrome.storage.local.set({ codeMapping: codeMapping });
    await chrome.storage.local.set({ reachedIndex: 0 });
    await chrome.storage.local.set({ descriptionSizeIndex: 0 });
    await chrome.storage.local.set({ titleSizeIndex: 0 });
    await chrome.storage.local.set({ subtitleSizeIndex: 0 });
    await chrome.storage.local.set({ inputType: selectedInputType });
    chrome.runtime.sendMessage({ type: "FROM_POPUP" });
    // openNewTab("ar");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files[0];
    console.log("seasd");
    var reader = new FileReader();
    await chrome.storage.local.set({ inputType: selectedInputType });
    reader.onload = async function (event) {
      var jsonObj = JSON.parse(event.target.result.toString());
      if (Array.isArray(jsonObj)) {
        ///fill apple form
        let [currentTab] = await chrome.tabs.query({ active: true });
        if (currentTab) {
          chrome.tabs.sendMessage(currentTab.id, {
            type: "SEND_TO_APPSTORE",
            outputJson: jsonObj,
          });
        }
      }
    };

    reader.readAsText(selectedFile);
  };

  const returnTextArea = () => {
    if (selectedInputType == "description") {
      return (
        <>
          <TextAreaComponent
            value={title}
            type="title"
            setValue={setTitle}
            placeholder="Long Sized Title"
          />

          <TextAreaComponent
            value={mediumSizedTitle}
            type="mediumTitle"
            setValue={setMediumSizedTitle}
            placeholder="Medium Sized Title"
          />

          <TextAreaComponent
            value={smallSizedtitle}
            type="smallTitle"
            setValue={setSmallSizedtitle}
            placeholder="Small Sized Title"
          />
          <TextAreaComponent
            value={subtitle}
            type="subTitle"
            setValue={setSubTitle}
            placeholder="Long Sized Subtitle"
          />

          <TextAreaComponent
            type="mediumSubTitle"
            value={mediumSizedSubTitle}
            setValue={setMediumSizedSubTitle}
            placeholder="Medium Sized Subtitle"
          />

          <TextAreaComponent
            type="smallSubTitle"
            value={smallSizedSubTitle}
            setValue={setSmallSizedSubTitle}
            placeholder="Small Sized Subtitle"
          />
          <TextAreaComponent
            type="description"
            value={description}
            setValue={setDescription}
            placeholder="Long Sized Desciption"
          />

          <TextAreaComponent
            type="mediumDescription"
            value={mediumSizedDescription}
            setValue={setMediumSizedDescription}
            placeholder="Medium Sized Desciption"
          />

          <TextAreaComponent
            type="smallDescription"
            value={smallSizedDescription}
            setValue={setSmallSizedDescription}
            placeholder="Small Sized Desciption"
          />
        </>
      );
    }
  };
  return (
    <div className="p-4">
      <select
        id="countries"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="description">Description</option>
        <option value="title">Title</option>
        <option value="subtitle">Sub Title</option>
      </select>
      {returnTextArea()}
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
