import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProfileStore } from '../store/profileStore'

export function AuthPage() {
  const navigate = useNavigate()
  const login = useProfileStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    login()
    navigate('/create', { replace: true })
  }

  return (
    <div className="auth-page">
      <h1 className="auth-brand">灵境</h1>
      <p className="auth-tagline">每一个瞬间，都值得被书写</p>
      <div className="auth-rule" />

      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <input
          className="auth-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="请输入邮箱"
          autoComplete="username"
        />
        <input
          className="auth-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          autoComplete="current-password"
        />
        <button className="auth-submit" type="submit">
          登录 / 注册
        </button>
      </form>

      <p className="auth-alt">或通过以下方式登录</p>
      <div className="auth-social">
        <span>微信</span>
        <span>Apple</span>
      </div>

      <p className="auth-legal">
        登录即代表同意
        <Link to="/user-agreement">用户协议</Link>和
        <Link to="/privacy">隐私政策</Link>
      </p>
    </div>
  )
}
