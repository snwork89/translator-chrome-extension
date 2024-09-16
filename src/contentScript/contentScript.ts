let testingLan = [
  {
    lan: "Danish",
    code: "da",
  },
  {
    lan: "French",
    code: "fr",
  },
  // {
  //   lan: "German",
  //   code: "de",
  // },
  // {
  //   lan: "Portuguese (Portugal)",
  //   code: "pt-PT",
  // },
  // {
  //   lan: "Russian",
  //   code: "ru",
  // },
  // {
  //   lan: "Greek",
  //   code: "el",
  // },
  // {
  //   lan: "Malay",
  //   code: "ms",
  // },

  // {
  //   lan: "Spanish (Spain)",
  //   code: "es",
  // },
  // {
  //   lan: "Swedish",
  //   code: "sv",
  // },
  // {
  //   lan: "Thai",
  //   code: "th",
  // },
];
let productionLan = [
  {
    lan: "Arabic",
    code: "ar",
  },
  {
    lan: "Catalan",
    code: "ca",
  },
  {
    lan: "Chinese (Simplified)",
    code: "zh-CN",
  },
  {
    lan: "Chinese (Traditional)",
    code: "zh-TW",
  },
  {
    lan: "Croatian",
    code: "hr",
  },
  {
    lan: "Czech",
    code: "cs",
  },
  {
    lan: "Danish",
    code: "da",
  },
  {
    lan: "Dutch",
    code: "nl",
  },
  {
    lan: "English (Australia)",
    code: "en",
  },
  {
    lan: "English (Canada)",
    code: "en",
  },
  {
    lan: "English (U.K.)",
    code: "en",
  },
  {
    lan: "Finnish",
    code: "fi",
  },
  {
    lan: "French",
    code: "fr",
  },
  {
    lan: "French (Canada)",
    code: "fr",
  },
  {
    lan: "German",
    code: "de",
  },
  {
    lan: "Greek",
    code: "el",
  },
  {
    lan: "Hebrew",
    code: "iw",
  },
  {
    lan: "Hindi",
    code: "hi",
  },
  {
    lan: "Hungarian",
    code: "hu",
  },
  {
    lan: "Indonesian",
    code: "id",
  },
  {
    lan: "Italian",
    code: "it",
  },
  {
    lan: "Japanese",
    code: "ja",
  },
  {
    lan: "Korean",
    code: "ko",
  },
  {
    lan: "Malay",
    code: "ms",
  },
  {
    lan: "Norwegian",
    code: "no",
  },
  {
    lan: "Polish",
    code: "pl",
  },
  {
    lan: "Portuguese (Brazil)",
    code: "pt",
  },
  {
    lan: "Portuguese (Portugal)",
    code: "pt-PT",
  },
  {
    lan: "Romanian",
    code: "ro",
  },
  {
    lan: "Russian",
    code: "ru",
  },
  {
    lan: "Slovak",
    code: "sk",
  },
  {
    lan: "Spanish (Mexico)",
    code: "es",
  },
  {
    lan: "Spanish (Spain)",
    code: "es",
  },
  {
    lan: "Swedish",
    code: "sv",
  },
  {
    lan: "Thai",
    code: "th",
  },
  {
    lan: "Turkish",
    code: "tr",
  },
  {
    lan: "Ukrainian",
    code: "uk",
  },
  {
    lan: "Vietnamese",
    code: "vi",
  },
];

let languageCodes = [...productionLan];

