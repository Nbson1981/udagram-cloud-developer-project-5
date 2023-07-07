import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getMembersForUser as getMembersForUser } from '../../businessLogic/members'
import { getUserId } from '../utils';

// TODO: Get all items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const members = await getMembersForUser(userId)
    return {
         statusCode: 200,
         body: JSON.stringify({
            items: members
         }) 
      }
    }
)
    //return undefined

    handler
    .use(httpErrorHandler())
    .use(
      cors({
        credentials: true
      })
    )
