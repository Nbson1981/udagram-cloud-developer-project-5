import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createImagePresignedUrl } from '../../businessLogic/members'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const memberId = event.pathParameters.memberId
    // TODO: Return a presigned URL to upload a file for a item with the provided id
    const userId = getUserId(event)
    console.log('userId:', userId)
    const url = await createImagePresignedUrl(
     memberId,
     userId    
    )
    return {
     statusCode: 201,
     body: JSON.stringify({
       uploadUrl: url
     })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
