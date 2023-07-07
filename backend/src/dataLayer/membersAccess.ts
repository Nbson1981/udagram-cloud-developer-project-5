import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { MemberItem } from '../models/MemberItem'
import { MemberUpdate } from '../models/MemberUpdate';

var AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('MembersAccess')

// TODO: Implement the dataLayer logic
export class MembersAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly membersTable = process.env.MEMBERS_TABLE,
        private readonly membersIndex = process.env.INDEX_NAME
    ){}

    async getAllMembers(userId: string): Promise<MemberItem[]> {
        logger.info('Getting all the member function that is called')

        const result = await this.docClient
        .query({
            TableName: this.membersTable,
            IndexName: this. membersIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        .promise()

        const items = result.Items
        return items as MemberItem[]
    }

    async createMemberItem(memberItem: MemberItem): Promise<MemberItem> {
        logger.info('Calling create member function')

        const result = await this.docClient
        .put({
            TableName: this.membersTable,
            Item: memberItem
        })
        .promise()
        logger.info('Member created', result)
        return memberItem as MemberItem
    }

    async updateMemberItem(
        memberId: string,
        userId: string,
        memberUpdate: MemberUpdate
    ): Promise<MemberUpdate> {
        logger.info('Calling update member function')

        const result = await this.docClient
        .update({
            TableName: this.membersTable,
            Key: {
            memberId,
            userId
            },
            UpdateExpression: 'set #name = :name, joinedDate = :joinedDate, active = :active',
            ExpressionAttributeValues: {
            ':name': memberUpdate.name,
            ':joinedDate': memberUpdate.joinedDate,
            ':active': memberUpdate.active
            },
            ExpressionAttributeNames: {
            '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        })
        .promise()

        const memberItemUpdate = result.Attributes
        logger.info('member updated', memberItemUpdate)
        return memberItemUpdate as MemberUpdate
        
    }

    async deleteMemberItem(memberId: string, userId: string): Promise<string> {
        logger.info('Calling delete member function')

        const result = await this.docClient
        .delete({
            TableName: this.membersTable,
            Key: {
            memberId,
            userId
            }
        })
        .promise()
        logger.info('Member deleted', result)
        return memberId as string
    }

    async updateImageUrl(memberId: string, userId: string, imageUrl: string): Promise<void> {
        await this.docClient.update({
          TableName: this.membersTable,
          Key: {
            memberId,
            userId
          },
          UpdateExpression: 'set attachmentUrl = :attachmentUrl',
          ExpressionAttributeValues:{
              ':attachmentUrl': imageUrl
          }
        }).promise()
      }
}