import { User } from './users'

export interface Team {
  id: string
  name: string
  description: string | null
  createdAt: Date
  createdBy: Pick<User, 'name' | 'avatarUrl'>
}

export interface ListTeam {
  id: string
  name: string
  membersCount: number
}

export interface UpdateTeamData {
  name?: string
  description?: string | null
}
