
## API Reference

##### Deployed BASE_URL 
```http
    https://tiffin-xoui.onrender.com
```

#### Register user 

```http
  POST /register/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tiffin-api-key` | `string` | **Required**. (Set in headers) Your API key |
| `country_code` | `string` | **Required** Country code|
|`phoneNumber`|`string` | **Required** Phone number|
|`firstname`    | `string`|**Required** First name|
|`middlename`|`string`|**Optional** Middle name |
|`lastname`|`string`|**Required** Last name|
|`email`|`string`|**Required** Email|
|`dob`|`string`|**Required** Date of birth|
|`password`|`string`|**Required** Password|
|`confirmPassword`|`string`|**Required** Confirm Password|



#### API Response 
*Succcess Response*
```json 
{
    "success": true,
    "user": {
        "created_date": "2023-09-17T10:55:18.366Z",
        "country_code": "np",
        "phoneNumber": "+9779741471190",
        "firstname": "Safal",
        "middlename": "",
        "lastname": "Shrestha",
        "email": "dev.safals3et42hdda4@gmail.com",
        "emailVerified": false,
        "dob": "2002-08-09T00:00:00.000Z",
        "userType": "user",
        "_id": "6506db1fde8a624c336f9a02",
        "__v": 0
    },
    "isSendVerificationMail": true
}

``` 
*Failure* 
```json 
{
    "success": false,
    "statusCode": 401,
    "errors": [
        "Email already exists",
        "Phone number already exists"
    ]
}
```

#### Authenticate user 


```http
  POST /login/
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tiffin-api-key` | `string` | **Required**. (Set in headers) Your API key |
|`email`|`string`|**Required** Email|
|`password`|`string`|**Required** Password|

#### API Response 
*Succcess Response*
```json
{
    "success": true,
    "isLogin": true,
    "message": "Successully logged in",
    "token": "token",
    "user": {
        "_id": "650802a3b966cbfd2f44c954",
        "created_date": "2023-09-18T07:46:37.290Z",
        "country_code": "np",
        "phoneNumber": "+9779741471190",
        "firstname": "Safal",
        "middlename": "",
        "lastname": "Shrestha",
        "email": "dev.safals3et42hdda4@gmail.com",
        "emailVerified": false,
        "dob": "2002-08-09T00:00:00.000Z",
        "userType": "user",
        "__v": 0
    }
}
```
*Failure* 
```json 
{
    "success": false,
    "isLogin": false,
    "message": "Invalid credentials"
}
```

### Update user information 
To update anything in the DB you must be authenticated user. 
If you are not sending cookies then send jwt through headers.


```code
headers:{
    'authorization':'Bearer token',
    ...
}

```
### Update name 
```http
  PATCH /user/edit/name
```


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tiffin-api-key` | `string` | **Required**. (Set in headers) Your API key |
|`firstname`|`string`|**Required** First name|
|`middlename`|`string`|**Optional** Middle name|
|`lastname`|`string`|**Required** Last name|

### Update Profile / Upload Profile  
```http
  PATCH /user/edit/profile 
```


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tiffin-api-key` | `string` | **Required**. (Set in headers) Your API key |
|`profile`|`file`|**Required** Image| 

```code
headers:{
    'Content-Type':'application/form-data',
    ...
}
```

***Note:***   *Allowed mime type   `image/jpg`, `image/jpeg`,   `image/png`, `image/gif`*
