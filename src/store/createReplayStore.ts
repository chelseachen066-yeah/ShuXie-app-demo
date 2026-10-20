import { create } from 'zustand'
import {
  CREATE_SCRIPTS,
  DEMO_HINT,
  DIRECT_WRITE,
  getScriptById,
  type ActionCardDefaults,
} from '../mock/scripts'
import { useSessionStore } from './sessionStore'

export type ReplayMessage = {
  id: string
  role: 'ai' | 'user'
  text: string
  thinking?: boolean
}

export type ReplayPhase =
  | 'idle'
  | 'direct_sheet'
  | 'playing'
  | 'awaiting_user'
  | 'action'
  | 'generating'
  | 'selecting'

type CreateReplayState = {
  phase: ReplayPhase
  mode: 'chat' | 'direct'
  scriptId: string | null
  cursor: number
  messages: ReplayMessage[]
  pendingSuggestion: string | null
  actionCard: ActionCardDefaults | null
  selectedVersionIndex: 0 | 1 | null
  previewTitle: string
  previewBody: string
  sessionId: string | null
  directDraft: string
  startScript: (scriptId: string) => void
  sendSuggested: () => void
  sendFreeText: (text: string) => void
  confirmActionCard: (details: ActionCardDefaults) => void
  openDirectWrite: () => void
  closeDirectWrite: () => void
  setDirectDraft: (text: string) => void
  submitDirectWrite: () => void
  selectVersion: (index: 0 | 1) => void
  updatePreview: (title: string, body: string) => void
  resetIdle: () => void
  /** 从历史抽屉恢复会话；返回恢复后应该去的位置（已完成的会话去预览 / 选版本页） */
  resumeSession: (sessionId: string) => 'chat' | '/work-preview' | '/version-select' | null
  /** 保存作品后把当前会话标成已完成 */
  markCompleted: () => void
}

let runToken = 0

function bumpRun() {
  runToken += 1
  return runToken
}

function sleep(ms: number, token: number) {
  return new Promise<boolean>((resolve) => {
    window.setTimeout(() => resolve(token === runToken), ms)
  })
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function thinkingDelay() {
  return 1000 + Math.floor(Math.random() * 1000)
}

async function typeMessage(id: string, full: string, token: number) {
  // 与 App 的 AiTypewriterBubble 一致：每 30ms 多显示 1 个字
  for (let i = 0; i < full.length; i += 1) {
    if (token !== runToken) return
    const next = full.slice(0, i + 1)
    useCreateReplayStore.setState((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, thinking: false, text: next } : message,
      ),
    }))
    const ok = await sleep(30, token)
    if (!ok) return
  }
  useCreateReplayStore.setState((state) => ({
    messages: state.messages.map((message) =>
      message.id === id ? { ...message, thinking: false, text: full } : message,
    ),
  }))
}

async function playAiText(full: string, token: number) {
  const id = uid('ai')
  useCreateReplayStore.setState((state) => ({
    phase: 'playing',
    pendingSuggestion: null,
    messages: [...state.messages, { id, role: 'ai', text: '', thinking: true }],
  }))
  const waited = await sleep(thinkingDelay(), token)
  if (!waited) return
  await typeMessage(id, full, token)
}

function afterScriptAdvance(cursor: number, token: number) {
  if (token !== runToken) return
  const script = getScriptById(useCreateReplayStore.getState().scriptId)
  if (!script) return

  if (cursor >= script.turns.length) {
    useCreateReplayStore.setState({
      phase: 'action',
      cursor,
      pendingSuggestion: null,
      actionCard: script.actionCard,
    })
    return
  }

  const line = script.turns[cursor]
  if (line.role === 'user') {
    useCreateReplayStore.setState({
      phase: 'awaiting_user',
      cursor,
      pendingSuggestion: line.text,
    })
    return
  }

  void playScriptAi(token)
}

async function playScriptAi(token: number) {
  const state = useCreateReplayStore.getState()
  const script = getScriptById(state.scriptId)
  if (!script) return
  const line = script.turns[state.cursor]
  if (!line || line.role !== 'ai') {
    afterScriptAdvance(state.cursor, token)
    return
  }
  await playAiText(line.text, token)
  if (token !== runToken) return
  const next = state.cursor + 1
  useCreateReplayStore.setState({ cursor: next })
  afterScriptAdvance(next, token)
}

