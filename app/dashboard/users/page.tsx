import { Users } from 'lucide-react'
import { getUsers } from '@/app/actions/users'
import { UsersTable } from '@/components/users/users-table'
import { ExportUsers } from '@/components/users/export-users'

export default async function UsersPage() {
  try {
    const users = await getUsers()
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Utilisateurs</h1>
            <Users className="h-6 w-6" />
          </div>
          <ExportUsers users={users} />
        </div>
        <UsersTable users={users} />
      </div>
    )
  } catch (error) {
    console.error('Error loading users:', error)
    return <div>Une erreur s'est produite lors du chargement des utilisateurs.</div>
  }
}

