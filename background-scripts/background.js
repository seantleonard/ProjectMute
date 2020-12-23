chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab){
    console.log(changeInfo);
    if(changeInfo.hasOwnProperty('status')){
        switch (changeInfo.status){
            case "loading":
                //This will also include a url property within changeInfo
                console.log("jango!:" + changeInfo.status);
                //Check our host table block list
                if( changeInfo.hasOwnProperty('url') ){
                    //set Mute State to Unmuted which avoids have to pull status, check, then update. 
                    //Question becomes whether a read and check then *potential* write
                    //is more costly than a write no matter what. May just be negligible. 
                    processBlockList(changeInfo.url, tabId);

                }
                //Check tab muted state

                //If bad site && not Muted ==> Mute
                // if( inBlockList(changeInfo.url)){
                //     muteTab(tabId);
                // }
                //If bad site && muted ==> Do nothing

                //If good site && muted ==> UnMute

                //If good site && not muted ==> Do nothing
                break;
            case "complete":
                console.log("boba!:" + changeInfo.status)
                break;
            default:
                console.log("general!:" + changeInfo.status)
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

function getTabMuteState(){

}

// function addToBlockList(hostName){
//     chrome.storage.local.set({hostName:"block"},function(){
//         console.log("Block value is set to block");
//     });
// }

// function addToAllowList(hostName){
//     chrome.storage.local.set({hostName:"allow"},function(){
//         console.log('value is set to allow');
//     });
// }

chrome.storage.onChanged.addListener(function(what,area){
    console.log(what);
    console.log(area);
})