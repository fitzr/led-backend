# LED デバイス通信 MQTT インターフェースリファレンス

以下のMQTTを使用した通信により、LEDデバイスとサーバーの連携を実現します。
* スマートフォンからの状態変更リクエストを受け付けるための subscribe
* LEDデバイスの現在の状態をサーバーに通知するための publish

## 前提

### 証明書の発行
以下記載の、デバイスを一意に識別するID (以下「デバイスID」) および、デバイスIDに紐づく証明書をデバイスごとに発行します。  
デバイスは、予めこれらを組込んだ状態である必要があります。  
スマートフォンアプリ側は、操作時にこのデバイスIDを知っている必要があります。

| 名前 | 説明 | 形式 | 備考 |
----|----|----|----
| device_id | デバイスID | 文字列 |
| ca.crt | 認証局証明書 | ファイル | 全デバイス共通 |
| device.crt | デバイス証明書 | ファイル |
| device.key | デバイス秘密鍵 | ファイル |

### MQTT コネクションパラメータ
MQTT使用時、以下をパラメータに設定してください。

| 名前 | 説明 | 備考 |
----|----|----
| host | MQTT host | 別途ご連絡します |
| port | MQTT port | 8883 |
| client_id | クライアントID | 上記 device_id |
| cafile | 認証局証明書 | 上記 ca.crt |
| cert | デバイス証明書 | 上記 device.crt |
| key | デバイス秘密鍵 | 上記 device.key |

### サーバーへのデバイス登録
デバイスは初回通信時にサーバーに自動登録されます。  
ただし、初回に mosquitto_pub コマンドを実行すると、登録処理が間に合わずトピックの発行がエラーになるということが起こりえます。  
初回は、connect または、subscribe を先に行ってください。   

### デバイス状態スキーマ

```javascript
{
  "state":{
    "color":"green"
  }
}
```


## 通信内容

### 状態変更リクエスト受付 
以下のトピックを subscribe することで、状態変更リクエストを受信します。

```
$aws/things/{device_id}/shadow/update/delta
```

受信するメッセージは以下のような内容となります。(可視性を考慮し整形してますが、改行空白はありません。)
```javascript
{
  "version":1234,
  "timestamp":1582694282,
  "state":{
    "color":"green"
  },
  "metadata":{
    "color":{
      "timestamp":1582694282
    }
  }
}
```

### 現在の状態を通知
以下のトピックを publish することで、現在の状態をサーバーに通知します。

```
$aws/things/{device_id}/shadow/update
```


送信するメッセージは以下のような内容となります。(可視性を考慮し整形してますが、改行空白は不要です。)
```javascript
{
  "state":{
    "color":"green"
  }
}
```



## その他
### 通信について
上記、デバイスとバックエンドの接続は、AWS IoT を用いて実現しています。  
そのため、必要に応じ、デバイス側で [AWS IoT SDK](https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/iot-sdks.html) などのAWSが提供するツールを使用することが可能です。

### MQTTトピックについて
上記、MQTTトピックは [デバイスシャドウのMQTTトピック](https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic) に基づいています。  
デバイスからは、[delta トピック](https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic) によるリクエスト受付および [update トピック](https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/device-shadow-mqtt.html#update-pub-sub-topic)による状態通知を行う形となります。









