import { MembersAccess } from '../dataLayer/membersAccess'
import { ImageUtils } from '../helpers/imageUtils';
import { MemberItem } from '../models/MemberItem'
import { CreateMemberRequest } from '../requests/CreateMemberRequest'
import { UpdateMemberRequest } from '../requests/UpdateMemberRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { MemberUpdate } from '../models/MemberUpdate';

// TODO: Implement businessLogic
const logger = createLogger('MemberAccess')
const imageUtils = new ImageUtils()
const membersAcess = new MembersAccess()

//Get member logic function
export async function getMembersForUser(userId: string): Promise<MemberItem[]> {
    logger.info('Calling getMembers function')
    return membersAcess.getAllMembers(userId)
}

//Create logic function
export async function createMember(
    newMember: CreateMemberRequest,
    userId: string
): Promise<MemberItem> {
    logger.info('Calling Create Member function')

    const memberId = uuid.v4()
    const createdAt = new Date().toISOString()
    
    const newItem = {
        userId,
        memberId,
        createdAt,
        active: true,
        attachmentUrl: '',
        ...newMember
    }
return await membersAcess.createMemberItem(newItem)
}

//Update member logic function
export async function updateMember(     
    memberId: string,
    memberUpdate: UpdateMemberRequest,
    userId: string
    ): Promise<MemberUpdate> {
    logger.info('Calling update member function')
    return membersAcess.updateMemberItem(memberId, userId, memberUpdate)           
    }

//Delete member logic function
export async function deleteMember(
    memberId: string,
    userId: string
    ): Promise<string> {
    logger.info('Calling delete member function')
    return membersAcess.deleteMemberItem(memberId, userId)
    }

//Create attachment function logic
export async function createImagePresignedUrl(
    memberId: string,
    userId: string    
    ): Promise<string> {
    logger.info('Calling create image function by user', userId, memberId)
    const s3AttachmentUrl = imageUtils.getAttachmentUrl(memberId)
    await membersAcess.updateAttachmentUrl(memberId, userId, s3AttachmentUrl)
    return imageUtils.getUploadUrl(memberId)    
}