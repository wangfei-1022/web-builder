import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { getToken } from '@/utils/auth'
import EventBus from '@/utils/bus' // bus

const WebsocketInstance = {
  name: 'Websocket',
  reconnectNum: 3,
  stompClient: null,
  connect() {
    if (getToken() && !this.stompClient) {
      const socket = new SockJS(`${process.env.VUE_APP_BASE_API}/api/comm-service/ws?Authorization=` + getToken(), null, { timeout: 60000, transports: 'websocket' })
      this.stompClient = Stomp.over(socket)
      this.stompClient.connect({}, WebsocketInstance.onConnected.bind(WebsocketInstance), WebsocketInstance.onError.bind(WebsocketInstance))
    }
    return this.stompClient
  },
  onConnected() {
    this.stompClient.subscribe('/app/public', WebsocketInstance.onMessageReceived)
    this.stompClient.subscribe('/user/message', WebsocketInstance.onMessageReceived)
    this.stompClient.subscribe('/user/business', WebsocketInstance.onMessageReceived)
  },
  onMessageReceived(payload) {
    try {
      let item = JSON.parse(payload.body)
      EventBus.$bus.$emit('system/message', item)
    } catch (error) {
      console.log(error)
    }
  },
  onBusinessReceived(payload) {
    try {
      let body = JSON.parse(payload.body)
      let content = JSON.parse(body.content)
      EventBus.$bus.$emit('business/message', { ...body, ...content })
    } catch (error) {
      console.log(error)
    }
  },
  onError(err) {
    console.log(err)
    // reconnect 3
    if (this.reconnectNum > 0) {
      this.reconnectNum = this.reconnectNum - 1
      setTimeout(this.connect, 300000)
    } else {
      this.reconnectNum = 3
    }
  },
  disconnect() {
    this.stompClient && this.stompClient.disconnect(() => {
      this.stompClient = null
    })
  }
}

export default WebsocketInstance
