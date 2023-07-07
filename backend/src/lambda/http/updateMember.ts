import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateMember } from '../../businessLogic/members'
import { UpdateMemberRequest } from '../../requests/UpdateMemberRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const memberId = event.pathParameters.memberId
    const updatedMember: UpdateMemberRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    console.log('userId:', userId)
    await updateMember(
      memberId,
      updatedMember,
      userId
    )
    return {
      statusCode: 204,
      body: ''
    }
  }
)
 //   return undefined


handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