let cachedWords = {};
const saveTemplateAsFile = (filename, dataObjToWrite) => {
  let promise = new Promise((resolve, reject) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], {
      type: "text/json",
    });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(
      ":"
    );

    const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove();

    resolve("");
  });
  return promise;
};

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("mesasage received", message);
  if (window.location.origin.includes("appstoreconnect")) {
    if (message.type == "SEND_TO_APPSTORE") {
      let outputJson = message["outputJson"];
      console.log("out put json is", outputJson);

      if (Array.isArray(outputJson)) {
        console.log("output json,", outputJson);
        let selectLanguageButton = document.querySelectorAll(
          "button[color=ctrl]"
        )[1] as HTMLElement;

        selectLanguageButton.click();
        await new Promise((resolve, reject) =>
          setTimeout(() => resolve(""), 2000)
        );
        let lanList = document.querySelectorAll("li[role=menuitem]");

        for (let i = 0; i < lanList.length; i++) {
          let currentItem = lanList
            .item(i)
            .querySelector("button") as HTMLElement;
          console.log("current item si", currentItem.innerText);
        
          if (!["French", "Danish"].includes(currentItem.innerText)) {
            continue;
          }
          currentItem.click();
          await new Promise((resolve, reject) =>
            setTimeout(() => resolve(""), 2000)
          );

          // let finalDescription = outputJson.find((x) => x.code == "en").output;
          let currentCode = languageCodes.find(
            (x) => x.lan == currentItem.innerText
          );

          let currentDescription = currentCode
            ? outputJson.find((x) => x.code == currentCode.code)
            : null;
          if (currentDescription) {
            let { title, subtitle, output, promo, keywords } =
              currentDescription;

            let descriptionElement: any =
              document.querySelector("[name=description]");
            let promoTextElement:any = document.querySelector(
              "[name=promotionalText]"
            );

            let keywordElement:any= document.querySelector("#keywords");
            let titleElement: any = document.getElementById("name");
            let subtitleElement: any = document.getElementById("subtitle");
            console.log(
              "description element ",
              descriptionElement,
              currentDescription,
              title,
              subtitle
            );
            if (descriptionElement && output) {
              descriptionElement.textContent = output;

              descriptionElement.dispatchEvent(
                new Event("input", { bubbles: true })
              );
            }
            if (titleElement && title) {
              titleElement.value = title;

              titleElement.dispatchEvent(new Event("input", { bubbles: true }));
            }
            if (subtitleElement && subtitle) {
              subtitleElement.value = subtitle;

              subtitleElement.dispatchEvent(
                new Event("input", { bubbles: true })
              );
            }

            if(promoTextElement && promo){
              promoTextElement.textContent = promo;

              promoTextElement.dispatchEvent(
                new Event("input", { bubbles: true })
              );
            }

            if(keywordElement && keywords){
              keywordElement.value = keywords;

              keywordElement.dispatchEvent(
                new Event("input", { bubbles: true })
              );
            }
          }
          await new Promise((resolve, reject) =>
            setTimeout(() => resolve(""), 2000)
          );

          let headingButtons = document.getElementById("heading-buttons");
          let saveButton = headingButtons.querySelector("button");
          console.log("save button attaera", saveButton.getAttribute("type"));
          // saveButton.click();

          console.log("save button clicked");
          await new Promise((resolve, reject) =>
            setTimeout(() => resolve(""), 2000)
          );

          let selectLanguageButton = document.querySelectorAll(
            "button[color=ctrl]"
          )[1] as HTMLElement;

          selectLanguageButton.click();
          await new Promise((resolve, reject) =>
            setTimeout(() => resolve(""), 2000)
          );

          lanList = document.querySelectorAll("li[role=menuitem]");
        }
      }
    }
  }
});

