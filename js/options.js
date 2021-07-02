function Options() {
    const radioFields = ['region'];
    const fields = ['ak', 'sk', 'bucket', 'domain', ...radioFields]

    var bindUI = function () {
        //用localstorage中的值填充每个fields
        fields.forEach(field => {
            const ls = localStorage.getItem(field)
            if (radioFields.includes(field)) {
                const inputs = document.querySelectorAll(`#${field} input`);
                for (const input of inputs) {
                    input.checked = input.value === ls;
                }
            }
            document.querySelector(`#${field}`).value = ls ? ls : '';
        });

        //监听save按钮的click事件
        document.querySelector('.save').addEventListener('click', e => {
            fields.forEach(field => {
                let val = document.querySelector(`#${field}`).value.trim();
                if (radioFields.includes(field)) {
                    val = document.querySelector(`#${field} input:checked`).value.trim();
                }
                if (!val) {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "image.png",
                        title: "提示",
                        message: "为了图床的正常使用，请不要留空",
                        requireInteraction: true,
                    });
                    return
                }
                localStorage.setItem(field, val);
            });
            document.querySelector('.save').innerText = '保存成功';
            setTimeout(() => {
                chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                    chrome.tabs.remove(tabs[0].id);
                });
            }, 500)
        })
    };

    return {
        init: function () {
            bindUI();
        }
    };
}

const options = new Options();
options.init();
