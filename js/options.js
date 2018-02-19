function Options() {
  const fields = ['ak', 'sk', 'bucket'];

  var bindUI = function () {
    fields.forEach(item => {
      chrome.storage.sync.get(item, obj => {
        if (obj[item]) {
          document.querySelector('#' + item).value = obj[item];
        }
      })
    })

    document.querySelector('.save').addEventListener('click', e => {
      fields.forEach(item => {
        const val = document.querySelector('#' + item).value.trim();
        if (val) {
          save(item, val);
        }
      })
      $('quote').text('保存成功');
      window.scrollTo(0, 0);
    })
  };

  var save = function (name, val) {
      chrome.storage.sync.set({[name]: val});
  };

  return {
      init: function () {
          bindUI();
      }
  };
}

document.onload(() => {
  var options = new Options();
  options.init();
})
