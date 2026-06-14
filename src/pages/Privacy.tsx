import { Shield, User, Database, Lock, Eye, Cookie } from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      icon: <User className="w-6 h-6" />,
      title: '信息收集',
      content: [
        '我们仅在您主动使用收藏功能时，在您的本地浏览器存储您的收藏列表数据',
        '所有收藏数据仅保存在您的本地浏览器 LocalStorage 中，不会上传到任何服务器',
        '我们不收集任何个人身份信息，不要求用户注册账号',
        '我们不使用 Cookie 或其他追踪技术收集您的浏览行为数据',
      ],
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: '数据使用',
      content: [
        '您的收藏数据仅用于在当前浏览器中展示和管理您的收藏',
        '我们不会访问、使用或分享您的任何本地存储数据',
        '所有数据处理均在您的浏览器端完成，无任何云端同步',
        '清除浏览器数据将同时清除您的收藏列表，请定期导出备份',
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: '数据安全',
      content: [
        '本网站采用 HTTPS 加密传输，确保您的浏览安全',
        '我们的代码完全开源，您可以自行审查数据处理逻辑',
        '我们不使用任何第三方分析或广告脚本，避免数据泄露风险',
        '所有第三方资源均来自可信的 CDN 服务提供商',
      ],
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: '用户权利',
      content: [
        '您可以随时查看、导出或删除您的本地收藏数据',
        '您可以通过浏览器设置或本网站的清空功能删除所有本地数据',
        '您有权了解本网站的数据处理方式，如有疑问可随时联系我们',
        '本网站不会向任何第三方出售或出租您的任何信息',
      ],
    },
    {
      icon: <Cookie className="w-6 h-6" />,
      title: 'Cookie 使用',
      content: [
        '本网站不使用任何追踪型 Cookie',
        '我们可能使用必要的本地存储来保存您的主题偏好等基础设置',
        '您可以通过浏览器设置禁用本地存储，但这可能影响部分功能使用',
        '本网站不使用任何第三方 Cookie 或像素追踪器',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">PRIVACY POLICY</span>
          </div>
          <h1 className="section-title">隐私政策</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle max-w-2xl mx-auto">
            我们高度重视您的隐私，致力于提供安全、透明的在线体验
          </p>
        </div>

        <div className="bg-background-light/50 backdrop-blur-sm border border-gold/10 rounded-sm p-8 mb-8">
          <p className="text-gold-muted font-body text-lg leading-relaxed">
            最后更新日期：{new Date().toLocaleDateString('zh-CN')}
          </p>
          <p className="text-gold-muted font-body text-lg leading-relaxed mt-4">
            欢迎使用世界纸币收藏馆。我们深知个人隐私的重要性，因此设计本网站时遵循最小化数据收集原则。
            本隐私政策旨在说明我们如何收集、使用和保护您的信息。
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-background-light/30 border border-gold/10 rounded-sm p-6 hover:border-gold/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-gold">{section.icon}</div>
                <h2 className="font-display text-xl text-parchment">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gold font-display mt-1">•</span>
                    <span className="text-gold-muted font-body leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-gradient-to-b from-gold/5 to-transparent border-t border-gold/10">
          <h3 className="font-display text-xl text-parchment mb-4">政策更新</h3>
          <p className="text-gold-muted font-body mb-4">
            我们可能会不时更新本隐私政策。任何变更将在本页面发布，重大变更将通过网站公告通知。
          </p>
          <p className="text-gold-muted/60 font-body text-sm">
            如对本隐私政策有任何疑问，请通过"联系我们"页面与我们取得联系。
          </p>
        </div>
      </div>
    </div>
  );
}