const getTranslationWithOutEnglish = async (source, output) => {
  console.log("current source inside geWithoutEnglush", source);
  console.log("current output inside geWithoutEnglush", output);
  let promise = new Promise(async (resolve, reject) => {
    resolve(output);
    return;
    let inputString = String(source);
    let finalOutput = String(output);

    let allWordsInOutput = finalOutput.split(" ");

    // let cachedWords = {};

    let inputElement = document.querySelector("textarea");
    console.log("allWordsInOutput length ", allWordsInOutput.length);
    for (let i = 0; i < allWordsInOutput.length; i++) {
      let currentWord = allWordsInOutput[i];
      console.log("current word", currentWord);
      if (
        currentWord &&
        inputString.search(currentWord) != -1 &&
        finalOutput.search(currentWord) != -1 &&
        currentWord.trim().length > 1 &&
        isNaN(Number(currentWord)) &&
        !["-", ",", "."].includes(currentWord)
      ) {
        console.log("current word is", currentWord);
        console.log("value of i is", i, "Of", allWordsInOutput.length);
        if (cachedWords[currentWord]) {
          let re = new RegExp(currentWord, "g");
          finalOutput = finalOutput.replace(re, cachedWords[currentWord]);
          continue;
        }

        inputElement.value = String(currentWord).toLowerCase();
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise((re, _) => setTimeout(() => re(""), 2000));
        let translateOutputofCurrentWord = "";

        while (translateOutputofCurrentWord == "") {
          await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
          let element = document.querySelector(
            "[jsname='jqKxS']"
          ) as HTMLElement;

          if (element) {
            translateOutputofCurrentWord = element.innerText;

            if (
              String(translateOutputofCurrentWord).trim().toLowerCase() ==
              String(currentWord).trim().toLowerCase()
            ) {
              let moreOptionList =
                document.querySelectorAll("[jsname='jqKxS']");

              for (
                let moreoptionIndex = 0;
                moreoptionIndex < moreOptionList.length;
                moreoptionIndex++
              ) {
                let currentMoreOptionOutput = (
                  moreOptionList.item(moreoptionIndex) as HTMLElement
                ).innerText;

                if (
                  String(currentMoreOptionOutput).trim().toLowerCase() !=
                  String(currentWord).trim().toLowerCase()
                ) {
                  translateOutputofCurrentWord = currentMoreOptionOutput;
                  break;
                }
              }
            }
          }
        }
        cachedWords[currentWord] = translateOutputofCurrentWord;
        let re = new RegExp(currentWord, "g");
        finalOutput = finalOutput.replace(re, translateOutputofCurrentWord);
      }
    }

    resolve(finalOutput);
  });

  return promise;
};

const returnCorrectLengthOutput = (output: string, inputType: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  let promise = new Promise(async (resolve, reject) => {
    let MAX_CHARACTER_COUNT = returnMaxCharacter(inputType);

    let inputElement = document.querySelector("textarea");
    let currentOutput = output;
    while (currentOutput.length > MAX_CHARACTER_COUNT) {
      let input = "";
      if (inputType == "description") {
        let { descriptionSizeIndex, allSizeDescription } =
          await chrome.storage.local.get([
            "descriptionSizeIndex",
            "allSizeDescription",
          ]);
        descriptionSizeIndex = descriptionSizeIndex + 1;
        input = allSizeDescription[descriptionSizeIndex];
        await chrome.storage.local.set({
          descriptionSizeIndex: descriptionSizeIndex,
        });
      }
      if (inputType == "title") {
        let { titleSizeIndex, allSizeTitle } = await chrome.storage.local.get([
          "titleSizeIndex",
          "allSizeTitle",
        ]);
        titleSizeIndex = titleSizeIndex + 1;
        input = allSizeTitle[titleSizeIndex];
        await chrome.storage.local.set({
          titleSizeIndex: titleSizeIndex,
        });
      }
      if (inputType == "subtitle") {
        let { subtitleSizeIndex, allSizeSubTitle } =
          await chrome.storage.local.get([
            "subtitleSizeIndex",
            "allSizeSubTitle",
          ]);
        subtitleSizeIndex = subtitleSizeIndex + 1;
        input = allSizeSubTitle[subtitleSizeIndex];
        await chrome.storage.local.set({
          subtitleSizeIndex: subtitleSizeIndex,
        });
      }

      if (inputType == "keywords") {
        let { keywordsSizeIndex, allSizeKeywords } =
          await chrome.storage.local.get([
            "keywordsSizeIndex",
            "allSizeKeywords",
          ]);
        keywordsSizeIndex = keywordsSizeIndex + 1;
        input = allSizeKeywords[keywordsSizeIndex];
        await chrome.storage.local.set({
          keywordsSizeIndex: keywordsSizeIndex,
        });
      }
      if (inputType == "promo") {
        let { promoSizeIndex, allSizePromo } = await chrome.storage.local.get([
          "promoSizeIndex",
          "allSizePromo",
        ]);
        promoSizeIndex = promoSizeIndex + 1;
        input = allSizePromo[promoSizeIndex];
        await chrome.storage.local.set({
          promoSizeIndex: promoSizeIndex,
        });
      }

      inputElement.value = String(input).toLowerCase();
      inputElement.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((re, _) => setTimeout(() => re(""), 2000));
      let translationOfCurrentInput = "";
      while (translationOfCurrentInput == "") {
        await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
        let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;

        if (element) {
          translationOfCurrentInput = element.innerText;
        }
      }

      currentOutput = translationOfCurrentInput;

      if (urlParams.get("tl") != "en") {
        currentOutput = (await getTranslationWithOutEnglish(
          // urlParams.get("text"),
          input,
          translationOfCurrentInput
        )) as string;
      }

      if (currentOutput.length > MAX_CHARACTER_COUNT) {
        saveTemplateAsFile("overflow.json", { output: currentOutput });
      }
    }

    resolve(currentOutput);
  });

  return promise;
};

