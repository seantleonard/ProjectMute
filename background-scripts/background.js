chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab){
    console.log(tabId, changeInfo);
    console.log("Hello Sean Boy");
});