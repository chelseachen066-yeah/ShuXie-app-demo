import { Link } from 'react-router-dom'
import { PageHeader } from '../components/EmptyPage'

export function StaticPage({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className="page">
      <PageHeader title={title} />
      <p className="page-hint">{body}</p>
      <p className="page-hint" style={{ marginTop: 16 }}>
        <Link to="/profile">返回我的</Link>
      </p>
    </div>
  )
}

export function NotificationSettingsPage() {
  return (
    <StaticPage
      title="通知设置"
      body="演示版不接入推送。正式 App 可在此管理创作完成、阅读提醒等通知。"
    />
  )
}

export function AboutPage() {
  return (
    <StaticPage
      title="关于灵境"
      body="灵境是一个文学创作产品 Demo：对话式写作、作品集与阅读。本页为纯前端展示。"
    />
  )
}

export function FeedbackPage() {
  return (
    <StaticPage
      title="意见反馈"
      body="演示版不提交表单。你可以把使用感受记在心里，或在正式产品里联系我们。"
    />
  )
}

export function TermsPage() {
  return (
    <StaticPage
      title="用户协议"
      body="本 Demo 仅用于展示交互。使用即表示你理解数据保存在本机 localStorage，不会上传到服务器。"
    />
  )
}

export function PrivacyPage() {
  return (
    <StaticPage
      title="隐私政策"
      body="演示数据只存在于浏览器本地。请勿在本 Demo 中填写真实密码或个人敏感信息。"
    />
  )
}
