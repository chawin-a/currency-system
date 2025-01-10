import { APIGatewayProxyEventHeaders, APIGatewayProxyEventV2, Context } from "aws-lambda"
import { transactions, transfer, balance } from "../src/handler"
import { assert } from 'chai'
import { Transaction, TransactionEntry, UserBalance } from "../src/database"

describe("get balance", () => {
  it("should get balance", async () => {
    const event: APIGatewayProxyEventV2 = {
      body: '',
      headers: {
        "user-id": "1"
      },
      isBase64Encoded: false,
      pathParameters: {},
      queryStringParameters: {},
      requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        domainName: "local",
        http: {
          method: "",
          path: "",
          protocol: "",
          sourceIp: "",
          userAgent: ""
        },
        domainPrefix: "123",
        routeKey: "",
        time: "123",
        timeEpoch: 123,
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        stage: 'dev',
      },
      stageVariables: {},
      version: "",
      routeKey: "",
      rawPath: "",
      rawQueryString: ""
    };
    const context: Context = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'lambdaHandler',
      functionVersion: '1.0',
      invokedFunctionArn: 'arn:1234567890:lambda:lambdaHandler',
      memoryLimitInMB: '128',
      awsRequestId: '1234567890',
      logGroupName: 'lambdaHandlerLogGroup',
      logStreamName: 'c6a789dff9326bc178',
      getRemainingTimeInMillis: function (): number {
        throw new Error('Function not implemented.');
      },
      done: function (error?: Error, result?: any): void {
        throw new Error('Function not implemented.');
      },
      fail: function (error: string | Error): void {
        throw new Error('Function not implemented.');
      },
      succeed: function (messageOrObject: any): void {
        throw new Error('Function not implemented.');
      }
    };
    const res = await balance(event, context, () => { })
    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body) as UserBalance
    assert.equal(body.user_id, 1)
  })
})

describe("post transfer", () => {
  it("should post transfer", async () => {
    const event: APIGatewayProxyEventV2 = {
      body: JSON.stringify({
        "recipient": 2,
        "amount": 10,
      }),
      headers: {
        "user-id": "1"
      },
      isBase64Encoded: false,
      pathParameters: {},
      queryStringParameters: {
        "page": "1",
        "limit": "5"
      },
      requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        domainName: "local",
        http: {
          method: "",
          path: "",
          protocol: "",
          sourceIp: "",
          userAgent: ""
        },
        domainPrefix: "123",
        routeKey: "",
        time: "123",
        timeEpoch: 123,
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        stage: 'dev',
      },
      stageVariables: {},
      version: "",
      routeKey: "",
      rawPath: "",
      rawQueryString: ""
    };
    const context: Context = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'lambdaHandler',
      functionVersion: '1.0',
      invokedFunctionArn: 'arn:1234567890:lambda:lambdaHandler',
      memoryLimitInMB: '128',
      awsRequestId: '1234567890',
      logGroupName: 'lambdaHandlerLogGroup',
      logStreamName: 'c6a789dff9326bc178',
      getRemainingTimeInMillis: function (): number {
        throw new Error('Function not implemented.');
      },
      done: function (error?: Error, result?: any): void {
        throw new Error('Function not implemented.');
      },
      fail: function (error: string | Error): void {
        throw new Error('Function not implemented.');
      },
      succeed: function (messageOrObject: any): void {
        throw new Error('Function not implemented.');
      }
    };
    const res = await transfer(event, context, () => { })
    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body) as Transaction
    assert.equal(body.transaction_status, "SUCCESS")
  })
})

describe("get transactions", () => {
  it("should get transactions", async () => {
    for (let i = 0; i < 5; i++) {
      const event: APIGatewayProxyEventV2 = {
        body: JSON.stringify({
          "recipient": 2,
          "amount": 10,
        }),
        headers: {
          "user-id": "1"
        },
        isBase64Encoded: false,
        pathParameters: {},
        queryStringParameters: {
          "page": "1",
          "limit": "5"
        },
        requestContext: {
          accountId: '123456789012',
          apiId: '1234',
          domainName: "local",
          http: {
            method: "",
            path: "",
            protocol: "",
            sourceIp: "",
            userAgent: ""
          },
          domainPrefix: "123",
          routeKey: "",
          time: "123",
          timeEpoch: 123,
          requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
          stage: 'dev',
        },
        stageVariables: {},
        version: "",
        routeKey: "",
        rawPath: "",
        rawQueryString: ""
      };
      const context: Context = {
        callbackWaitsForEmptyEventLoop: false,
        functionName: 'lambdaHandler',
        functionVersion: '1.0',
        invokedFunctionArn: 'arn:1234567890:lambda:lambdaHandler',
        memoryLimitInMB: '128',
        awsRequestId: '1234567890',
        logGroupName: 'lambdaHandlerLogGroup',
        logStreamName: 'c6a789dff9326bc178',
        getRemainingTimeInMillis: function (): number {
          throw new Error('Function not implemented.');
        },
        done: function (error?: Error, result?: any): void {
          throw new Error('Function not implemented.');
        },
        fail: function (error: string | Error): void {
          throw new Error('Function not implemented.');
        },
        succeed: function (messageOrObject: any): void {
          throw new Error('Function not implemented.');
        }
      };
      const res = await transfer(event, context, () => { })
      assert.equal(res.statusCode, 200)
      const body = JSON.parse(res.body) as Transaction
      assert.equal(body.transaction_status, "SUCCESS")
    }

    const event: APIGatewayProxyEventV2 = {
      body: '',
      headers: {
        "user-id": "1"
      },
      isBase64Encoded: false,
      pathParameters: {},
      queryStringParameters: {
        "page": "1",
        "limit": "5"
      },
      requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        domainName: "local",
        http: {
          method: "",
          path: "",
          protocol: "",
          sourceIp: "",
          userAgent: ""
        },
        domainPrefix: "123",
        routeKey: "",
        time: "123",
        timeEpoch: 123,
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        stage: 'dev',
      },
      stageVariables: {},
      version: "",
      routeKey: "",
      rawPath: "",
      rawQueryString: ""
    };
    const context: Context = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'lambdaHandler',
      functionVersion: '1.0',
      invokedFunctionArn: 'arn:1234567890:lambda:lambdaHandler',
      memoryLimitInMB: '128',
      awsRequestId: '1234567890',
      logGroupName: 'lambdaHandlerLogGroup',
      logStreamName: 'c6a789dff9326bc178',
      getRemainingTimeInMillis: function (): number {
        throw new Error('Function not implemented.');
      },
      done: function (error?: Error, result?: any): void {
        throw new Error('Function not implemented.');
      },
      fail: function (error: string | Error): void {
        throw new Error('Function not implemented.');
      },
      succeed: function (messageOrObject: any): void {
        throw new Error('Function not implemented.');
      }
    };
    const res = await transactions(event, context, () => { })
    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body) as TransactionEntry[]
    assert.equal(body.length, 5)
    for (let i = 0; i < 5; i++) {
      assert.equal(body[i].amount, 10)
      assert.equal(body[i].transaction_entry_status, 'SUCCESS')
    }
  })
})