import { apiEndpoint } from '../config'
import { Member } from '../types/Member';
import { CreateMemberRequest } from '../types/CreateMemberRequest';
import Axios from 'axios'
import { UpdateMemberRequest } from '../types/UpdateMemberRequest';

export async function getMembers(idToken: string): Promise<Member[]> {
  console.log('Fetching members')

  const response = await Axios.get(`${apiEndpoint}/members`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Memers:', response.data)
  return response.data.items
}

export async function createMember(
  idToken: string,
  newMember: CreateMemberRequest
): Promise<Member> {
  const response = await Axios.post(`${apiEndpoint}/members`,  JSON.stringify(newMember), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchMember(
  idToken: string,
  memberId: string,
  updatedMember: UpdateMemberRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/members/${memberId}`, JSON.stringify(updatedMember), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteMember(
  idToken: string,
  memberId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/members/${memberId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  memberId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/members/${memberId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