async function playHintThenWait(token: number) {
  await playAiText(DEMO_HINT, token)
  if (token !== runToken) return
  const state = useCreateReplayStore.getState()
  const script = getScriptById(state.scriptId)
  const line = script?.turns[state.cursor]
  if (line?.role === 'user') {
    useCreateReplayStore.setState({
      phase: 'awaiting_user',
      pendingSuggestion: line.text,
    })
    return
  }
  if (script && state.cursor >= script.turns.length) {
    useCreateReplayStore.setState({
      phase: 'action',
      pendingSuggestion: null,
      actionCard: script.actionCard,
    })
    return
  }
  // 自由输入、没有对应剧本：回到等待输入，可以继续发（每次都回演示提示）
  useCreateReplayStore.setState({ phase: 'awaiting_user', pendingSuggestion: null })
}

/**
 * 把当前会话写进历史（对应 App 的 persistActiveSession / saveAndCreateNew）。
 * 状态规则同 App：到了选版本（selecting）算已完成，其余是进行中。
 * 由下面的 subscribe 在“消息条数 / 阶段 / 游标 / 版本选择”变化时自动调用，
 * 打字机逐字更新不会触发。
 */
let suppressPersist = false

function persistSession(forceCompleted = false) {
  const state = useCreateReplayStore.getState()
  if (!state.sessionId) return
  const messages = state.messages.filter((message) => !message.thinking)
  if (messages.length === 0) return
  if (
    state.phase === 'idle' ||
    state.phase === 'direct_sheet'
  ) {
    return
  }

  const history = useSessionStore.getState().history
  const existing = history.find((item) => item.id === state.sessionId)
  const now = Date.now()
  const completed = forceCompleted || state.phase === 'selecting'

  useSessionStore.getState().upsertSession({
    id: state.sessionId,
    firstMessage: messages.find((message) => message.role === 'user')?.text ?? '',
    status: completed ? 'completed' : 'in_progress',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    messages: messages.map((message) => ({
      id: message.id,
      role: message.role === 'user' ? 'user' : 'assistant',
      content: message.text,
      createdAt: now,
      type: 'normal',
    })),
    replay: {
      scriptId: state.scriptId,
      mode: state.mode,
      cursor: state.cursor,
      phase: state.phase,
      actionCard: state.actionCard,
      selectedVersionIndex: state.selectedVersionIndex,
      previewTitle: state.previewTitle,
      previewBody: state.previewBody,
    },
  })
}

let generateTimer: number | null = null

function startGenerateTimer() {
  if (generateTimer) window.clearTimeout(generateTimer)
  generateTimer = window.setTimeout(() => {
    generateTimer = null
    useCreateReplayStore.setState({ phase: 'selecting' })
  }, 3000)
}

