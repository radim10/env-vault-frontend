export interface Team {
  id: string
  name: string
  description: string | null
  createdAt: Date
}

export interface ListTeam {
  id: string
  name: string
  membersCount: number
}
