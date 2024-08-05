let languageCodes = [
  {
    lan: "Arabic",
    code: "ar",
  },
  // {
  //   lan: "Catalan",
  //   code: "co",
  // },
  // {
  //   lan: "Chinese (Simplified)",
  //   code: "zh-CN",
  // },
  // {
  //   lan: "Chinese (Traditional)",
  //   code: "zh-TW",
  // },
  // {
  //   lan: "Croatian",
  //   code: "hr",
  // },
  // {
  //   lan: "Czech",
  //   code: "cs",
  // },
  // {
  //   lan: "Danish",
  //   code: "da",
  // },
  // {
  //   lan: "Dutch",
  //   code: "nl",
  // },
  {
    lan: "English (Australia)",
    code: "en",
  },
  // {
  //   lan: "English (Canada)",
  //   code: "en",
  // },
  // {
  //   lan: "English (U.K.)",
  //   code: "en",
  // },
  // {
  //   lan: "Finnish",
  //   code: "fi",
  // },
  // {
  //   lan: "French",
  //   code: "fr",
  // },
  // {
  //   lan: "French (Canada)",
  //   code: "fr",
  // },
  // {
  //   lan: "German",
  //   code: "de",
  // },
  // {
  //   lan: "Greek",
  //   code: "el",
  // },
  // {
  //   lan: "Hebrew",
  //   code: "iw",
  // },
  // {
  //   lan: "Hindi",
  //   code: "hi",
  // },
  // {
  //   lan: "Hungarian",
  //   code: "hu",
  // },
  // {
  //   lan: "Indonesian",
  //   code: "id",
  // },
  // {
  //   lan: "Italian",
  //   code: "it",
  // },
  // {
  //   lan: "Japanese",
  //   code: "ja",
  // },
  // {
  //   lan: "Korean",
  //   code: "ko",
  // },
  // {
  //   lan: "Malay",
  //   code: "ms",
  // },
  // {
  //   lan: "Norwegian",
  //   code: "no",
  // },
  // {
  //   lan: "Polish",
  //   code: "pl",
  // },
  // {
  //   lan: "Portuguese (Brazil)",
  //   code: "pt",
  // },
  // {
  //   lan: "Portuguese (Portugal)",
  //   code: "pt-PT",
  // },
  // {
  //   lan: "Romanian",
  //   code: "ro",
  // },
  // {
  //   lan: "Russian",
  //   code: "ru",
  // },
  // {
  //   lan: "Slovak",
  //   code: "sk",
  // },
  // {
  //   lan: "Spanish (Mexico)",
  //   code: "es",
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
  // {
  //   lan: "Turkish",
  //   code: "tr",
  // },
  // {
  //   lan: "Ukrainian",
  //   code: "uk",
  // },
  // {
  //   lan: "Vietnamese",
  //   code: "vi",
  // },
];

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

      if (Array.isArray(outputJson)) {
        console.log("output json,",outputJson)
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
          currentItem.click();
          await new Promise((resolve, reject) =>
            setTimeout(() => resolve(""), 2000)
          );

          let finalDescription = outputJson.find((x) => x.code == "en").output;
          let currentCode = languageCodes.find(
            (x) => x.lan == currentItem.innerText
          );

          let currentDescription = currentCode
            ? outputJson.find((x) => x.code == currentCode.code)
            : null;
          if (currentDescription) {
            finalDescription = currentDescription.output;
          }
          let descriptionElement: HTMLElement =
            document.querySelector("[name=description]");

          if (descriptionElement) {
            descriptionElement.innerText = finalDescription;

            descriptionElement.dispatchEvent(
              new Event("input", { bubbles: true })
            );
          }

          let headingButtons = document.getElementById("heading-buttons");
          let saveButton = headingButtons.querySelector("button");
          saveButton.click();
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
  let promise = new Promise(async (resolve, reject) => {
    let inputString = String(source);
    let finalOutput =String(output)

    let allWordsInOutput = finalOutput.split(" ");

    let inputElement = document.querySelector("textarea");
    console.log("allWordsInOutput length ",allWordsInOutput.length)
    for (let i = 0; i < allWordsInOutput.length; i++) {
      let currentWord = allWordsInOutput[i];
      if (
        inputString.search(currentWord) != -1 &&
        finalOutput.search(currentWord) != -1 &&
        currentWord.trim().length > 0 &&
        isNaN(Number(currentWord)) && 
        !["-",",","."].includes(currentWord)
      ) {
          
        console.log("current word is",currentWord);
        console.log("value of i is",i);
        inputElement.value = currentWord;
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise((re, _) => setTimeout(() => re(""), 2000));
        let translateOutputofCurrentWord = "";

        while (translateOutputofCurrentWord == "") {
          await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
          let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;
     
          if (element) {
            translateOutputofCurrentWord = element.innerText;
          }
        }
        let re = new RegExp(currentWord, "g");
        finalOutput = finalOutput.replace(re,translateOutputofCurrentWord);

        console.log("final output after replace",finalOutput)
      }
    }

    resolve(finalOutput);
  });

  return promise;
};

window.onload = async (event) => {
  console.log("page is fully loaded", window.location.origin);
  if (window.location.origin.includes("translate")) {
    const urlParams = new URLSearchParams(window.location.search);
    const targetLanguage = urlParams.get("tl");
    let translateOutput = "";

    while (translateOutput == "") {
      await new Promise((rs, rj) => setTimeout(() => rs(""), 2000));
      let element = document.querySelector("[jsname='jqKxS']") as HTMLElement;
      console.log("finding ", element);
      if (element) {
        translateOutput =element.innerText;
      }
    }

    if(targetLanguage!="en"){
      translateOutput =  await getTranslationWithOutEnglish(
        urlParams.get("text"),
        translateOutput
      ) as string
    }
  

    chrome.runtime.sendMessage(
      {
        translateOutput,
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
