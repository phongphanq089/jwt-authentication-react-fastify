import { pick } from 'lodash'

export const pickUser = (user: any) => {
  if (!user) return {}
  return pick(user, [
    '_id',
    'username',
    'email',
    'avatar',
    'role',
    'isActive',
    'verify_token',
    'verify_token_expired_at',
    'createdAt',
    'updatedAt',
  ])
}