const returnMaxCharacter = (inputType) => {
  if (["title", "subtitle"].includes(inputType)) {
    return 30;
  } else if (inputType == "description") {
    return 4000;
  } else if (inputType == "keywords") {
    return 100;
  } else if (inputType == "promo") {
    return 170;
  } else {
    return 4000;
  }
};

window.onload = async (event) => {
  console.log("page is fully loaded", window.location.origin);
  if (window.location.origin.includes("translate")) {
    const urlParams = new URLSearchParams(window.location.search);
    cachedWords = {};
    const targetLanguage = urlParams.get("tl");
    let transLationOutput = {
      output: "",
      sourceText: 0,
      sourceTitle: 0,
      title: "",
      subtitle: "",
      sourceSubTitle: 0,
      keywords: "",
      sourceKeywords: 0,
      promo: "",
      sourcePromo: 0,
    };

    //Description Logic
    let { description } = await chrome.storage.local.get(["description"]);
    let descriptionOutput = "";

    while (descriptionOutput == "") {
      await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
      let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;
      console.log("finding ", element);
      if (element) {
        descriptionOutput = element.innerText;
      }
    }

    if (targetLanguage != "en") {
      descriptionOutput = (await getTranslationWithOutEnglish(
        description,
        descriptionOutput
      )) as string;
    }

    descriptionOutput = (await returnCorrectLengthOutput(
      descriptionOutput,
      "description"
    )) as string;

    let { descriptionSizeIndex } = await chrome.storage.local.get([
      "descriptionSizeIndex",
    ]);
    transLationOutput.sourceText = descriptionSizeIndex;
    transLationOutput.output = descriptionOutput;

    //Title Logic

    let inputElement = document.querySelector("textarea");
    let { title } = await chrome.storage.local.get(["title"]);
    inputElement.value = String(title).toLowerCase();
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((re, _) => setTimeout(() => re(""), 2000));
    let titleOutput = "";

    while (titleOutput == "") {
      await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
      let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;
      console.log("finding ", element);
      if (element) {
        titleOutput = element.innerText;
      }
    }

    if (targetLanguage != "en") {
      titleOutput = (await getTranslationWithOutEnglish(
        // urlParams.get("text"),
        title,
        titleOutput
      )) as string;
    }

    titleOutput = (await returnCorrectLengthOutput(
      titleOutput,
      "title"
    )) as string;

    let { titleSizeIndex } = await chrome.storage.local.get(["titleSizeIndex"]);
    transLationOutput.sourceTitle = titleSizeIndex;
    transLationOutput.title = titleOutput;

    //Subtitle Logic

    let { subtitle } = await chrome.storage.local.get(["subtitle"]);
    inputElement.value = String(subtitle).toLowerCase();
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((re, _) => setTimeout(() => re(""), 2000));
    let subtitleOutput = "";

    while (subtitleOutput == "") {
      await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
      let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;
      console.log("finding ", element);
      if (element) {
        subtitleOutput = element.innerText;
      }
    }

    if (targetLanguage != "en") {
      subtitleOutput = (await getTranslationWithOutEnglish(
        // urlParams.get("text"),
        subtitle,
        subtitleOutput
      )) as string;
    }

    subtitleOutput = (await returnCorrectLengthOutput(
      subtitleOutput,
      "subtitle"
    )) as string;

    let { subtitleSizeIndex } = await chrome.storage.local.get([
      "subtitleSizeIndex",
    ]);
    transLationOutput.sourceSubTitle = subtitleSizeIndex;
    transLationOutput.subtitle = subtitleOutput;

    //Keyword Logic

    let { keywords } = await chrome.storage.local.get(["keywords"]);
    inputElement.value = String(keywords).toLowerCase();
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((re, _) => setTimeout(() => re(""), 2000));
    let keywordsOutput = "";

    while (keywordsOutput == "") {
      await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
      let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;
      console.log("finding ", element);
      if (element) {
        keywordsOutput = element.innerText;
      }
    }

    if (targetLanguage != "en") {
      keywordsOutput = (await getTranslationWithOutEnglish(
        // urlParams.get("text"),
        keywords,
        keywordsOutput
      )) as string;
    }

    keywordsOutput = (await returnCorrectLengthOutput(
      keywordsOutput,
      "keywords"
    )) as string;

    let { keywordsSizeIndex } = await chrome.storage.local.get([
      "keywordsSizeIndex",
    ]);
    transLationOutput.sourceKeywords = keywordsSizeIndex;
    transLationOutput.keywords = keywordsOutput;

    //Promo Logic

    let { promo } = await chrome.storage.local.get(["promo"]);
    inputElement.value = String(promo).toLowerCase();
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((re, _) => setTimeout(() => re(""), 2000));
    let promoOutput = "";

    while (promoOutput == "") {
      await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
      let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;
      console.log("finding ", element);
      if (element) {
        promoOutput = element.innerText;
      }
    }

    if (targetLanguage != "en") {
      promoOutput = (await getTranslationWithOutEnglish(
        // urlParams.get("text"),
        promo,
        promoOutput
      )) as string;
    }

    promoOutput = (await returnCorrectLengthOutput(
      promoOutput,
      "promo"
    )) as string;

    let { promoSizeIndex } = await chrome.storage.local.get(["promoSizeIndex"]);
    transLationOutput.sourcePromo = promoSizeIndex;
    transLationOutput.promo = promoOutput;

    // if (translateOutput.length > MAX_CHARACTER_COUNT) {
    //   let { descriptionSizeIndex, allSizeDescription } =
    //     await chrome.storage.local.get([
    //       "descriptionSizeIndex",
    //       "allSizeDescription",
    //     ]);
    //   descriptionSizeIndex = descriptionSizeIndex + 1;

    //   await chrome.storage.local.set({
    //     description: allSizeDescription[descriptionSizeIndex],
    //     descriptionSizeIndex: descriptionSizeIndex,
    //   });
    //   chrome.runtime.sendMessage({ type: "FROM_POPUP" });
    // }

    chrome.runtime.sendMessage(
      {
        ...transLationOutput,
        targetLanguage,
        type: "SEND_TO_BACKGROUND",
      },
      async (res) => {
        chrome.runtime.sendMessage({ type: "FROM_POPUP" });
      }
    );
  }

  if (window.location.origin.includes("https://www.google.com")) {
    let { outputJson } = await chrome.storage.local.get(["outputJson"]);

    console.log("output json is", outputJson);
    if (outputJson) {
      saveTemplateAsFile("file.json", outputJson);
      await chrome.storage.local.clear();
    }
  }
};
