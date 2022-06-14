import json
from channels.generic.websocket import WebsocketConsumer,AsyncWebsocketConsumer
from asgiref.sync import async_to_sync


class NotificationConsumer(WebsocketConsumer):
  def connect(self):
    current_user = self.scope["user"]
    self.room_name = "notifications"
    self.room_group_name= "notifications_group_"+str(current_user.id)
    # laura's only
    #self.room_group_name= "notifications_group_52"

    async_to_sync(self.channel_layer.group_add)(
      self.room_group_name,
      self.channel_name)
  
    self.accept()
    self.send(text_data=json.dumps({"status":"connection_established"}))


  def disconnect(self, *args, **kwargs):
    print("disconnected from the server")

    
  def send_notifications(self,event):
    self.send(text_data=json.dumps({"payload":event.get("value")}))

    