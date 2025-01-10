import type {
  Context,
  APIGatewayProxyStructuredResultV2,
  APIGatewayProxyEventV2,
  Handler,
} from "aws-lambda";
import {
  getUserBy,
  getUserBalanceBy,
  createTransaction,
  listUserTransactions
} from "./database";
import { logger } from "./logger";

interface TransferRequest {
  recipient: number
  amount: number
}


export const transfer: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  /* 
    1. get user from header (this should be a checking authentication step but I decide to skip implement this)
    2. check recipient is exists
    3. transfer
  */
  try {
    const body: TransferRequest = JSON.parse(event.body ?? "")
    const sender = await getUserBy(parseInt(event.headers["user-id"] ?? "0"))
    const recipient = await getUserBy(body.recipient)
    const transaction = await createTransaction(sender, recipient, body.amount)
    logger.info("Transfer success", {
      requestId: context.awsRequestId,
      sender: { userId: sender.user_id, name: sender.username },
      recipient: { userId: recipient.user_id, name: recipient.username },
    })
    return {
      statusCode: 200,
      body: JSON.stringify(transaction),
    };
  } catch (err) {
    logger.error("Transfer fail", {
      requestId: context.awsRequestId,
    })
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

export const balance: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const user = await getUserBy(parseInt(event.headers["user-id"] ?? "0"))
    const userBalance = await getUserBalanceBy(user.user_id)
    logger.info("get balance success", {
      requestId: context.awsRequestId,
      user: { userId: user.user_id, name: user.username },
    })
    return {
      statusCode: 200,
      body: JSON.stringify(userBalance),
    };
  } catch (err) {
    logger.error("get balance fail", {
      requestId: context.awsRequestId,
    })
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

export const transactions: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const user = await getUserBy(parseInt(event.headers["user-id"] ?? "0"))
    const query = event.queryStringParameters ?? {}
    const page = parseInt(query["page"] ?? "1")
    const limit = parseInt(query["limit"] ?? "10")
    const txns = await listUserTransactions(user.user_id, page, limit)
    logger.error("list transactions success", {
      requestId: context.awsRequestId,
      user: { userId: user.user_id, name: user.username },
    })
    return {
      statusCode: 200,
      body: JSON.stringify(txns),
    };
  } catch (err) {
    logger.error("list transactions fail", {
      requestId: context.awsRequestId,
    })
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};