export const useCreateReplayStore = create<CreateReplayState>()((set, get) => ({
  phase: 'idle',
  mode: 'chat',
  scriptId: null,
  cursor: 0,
  messages: [],
  pendingSuggestion: null,
  actionCard: null,
  selectedVersionIndex: null,
  previewTitle: '',
  previewBody: '',
  sessionId: null,
  directDraft: DIRECT_WRITE.draft,

  startScript: (scriptId) => {
    const script = getScriptById(scriptId)
    if (!script) return
    const token = bumpRun()
    const sessionId = uid('session')
    set({
      phase: 'playing',
      mode: 'chat',
      scriptId,
      cursor: 0,
      // 与 App 一致：灵感卡文案作为第一条用户消息，AI 再接着追问
      messages: [{ id: uid('user'), role: 'user', text: script.prompt }],
      pendingSuggestion: null,
      actionCard: script.actionCard,
      selectedVersionIndex: null,
      previewTitle: '',
      previewBody: '',
      sessionId,
      directDraft: DIRECT_WRITE.draft,
    })
    void playScriptAi(token)
  },

  sendSuggested: () => {
    const { pendingSuggestion, cursor, phase } = get()
    if (!pendingSuggestion || phase !== 'awaiting_user') return
    const token = bumpRun()
    set((state) => ({
      messages: [
        ...state.messages,
        { id: uid('user'), role: 'user', text: pendingSuggestion },
      ],
      pendingSuggestion: null,
      cursor: cursor + 1,
      phase: 'playing',
    }))
    afterScriptAdvance(get().cursor, token)
  },

  sendFreeText: (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const { phase } = get()
    if (phase === 'generating' || phase === 'playing' || phase === 'direct_sheet') {
      return
    }

    const token = bumpRun()
    if (phase === 'idle') {
      set({
        phase: 'playing',
        mode: 'chat',
        scriptId: null,
        cursor: 0,
        messages: [{ id: uid('user'), role: 'user', text: trimmed }],
        pendingSuggestion: null,
        sessionId: uid('session'),
      })
      void playHintThenWait(token)
      return
    }

    set((state) => ({
      messages: [...state.messages, { id: uid('user'), role: 'user', text: trimmed }],
      phase: 'playing',
    }))
    void playHintThenWait(token)
  },

  confirmActionCard: (details) => {
    set({ actionCard: details, phase: 'generating', pendingSuggestion: null })
    startGenerateTimer()
  },

  openDirectWrite: () => {
    bumpRun()
    set({
      phase: 'direct_sheet',
      directDraft: DIRECT_WRITE.draft,
    })
  },

  closeDirectWrite: () => {
    if (get().phase === 'direct_sheet') {
      set({ phase: 'idle' })
    }
  },

  setDirectDraft: (text) => set({ directDraft: text }),

  submitDirectWrite: () => {
    const draft = get().directDraft.trim() || DIRECT_WRITE.draft
    bumpRun()
    set({
      phase: 'generating',
      mode: 'direct',
      scriptId: DIRECT_WRITE.scriptId,
      cursor: 0,
      messages: [{ id: uid('user'), role: 'user', text: draft }],
      pendingSuggestion: null,
      actionCard: getScriptById(DIRECT_WRITE.scriptId)?.actionCard ?? null,
      sessionId: uid('session'),
    })
    startGenerateTimer()
  },

  selectVersion: (index) => {
    const script = getScriptById(get().scriptId) ?? CREATE_SCRIPTS[0]
    const version = script.versions[index]
    set({
      selectedVersionIndex: index,
      previewTitle: version.title,
      previewBody: version.content,
    })
  },

  updatePreview: (title, body) => set({ previewTitle: title, previewBody: body }),

  resetIdle: () => {
    bumpRun()
    if (generateTimer) {
      window.clearTimeout(generateTimer)
      generateTimer = null
    }
    set({
      phase: 'idle',
      mode: 'chat',
      scriptId: null,
      cursor: 0,
      messages: [],
      pendingSuggestion: null,
      actionCard: null,
      selectedVersionIndex: null,
      previewTitle: '',
      previewBody: '',
      sessionId: null,
      directDraft: DIRECT_WRITE.draft,
    })
  },

  resumeSession: (sessionId) => {
    const session = useSessionStore.getState().history.find((item) => item.id === sessionId)
    if (!session) return null

    const token = bumpRun()
    if (generateTimer) {
      window.clearTimeout(generateTimer)
      generateTimer = null
    }

    const snap = session.replay
    const completed = session.status === 'completed'
    const messages: ReplayMessage[] = session.messages
      .filter((message) => message.role !== 'system')
      .map((message) => ({
        id: message.id,
        role: message.role === 'user' ? 'user' : 'ai',
        text: message.content,
      }))

    // 恢复本身不改历史顺序，之后的新进展才会写回
    suppressPersist = true
    set({
      phase: completed ? 'selecting' : (snap?.phase ?? 'awaiting_user'),
      mode: snap?.mode ?? 'chat',
      scriptId: snap?.scriptId ?? null,
      cursor: snap?.cursor ?? 0,
      messages,
      pendingSuggestion: null,
      actionCard: snap?.actionCard ?? null,
      selectedVersionIndex: snap?.selectedVersionIndex ?? null,
      previewTitle: snap?.previewTitle ?? '',
      previewBody: snap?.previewBody ?? '',
      sessionId: session.id,
      directDraft: DIRECT_WRITE.draft,
    })
    suppressPersist = false

    if (completed) {
      return get().previewTitle ? '/work-preview' : '/version-select'
    }

    const { phase, cursor, scriptId } = get()
    const script = getScriptById(scriptId)
    if (phase === 'generating') {
      startGenerateTimer()
    } else if (phase === 'playing') {
      if (script) afterScriptAdvance(cursor, token)
      else set({ phase: 'awaiting_user' })
    } else if (phase === 'awaiting_user') {
      const line = script?.turns[cursor]
      set({ pendingSuggestion: line?.role === 'user' ? line.text : null })
    }
    return 'chat'
  },

  markCompleted: () => persistSession(true),
}))

useCreateReplayStore.subscribe((state, prev) => {
  if (suppressPersist || !state.sessionId) return
  if (
    state.sessionId === prev.sessionId &&
    state.messages.length === prev.messages.length &&
    state.phase === prev.phase &&
    state.cursor === prev.cursor &&
    state.selectedVersionIndex === prev.selectedVersionIndex &&
    state.previewTitle === prev.previewTitle &&
    state.previewBody === prev.previewBody
  ) {
    return
  }
  persistSession()
})
