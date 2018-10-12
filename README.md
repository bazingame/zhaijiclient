# zhaijiclient
A mini program to solve the trouble of getting express for college students(only client)

---

## 未完成

- 寄快递

- 用户协议，隐私协议

------

### 测试发现的问题

**`necessary`**

- 订单列表页变形

  > 因为新添加了快递地址，所以会多出几个字，order/substitude_take_package这几页均会出现这个移位的情况，还有收货地址字数过多时会移位，还有备注字数过多时

- 未注册时在service页进入注册，返回后点击配送地址至仍然提示未注册

- 选择物流地址的页面上面的标题要改

- 普通用户的订单详情页，根据`refund_apply`和`refund_status`进行显示退款状态

  > `refund_apply`在有退款操作时为1，无时为null
  >
  > `refund_status`在`refund_status`为1时有值，分别可能为`退款成功` `退款关闭` `退款处理中` `退款异常`
  >
  > 根据refund_apply来决定是否显示refund_status

---

**`not necessary`**

- 快递点和快递状态不明显

- iphone保险额变形
- 图片模糊

---





> 注意：可以使用以下接口进行身份变换
>
> 均为GET方法，可在`浏览器`中直接操作，注意`user_id`,`deliverer_id`会变换在变更用户身份后，即使再次变回来

### 1.转换为普通用户

HTTP: **`GET`**
URL: `{host}/profess/to-user/{deliverer_id}
HTTP头信息:`Authorization:authorization`

参数说明:
| 参数名       | 类型   | 描述       | 示例       |
| ------------ | ------ | ---------- | ---------- |
| deliverer_id | String | 快递员编号 | D_00000001 |
| **response** |        |            |            |
| 无           | 无     | 无         | 无         |

调用成功的返回值示例：
```json
{
    "errcode": 0,
    "status": 200,
    "errmsg": "请求成功",
    "data": {
        "open_id": "oU7a05GPfgn_tIZIDsFR6Xm0tUm4",
        "phone": "18670999799",
        "register_time": "2018-10-12 21:47:19",
        "headimg_url": "https://zhaiji.hammerfood.cn/storage/images/package1.png",
        "user_id": "U_00000022"
    }
}
```

### 2.转换为快递员

HTTP: **`GET`**
URL: `{host}/profess/to-deliverer/{user_id}
HTTP头信息:`Authorization:authorization`

参数说明:
| 参数名       | 类型   | 描述     | 示例       |
| ------------ | ------ | -------- | ---------- |
| user_id      | String | 用户编号 | U_00000001 |
| **response** |        |          |            |
| 无           | 无     | 无       | 无         |

调用成功的返回值示例：
```json
{
    "errcode": 0,
    "status": 200,
    "errmsg": "请求成功",
    "data": {
        "open_id": "oU7a05GPfgn_tIZIDsFR6Xm0tUm4",
        "phone": "18670999799",
        "register_time": {
            "date": "2018-10-12 21:47:19.000000",
            "timezone_type": 3,
            "timezone": "Asia/Shanghai"
        },
        "name": "deliverer",
        "mark": 0,
        "order_count": 0,
        "order_money": 0,
        "order_money_today": 0,
        "order_count_today": 0,
        "deliverer_id": "D_00000012",
        "updated_at": "2018-10-13 06:13:03",
        "created_at": "2018-10-13 06:13:03"
    }
}
```