import React, { useEffect, useState } from "react";
import "./popup.css";
import codeMapping from "./languageCode";
import TextAreaComponent from "./texteArea";

const Popup = () => {
  const [smallSizedDescription, setSmallSizedDescription] = useState("");
  const [description, setDescription] = useState("");
  const [mediumSizedDescription, setMediumSizedDescription] = useState("");
  // const [verySmallSizedDescription,setVerySmallSizedDescription] = useState("");

  const [smallSizedtitle, setSmallSizedtitle] = useState("");
  const [title, setTitle] = useState("");
  const [mediumSizedTitle, setMediumSizedTitle] = useState("");

  const [smallSizedSubTitle, setSmallSizedSubTitle] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const [mediumSizedSubTitle, setMediumSizedSubTitle] = useState("");

  const [smallSizedKeywords, setSmallSizedKeywords] = useState("");
  const [keywords, setKeywords] = useState("");
  const [mediumSizedKeyWords, setMediumSizedKeyWords] = useState("");

  const [smallSizedPromo, setSmallSizedPromo] = useState("");
  const [promo, setPromo] = useState("");
  const [mediumSizedPromo, setMediumSizedPromo] = useState("");

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
      keywords: keywords,
    });
    await chrome.storage.local.set({
      promo: promo,
    });
    await chrome.storage.local.set({
      allSizeDescription: [
        description,
        mediumSizedDescription,
        smallSizedDescription,
      ],
    });

    await chrome.storage.local.set({
      allSizeKeywords: [keywords, mediumSizedKeyWords, smallSizedKeywords],
    });
    await chrome.storage.local.set({
      allSizeTitle: [title, mediumSizedTitle, smallSizedtitle],
    });
    await chrome.storage.local.set({
      allSizeSubTitle: [subtitle, mediumSizedSubTitle, smallSizedSubTitle],
    });
    await chrome.storage.local.set({
      allSizePromo: [promo, mediumSizedPromo, smallSizedPromo],
    });
    await chrome.storage.local.set({ codeMapping: codeMapping });
    await chrome.storage.local.set({ reachedIndex: 0 });
    await chrome.storage.local.set({ descriptionSizeIndex: 0 });
    await chrome.storage.local.set({ titleSizeIndex: 0 });
    await chrome.storage.local.set({ subtitleSizeIndex: 0 });
    await chrome.storage.local.set({ keywordsSizeIndex: 0 });
    await chrome.storage.local.set({ promoSizeIndex: 0 });
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

  const handleInputFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let selectedFile = e.target.files[0];
    console.log("seasd");
    var reader = new FileReader();

    reader.onload = async function (event) {
      var jsonObj = JSON.parse(event.target.result.toString());
      if (Array.isArray(jsonObj)) {
        ///fill apple form
        let [
          titleArray,
          subTitleArray,
          descriptionArray,
          keyWordsArray,
          promoArray,
        ] = jsonObj;

        setTitle(titleArray[0]);
        setMediumSizedTitle(titleArray[1]);
        setSmallSizedtitle(titleArray[2]);

        setSubTitle(subTitleArray[0]);
        setMediumSizedSubTitle(subTitleArray[1]);
        setSmallSizedSubTitle(subTitleArray[2]);

        setDescription(descriptionArray[0]);
        setMediumSizedDescription(descriptionArray[1]);
        setSmallSizedDescription(descriptionArray[2]);

        setKeywords(keyWordsArray[0]);
        setMediumSizedKeyWords(keyWordsArray[1]);
        setSmallSizedKeywords(keyWordsArray[2]);

        setPromo(promoArray[0]);
        setMediumSizedPromo(promoArray[1]);
        setSmallSizedPromo(promoArray[2]);
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
            rows={1}
            type="title"
            setValue={setTitle}
            placeholder="Long Sized Title"
          />

          <TextAreaComponent
            value={mediumSizedTitle}
            rows={1}
            type="mediumTitle"
            setValue={setMediumSizedTitle}
            placeholder="Medium Sized Title"
          />

          <TextAreaComponent
            value={smallSizedtitle}
            rows={1}
            type="smallTitle"
            setValue={setSmallSizedtitle}
            placeholder="Small Sized Title"
          />
          <TextAreaComponent
            value={subtitle}
            rows={1}
            type="subTitle"
            setValue={setSubTitle}
            placeholder="Long Sized Subtitle"
          />

          <TextAreaComponent
            type="mediumSubTitle"
            rows={1}
            value={mediumSizedSubTitle}
            setValue={setMediumSizedSubTitle}
            placeholder="Medium Sized Subtitle"
          />

          <TextAreaComponent
            type="smallSubTitle"
            value={smallSizedSubTitle}
            rows={1}
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
          <TextAreaComponent
            type="keywords"
            value={keywords}
            setValue={setKeywords}
            placeholder="Long Sized KeyWords"
          />
          <TextAreaComponent
            type="mediumSizedKeyWords"
            value={mediumSizedKeyWords}
            setValue={setMediumSizedKeyWords}
            placeholder="Medium Sized KeyWords"
          />

          <TextAreaComponent
            type="smallSizedKeywords"
            value={smallSizedKeywords}
            setValue={setSmallSizedKeywords}
            placeholder="Small Sized Keywords"
          />

          <TextAreaComponent
            type="promo"
            value={promo}
            setValue={setPromo}
            placeholder="Long Sized Promo"
          />
          <TextAreaComponent
            type="mediumSizedPromo"
            value={mediumSizedPromo}
            setValue={setMediumSizedPromo}
            placeholder="Medium Sized Promo"
          />

          <TextAreaComponent
            type="smallSizedPromo"
            value={smallSizedPromo}
            setValue={setSmallSizedPromo}
            placeholder="Small Sized Promo"
          />
          {/* <TextAreaComponent
            type="verySmallDescription"
            value={verySmallSizedDescription}
            setValue={setVerySmallSizedDescription}
            placeholder="Very Small Sized Desciption"
          /> */}
        </>
      );
    }
  };
  return (
    <div className="p-4">
      {/* <select
        id="countries"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="description">Description</option>
        <option value="title">Title</option>
        <option value="subtitle">Sub Title</option>
      </select> */}

      <label
        className="block mb-2 text-sm font-medium text-gray-900"
        htmlFor="file_input"
      >
        Upload Input File
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
        id="file_input"
        type="file"
        onChange={handleInputFileChange}
      />
      {returnTextArea()}
      <button
        onClick={handleTranslate}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 "
      >
        Translate
      </button>

      <label
        className="block mb-2 text-sm font-medium text-gray-900"
        htmlFor="file_input"
      >
        Upload file
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        id="file_input"
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Popup;
