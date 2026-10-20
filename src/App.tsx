import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PhoneShell } from './layout/PhoneShell'
import { TabLayout } from './layout/TabLayout'
import { AuthPage } from './pages/AuthPage'
import { ChatTestPage } from './pages/ChatTestPage'
import { CreatePage } from './pages/CreatePage'
import { CollectionEditPage, ReadingSettingsPage, WorkShareImagePage } from './pages/PlaceholderPages'
import { VersionSelectPage } from './pages/VersionSelectPage'
import { WorkPreviewPage } from './pages/WorkPreviewPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { ProfilePage } from './pages/ProfilePage'
import {
  AboutPage,
  FeedbackPage,
  NotificationSettingsPage,
  PrivacyPage,
  TermsPage,
} from './pages/StaticPage'
import {
  CollectionPage,
  CollectionReaderPage,
  WorkEditPage,
  WorkPage,
} from './pages/WorkPages'
import { WorksPage } from './pages/WorksPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PhoneShell />}>
          <Route element={<TabLayout />}>
            <Route path="/" element={<WorksPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/chat-test" element={<ChatTestPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile-edit" element={<ProfileEditPage />} />
          <Route path="/work/:id" element={<WorkPage />} />
          <Route path="/work-edit/:id" element={<WorkEditPage />} />
          <Route path="/version-select" element={<VersionSelectPage />} />
          <Route path="/work-preview" element={<WorkPreviewPage />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/collection-edit" element={<CollectionEditPage />} />
          <Route path="/collection-reader/:id" element={<CollectionReaderPage />} />
          <Route path="/work-share-image" element={<WorkShareImagePage />} />
          <Route path="/reading-settings" element={<ReadingSettingsPage />} />
          <Route path="/notification-settings" element={<NotificationSettingsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user-agreement" element={<TermsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
