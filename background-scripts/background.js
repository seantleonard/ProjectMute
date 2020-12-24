chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab){
    if(changeInfo.hasOwnProperty('status')){
        switch (changeInfo.status){
            case "loading":
                //This will also include a url property within changeInfo
                //Check our host table block list
                if( changeInfo.hasOwnProperty('url') ){
                    console.log("Status:" + changeInfo.status+" URL:"+changeInfo.url);

                    //set Mute State to Unmuted which avoids have to pull status, check, then update. 
                    //Question becomes whether a read and check then *potential* write
                    //is more costly than a write no matter what. May just be negligible. 
                    processFilter(changeInfo.url, tabId);
                }
                break;
            case "complete":
                break;
            default:
                console.log("General:" + changeInfo.status)
                break;
        }
    }
    if(changeInfo.hasOwnProperty('audible')){
        switch (changeInfo.audible){
            case true:
                //Check our host table block list

                //if host present, then mute tab
                
                break;
            case false:
                break;
            default:
                break;
        }
    }
});

function muteTab(_tabNumber) {
    chrome.tabs.update(_tabNumber,{"muted":true});
}

function unMuteTab(_tabNumber) {
    chrome.tabs.update(_tabNumber,{"muted":false});
}

function didHostNameChange(_tabNumber){

}

function processAllowList(_url,_tabId){
    var hostName = getHostName(_url);
    chrome.storage.local.get(hostName, function(result) {
        if(!chrome.runtime.error){
            //Unmuting because hostUrl is on the allow list. 
            console.log("Unmuting tab: "+_tabId);
            unMuteTab(_tabId);
        };
    })
}

function getHostName(_url){
    var url = new URL(_url);
    return url.hostname;
}

function processBlockList(_url,_tabId){
    var hostName = getHostName(_url);
    chrome.storage.local.get(hostName, function(result) {
        if(!chrome.runtime.error){
            //Muting tab because hostUrl is on the block list.
            console.log("Muting Tab: "+ _tabId);
            muteTab(_tabId);
        }
    });
}

function processFilter(_url,_tabId){
    var hostName = getHostName(_url);
    //check against active tabs' hostnames to check for changing hostNames
    //If changing hostnames, continue with processing. Otherwise, keep same mute state. 
    //get hostName from localStorage Key/Value pair
    chrome.storage.local.get([hostName], function(result){
        if(!chrome.runtime.error){
            //no error finding the key in our table storage:
            //why does [hostName] work and not result.hostName?
            //->because hostName is not a property/field of result
            if(result[hostName] == "block"){
                muteTab(_tabId);
            }else{
                //essentially: "allow"
                unMuteTab(_tabId)
            }
        }else{
            //no result found so we are going to mute.
            unMuteTab(_tabId);
        }
    });
}

function isChangingHostNames(_tabId, _newUrl){

}

function getTabMuteState(){

}

chrome.storage.onChanged.addListener(function(what,area){
    console.log(what);
    console.log(area);
})

chrome.windows.onCreated.addListener(function(window){
    if(window.hasOwnProperty("tabs")){
        console.log("we have tabs!");
        console.log(window);
    }else{
        console.log("we don't have tabs!");
        console.log(window);

        if(window.type == "normal" && window.incognito == false){
            //Do our setup. We don't do setup in popups, devtools, nor incognito windows.
            //New windows do not seem to have tabs if created from scratch even with "default tab"
            //New windows will only have tabs if window is created from "open tab in new window"
        }
    }
});

var tabCollection = new Map();