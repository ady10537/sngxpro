const cookieName = '酸奶机场'
const cookieKey = 'sngxpro_cookie_snjc'
const sngxpro = init()
const cookieVal = sngxpro.getdata(cookieKey)

sign()

function sign() {
	
	
  let url = { url: `https://shyni.xyz/user/checkin`, headers: { Cookie: cookieVal } }
  url.headers['Origin'] = 'https://shyni.xyz'
  url.headers['Referer'] = 'https://shyni.xyz/user'
  url.headers['Accept'] = 'application/json, text/javascript, */*; q=0.01'
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  url.headers['X-Requested-With'] = 'XMLHttpRequest'
  sngxpro.get(url, (error, response, data) => {
    const result = JSON.parse(data)
    const title = `${cookieName}`
    let subTitle = ``
    let detail = ``
    const ret = result.ret
    const msg = result.msg
    const traffic = result.traffic
    const todayUsedTraffic = result.trafficInfo.todayUsedTraffic
    const lastUsedTraffic = result.trafficInfo.lastUsedTraffic
    const unUsedTraffic = result.trafficInfo.unUsedTraffic
    if (result.ret == 1){
      subTitle = `签到结果: 成功`
      detail = `此次签到奖励: ${msg}, 总流量: ${traffic}, 今日已使用: ${todayUsedTraffic}, 近期累计使用: ${lastUsedTraffic}, 剩余流量: ${unUsedTraffic}`
    }else if (result.ret == 0) {
      subTitle = `签到结果: 您今天已签到`
    }else {
      subTitle = `签到结果: 失败`
      detail = `失败说明: ${msg}`
    }
    sngxpro.msg(title, subTitle, detail)
    sngxpro.log(`${cookieName}, data: ${data}`)
    sngxpro.done()
  })
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
