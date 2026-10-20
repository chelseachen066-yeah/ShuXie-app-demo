import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconCamera } from '../components/icons'
import { useProfileStore } from '../store/profileStore'

export function ProfileEditPage() {
  const navigate = useNavigate()
  const nickname = useProfileStore((state) => state.nickname)
  const avatar = useProfileStore((state) => state.avatar)
  const bio = useProfileStore((state) => state.bio)
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const fileRef = useRef<HTMLInputElement>(null)

  const [newNickname, setNewNickname] = useState(nickname ?? '')
  const [newBio, setNewBio] = useState(bio ?? '')
  const [newAvatar, setNewAvatar] = useState(avatar)

  const handleSave = () => {
    updateProfile({
      nickname: newNickname.trim() || '去码头整点薯条',
      bio: newBio,
      avatar: newAvatar,
    })
    navigate(-1)
  }

  const handlePickAvatar = () => {
    fileRef.current?.click()
  }

  return (
    <div className="profile-edit-screen">
      <div className="profile-edit-nav">
        <button type="button" className="profile-edit-nav-btn" onClick={() => navigate(-1)}>
          取消
        </button>
        <h1 className="profile-edit-nav-title">编辑资料</h1>
        <button type="button" className="profile-edit-nav-btn save" onClick={handleSave}>
          保存
        </button>
      </div>

      <div className="profile-edit-scroll">
        <div className="profile-edit-card">
          <div className="edit-avatar-wrap">
            <button type="button" className="edit-avatar-btn" onClick={handlePickAvatar}>
              <div className="edit-avatar">
                {newAvatar ? (
                  <img src={newAvatar} alt="" />
                ) : (
                  <span className="edit-avatar-letter">{newNickname?.[0] ?? '我'}</span>
                )}
              </div>
              <span className="edit-camera">
                <IconCamera size={14} color="#FFFFFF" />
              </span>
            </button>
            <p className="edit-avatar-hint">点击更换头像</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  if (typeof reader.result === 'string') setNewAvatar(reader.result)
                }
                reader.readAsDataURL(file)
              }}
            />
          </div>

          <div className="edit-line" />

          <div className="edit-field">
            <span className="edit-label">昵称</span>
            <input
              className="edit-input"
              value={newNickname}
              onChange={(e) => {
                if (e.target.value.length <= 15) setNewNickname(e.target.value)
              }}
              placeholder="输入你的昵称"
              maxLength={15}
            />
            <span className="edit-count">{newNickname.length}/15</span>
          </div>

          <div className="edit-line tight" />

          <div className="edit-field top">
            <span className="edit-label">简介</span>
            <div style={{ flex: 1 }}>
              <textarea
                className="edit-textarea"
                value={newBio}
                onChange={(e) => {
                  if (e.target.value.length <= 25) setNewBio(e.target.value)
                }}
                placeholder="用一句话介绍自己…"
                maxLength={25}
              />
              <span className="edit-count right">{newBio.length}/25</span>
            </div>
          </div>
        </div>
        <p className="edit-footnote">你的昵称将显示在作品的署名处</p>
      </div>
    </div>
  )
}
