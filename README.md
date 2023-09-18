
## API Reference

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
|`dob`||`string`|**Required** Date of birth|
|`password`|`string`|**Required** Password|
|`confirmPassword`|`string`|**Required** Confirm Password|


#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

