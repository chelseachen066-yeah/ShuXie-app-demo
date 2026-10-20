import { ProfileLoggedInView } from '../components/profile/ProfileLoggedInView'
import { ProfileLoggedOutView } from '../components/profile/ProfileLoggedOutView'
import { useProfileStore } from '../store/profileStore'

export function ProfilePage() {
  const isLoggedIn = useProfileStore((s) => s.isLoggedIn)
  return isLoggedIn ? <ProfileLoggedInView /> : <ProfileLoggedOutView />
}
