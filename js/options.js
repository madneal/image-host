function Options() {
  const fields = ['ak', 'sk', 'bucket', 'domain'];

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
      document.querySelector('.save').innerText = '保存成功';
      window.scrollTo(0, 0);
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
