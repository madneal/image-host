function Options() {
  const fields = ['ak', 'sk', 'bucket', 'domain'];
  let isConfig = true;

  var bindUI = function () {
    fields.forEach(item => {
      document.querySelector('#' + item).value = localStorage[item] ? localStorage[item] : '';
    })

    document.querySelector('.save').addEventListener('click', e => {
      fields.forEach(item => {
        const val = document.querySelector('#' + item).value.trim();
        if (val) {
          localStorage[item] = val;
        }
      })
      fields.forEach(key => {
        if (!localStorage[key]) {
          isConfig = false;
        }
      })
      if (isConfig) {
        document.querySelector('.save').innerText = '保存成功';
        setTimeout(() => {
          chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
            chrome.tabs.remove(tabs[0].id);
          })
        }, 1500)
      }
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
