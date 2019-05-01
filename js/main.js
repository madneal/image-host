$(function() {
  const keys = ['ak', 'sk', 'bucket', 'domain']
  let isConfig = true

  keys.forEach(key => {
    if (!localStorage[key]) {
      isConfig = false
    }
  })

  if (!isConfig) {
    chrome.tabs.create({ url: 'options.html' })
    return
  }
  const uptoken = genUpToken(
    localStorage['ak'],
    localStorage['sk'],
    localStorage['bucket']
  )

  const domain =
    localStorage['domain'].indexOf('http') == -1
      ? 'http://' + localStorage['domain']
      : localStorage['domain']

  var uploader = WebUploader.create({
    auto: true,
    swf: 'Uploader.swf',
    server: 'https://upload.qbox.me',
    pick: '#pickfiles',
    resize: false,
    dnd: '#container',
    paste: document.body,
    disableGlobalDnd: true,
    accept: [
      {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
      }
    ],
    compress: false,
    prepareNextFile: true,
    chunked: true,
    chunkSize: 4194304,
    threads: 5,
    fileNumLimit: 100,
    fileSingleSizeLimit: 10000 * 1024 * 1024,
    duplicate: true,
    formData: {
      token: uptoken
    }
  })
  uploader.on('startUpload', () => {
    $('.status').css('display', 'flex')
    $('.words').html('上传中...')
  })
  uploader.on('uploadSuccess', (file, res) => {
    $('.words').html('上传完成')
    setTimeout(() => {
      $('.status').css('display', 'none')
    }, 3000)
    $('#link-area').css('visibility', 'visible')
    console.log('response:', res)
    const link = domain + '/' + res.key
    const markdownLink = `![](${link})`
    const aLink =`<img src="${link}" />`
    $('#link').val(link)
    $('#markdown').val(markdownLink)
    $('#a-link').val(aLink)
  })
  uploader.on('uploadError', (file, reason) => {
    if (reason === 'http') {
      reason = '请检查AK/SK等配置正确，然后重新开启本窗口'
    }
    $('.words').html(`上传失败: ${reason}`)
    $('.status').css('display', 'flex')
    $('.status img').css('display', 'none')
    setTimeout(() => {
      $('.status').css('display', 'none')
      $('.status img').css('display', 'unset')
    }, 5000)
    $('#link-area').css('visibility', 'visible')
  })
 
  $('#container')
    .on('dragenter', function(e) {
      e.preventDefault()
      $('#container').addClass('draging')
      e.stopPropagation()
    })
    .on('drop', function(e) {
      e.preventDefault()
      $('#container').removeClass('draging')
      e.stopPropagation()
    })
    .on('dragleave', function(e) {
      e.preventDefault()
      $('#container').removeClass('draging')
      e.stopPropagation()
    })
    .on('dragover', function(e) {
      e.preventDefault()
      $('#container').addClass('draging')
      e.stopPropagation()
    })

  $('#link-area button[data-action=copy]').on('click', function(e) {
    const btn = e.target
    const targetId = $(btn).attr('data-action-target')
    const val = $(targetId).val()
    copyToClipboard(val)
  })

  function copyToClipboard(input) {
    const el = document.createElement('textarea')
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

    let success = false
    try {
      success = document.execCommand('copy', true)
    } catch (err) {}

    document.body.removeChild(el)

    return success
  }
})
