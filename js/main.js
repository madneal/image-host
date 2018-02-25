
$(function() {
  const keys = ['ak', 'sk', 'bucket', 'domain'];
  let isConfig = true;
  
  keys.forEach(key => {
    if (!localStorage[key]) {
      isConfig = false;
    }
  })

  if (!isConfig) {
    chrome.tabs.create({url: 'options.html'});
  }
  const uptoken = genUpToken(localStorage['ak'], localStorage['sk'], localStorage['bucket']);
  const domain = localStorage['domain'].indexOf('http') == -1 ? 'http://' + localStorage['domain'] : localStorage['domain'];
  var uploader = Qiniu.uploader({
    disable_statistics_report: false,
    runtimes: 'html5,flash,html4',
    browse_button: 'pickfiles',
    container: 'container',
    drop_element: 'container',
    max_file_size: '1000mb',
    flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
    uptoken: uptoken,
    domain: 'https://upload.qbox.me',
    get_new_uptoken: false,
    auto_start: true,
    log_level: 5,
    init: {
      'BeforeChunkUpload': function(up, file) {
        console.log("before chunk upload:", file.name);
      },
      'FilesAdded': function(up, files) {
        $('.words').html('上传中...');
      },
      'BeforeUpload': function(up, file) {
        console.log("this is a beforeupload function from init");
        var chunk_size = plupload.parseSize(this.getOption(
          'chunk_size'));
      },
      'UploadProgress': function(up, file) {
      },
      'UploadComplete': function() {
        $('.words').html('上传完成');
        $('.status').css('display', 'flex');
        setTimeout(() => {
          $('.status').css('display', 'none');
        }, 3000);
        $('#link-area').css('visibility', 'visible');

      },
      'FileUploaded': function(up, file, info) {
        console.log("response:", info.response);
        res = info.response;
        res = JSON.parse(res);
        const link = domain + '/' + res.key;
        const markdownLink = '![' + res.key + '](' + link + ')';
        const aLink = '<a href="' + link + '"><img src="' + link + '" alt="' + res.key + '"></a>';
        $('#link').val(link);
        $('#markdown').val(markdownLink);
        $('#a-link').val(aLink);
      },
      'Error': function(up, err, errTip) {
        }
    }
  });

  $('#container').on(
    'dragenter',
    function(e) {
      e.preventDefault();
      $('#container').addClass('draging');
      e.stopPropagation();
    }
  ).on('drop', function(e) {
    e.preventDefault();
    $('#container').removeClass('draging');
    e.stopPropagation();
  }).on('dragleave', function(e) {
    e.preventDefault();
    $('#container').removeClass('draging');
    e.stopPropagation();
  }).on('dragover', function(e) {
    e.preventDefault();
    $('#container').addClass('draging');
    e.stopPropagation();
  });

  $('#link-area').on('click', function(e) {
    const btn = e.target;
    const targetId = $(btn).attr('data-action-target');
    const val = $(targetId).val();
    copyToClipboard(val);
  });

  function copyToClipboard(input) {
    const el = document.createElement('textarea');
    el.style.fontsize = '12pt'
    el.style.border = '0'
    el.style.padding = '0'
    el.style.margin = '0'
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    el.setAttribute('readonly', '')
    el.value = input

    document.body.appendChild(el)
    el.select()

    let success = false;
    try {
      success = document.execCommand('copy', true);
    } catch (err) { }

    document.body.removeChild(el);

    return success;
  }
});
