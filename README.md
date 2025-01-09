# Currency system

A gaming platform with an in-game currency system. 


**_NOTE:_** This project is used for interviewing process.

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```
**_NOTE:_** I haven't tried this yet because I focus on testing in local instead.


### Local development

The easiest way to develop and test your function is to use the `serverless-offline` command:

```
serverless offline
```

### Invocation

After successful deployment, you can call the created application via HTTP:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to:

```json
{ "message": "Go Serverless v4! Your function executed successfully!" }
```
