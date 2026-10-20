export interface Tag {
  id: string
  label: string
  type: 'genre' | 'emotion' | 'topic'
}

export interface Work {
  id: string
  title: string
  excerpt: string
  body: string
  tags: Tag[]
  collectionId?: string
  updatedAt: number
}

export interface Collection {
  id: string
  name: string
  cover?: string
  cover_url?: string
  desc: string
  works: string[]
  tags?: string[]
  updatedAt?: number
}

export type CreateStatus =
  | 'idle'
  | 'chatting'
  | 'material_ready'
  | 'generating'
  | 'selecting'
  | 'previewing'

export type CreateMessageType =
  | 'normal'
  | 'action_card'
  | 'generating_card'
  | 'direct_write_preview'

export interface CreateMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
  type?: CreateMessageType
}

/** 演示回放特有：恢复会话时用来接着播放剧本（原 App 靠真实消息接着聊，不需要这个） */
export interface ReplaySnapshot {
  scriptId: string | null
  mode: 'chat' | 'direct'
  cursor: number
  phase: 'playing' | 'awaiting_user' | 'action' | 'generating' | 'selecting'
  actionCard: { gender: '男生' | '女生' | '不限'; perspective: '以我的口吻' | '以旁观者视角'; protagonistName: string } | null
  selectedVersionIndex: 0 | 1 | null
  previewTitle: string
  previewBody: string
}

export interface HistorySession {
  id: string
  messages: CreateMessage[]
  status: 'in_progress' | 'completed'
  firstMessage: string
  createdAt: number
  updatedAt: number
  replay?: ReplaySnapshot
}

export type ReaderHighlight = {
  id: string
  workId: string
  paragraphIndex: number
  start: number
  end: number
  text?: string | null
}

export type ReadingColorKey = 'white' | 'warm' | 'green' | 'night'
export type ReadingTextureKey = 'none' | 'texture1' | 'texture2' | 'texture3' | 'texture4'

export interface ProfileState {
  isLoggedIn: boolean
  id: string
  nickname: string
  avatar: string | null
  bio: string
}

export interface ReadingSettingsState {
  colorKey: ReadingColorKey
  textureKey: ReadingTextureKey
  fontSize: number
  brightness: number
}
