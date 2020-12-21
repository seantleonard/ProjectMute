chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request);
    $("head").prepend(
        `<style>
        .slide-image {
            height: auto;
            width: 100vw;
        }
        </style>`
    );

    $("body").prepend(
        `<img src="${request.url}" id="${request.imageDivId}"
    class="slide-image" /> `
    );

    $(`#${request.imageDivId}`).click(function() {
        $(`#${request.imageDivId}`).remove(`#${request.imageDivId}`);
    });

    sendResponse({fromcontent: "this message is from content.js" });
});