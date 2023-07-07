import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateMemberRequest } from '../../requests/CreateMemberRequest'
import { getUserId } from '../utils';
import { createMember } from '../../businessLogic/members'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newMember: CreateMemberRequest = JSON.parse(event.body)
    // TODO: Implement creating a new member
    const userId = getUserId(event)
    const newItem = await createMember(newMember, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }

    //return undefined
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
