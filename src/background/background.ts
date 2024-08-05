chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type == "FROM_POPUP") {
    let { description, codeMapping, reachedIndex, outputJson } =
      await chrome.storage.local.get([
        "description",
        "codeMapping",
        "reachedIndex",
        "outputJson",
      ]);
    console.log("description is ", description);
    if (Array.isArray(codeMapping)) {
      let reachedCode = codeMapping[reachedIndex];

      if (reachedCode?.code) {
        let newURL = new URL(
          `https://translate.google.co.in/?sl=en&tl=${reachedCode.code}&text=${description}&op=translate`
        );
        newURL.searchParams.set("text", description);
        console.log("new urkl", newURL);

        await chrome.tabs.create({
          url: newURL.toString(),
          active: true,
        });
      } else {
        let newURL = `https://www.google.com/`;
        await chrome.tabs.create({
          url: newURL,
          active: true,
        });
      }
    }
  }

  if (msg.type == "SEND_TO_BACKGROUND") {
    chrome.tabs.remove(sender.tab.id);
    let { codeMapping, reachedIndex, outputJson } =
      await chrome.storage.local.get([
        "outputJson",
        "codeMapping",
        "reachedIndex",
      ]);

    await chrome.storage.local.set({ reachedIndex: reachedIndex + 1 });
    let currentLanguage = codeMapping.find((x) => x.code == msg.targetLanguage);
    if (outputJson) {
      let currentLanguageOutput = outputJson.find(
        (x) => x.code == msg.targetLanguage
      );
      if (currentLanguageOutput) {
        currentLanguageOutput.output = msg.translateOutput;
      } else {
        outputJson.push({ ...currentLanguage, output: msg.translateOutput });
      }
      await chrome.storage.local.set({ outputJson: outputJson });
      await chrome.storage.local.set({ reachedIndex: reachedIndex + 1 });
    } else {
      let newObject = [{ ...currentLanguage, output: msg.translateOutput }];
      await chrome.storage.local.set({ outputJson: newObject });
    }

    sendResponse("done");
    // let foundTabs = await chrome.tabs.query({
    //   url: "https://appstoreconnect.apple.com/*",
    // });
    // let appStroreTabs = foundTabs[0];
    // if (appStroreTabs) {
    //   chrome.tabs.sendMessage(appStroreTabs.id, {
    //     ...msg,
    //     type: "SEND_TO_APPSTORE",
    //   });
    // }
  }
});
