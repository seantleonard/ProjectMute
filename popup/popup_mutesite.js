const addToBlockListButton = document.getElementById("addToBlockList");
if (addToBlockListButton) {
    addToBlockListButton.onclick = function () {
        addToFilterList("block");
    }
}

const addToAllowListButton = document.getElementById("addToAllowList");
if (addToAllowListButton) {
    addToAllowListButton.onclick = function () {
        addToFilterList("allow");
    }
}

function addToFilterList(filterStatus){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var hostName = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.set({ [hostName]: filterStatus }, function () {
            console.log("Added to " +filterStatus + " list");
        });
    });
} 
chrome.storage.onChanged.addListener(function(what,area){
    console.log(what);
    console.log(area);
})