chrome.browserAction.onClicked.addListener(function (tab) {
    var w = 400;
    var h = 400;
    var left = Math.round((screen.width / 2) - (w / 2));
    var top = Math.round((screen.height / 2) - (h / 2));
    if (!checkOptions()) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/image.png",
            title: "提示",
            message: "首次使用请填写七牛云配置文件",
            requireInteraction: true,
        });
        return
    }
    chrome.windows.create({
        url: 'popup.html',
        width: w,
        height: h,
        focused: true,
        'left': left,
        'top': top,
        type: 'popup'
    });
});

function checkOptions() {
    const fields = ['ak', 'sk', 'bucket', 'domain'];
    fields.forEach(key => {
        if (!localStorage.getItem(key)) {
            return false;
        }
    });
    return true;
}