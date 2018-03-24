import http from '../utils/Http'

export default class base {
  static baseUrl = 'http://mock.eolinker.com/td1pdjj6f0d1910c659b334de1e929b431ab8dc2c0e09fc?uri=';   // wepy.$instance.globalData.baseUrl;
  static get = http.get.bind(http);
  static put = http.put.bind(http);
  static post = http.post.bind(http);
  static delete = http.delete.bind(http);
}
