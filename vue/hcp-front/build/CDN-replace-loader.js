const CDN_URL = 'http://img.didistatic.com/static/'; // TODO 临时随便写一个，资源申请下来后需要替换
const INDEX_URL = '';

module.exports = {
  loader: 'string-replace-loader',
  options: {
    multiple: [
      { search: '%%_CDN_URL_%%', replace: CDN_URL, flags: 'g' },
      { search: '%%_INDEX_URL_%%', replace: INDEX_URL, flags: 'g' }
    ]
  }
}
