import { FileText, AlertTriangle, CheckCircle, XCircle, Scale } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      title: '使用许可',
      icon: <CheckCircle className="w-6 h-6" />,
      content: [
        '本网站授予您有限的、非排他性的、不可转让的访问和个人使用许可',
        '您可以浏览、下载和打印本网站内容，但仅限个人、非商业用途',
        '您不得复制、分发、修改、公开演示或展示本网站的任何内容',
        '您不得将本网站内容用于任何商业目的或公共展示',
        '您不得使用任何机器人、爬虫或其他自动设备访问本网站',
      ],
    },
    {
      title: '用户行为规范',
      icon: <Scale className="w-6 h-6" />,
      content: [
        '不得发布或传播任何违法、侵权、虚假或误导性信息',
        '不得干扰或破坏本网站的正常运行或安全机制',
        '不得尝试未经授权访问本网站的任何部分或服务器',
        '不得利用本网站进行任何可能损害他人权益的行为',
        '不得以任何方式损害本网站的声誉或利益',
      ],
    },
    {
      title: '知识产权',
      icon: <FileText className="w-6 h-6" />,
      content: [
        '本网站所有原创内容（包括但不限于文字、图片、设计、代码）的版权归本项目所有',
        '各国纸币图片版权归原发行机构或版权持有者所有',
        '本网站使用的字体、图标等第三方资源遵循其各自的开源许可协议',
        '未经授权，您不得复制、分发或使用本网站的任何受版权保护的内容',
        '如需引用本网站内容，请注明出处并链接回原页面',
      ],
    },
    {
      title: '免责声明',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        '本网站提供的所有信息仅供参考和学习使用，不构成任何专业建议',
        '我们不对本网站信息的准确性、完整性或时效性做任何保证',
        '因使用本网站信息而产生的任何直接或间接损失，我们不承担责任',
        '本网站可能包含第三方网站链接，我们不对这些网站的内容负责',
        '本网站保留随时修改或终止服务的权利，无需事先通知',
      ],
    },
    {
      title: '禁止行为',
      icon: <XCircle className="w-6 h-6" />,
      content: [
        '禁止使用本网站内容从事任何非法活动',
        '禁止以任何形式出售、出租或商业化本网站内容',
        '禁止恶意采集、复制或大量下载本网站数据',
        '禁止冒充他人或伪造信息使用本网站服务',
        '禁止传播可能危害本网站或用户安全的恶意代码',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">TERMS OF USE</span>
          </div>
          <h1 className="section-title">使用条款</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle max-w-2xl mx-auto">
            请仔细阅读以下使用条款，访问和使用本网站即表示您同意接受这些条款
          </p>
        </div>

        <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold rounded-sm p-6 mb-12">
          <p className="text-gold font-body text-lg leading-relaxed">
            重要提示：本网站为非盈利性质的文化科普网站，不涉及任何钱币交易或商业活动。
            所有内容仅供学习交流使用，请在法律允许的范围内合理使用。
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

        <div className="mt-12 text-center p-8 bg-background-light/50 border border-gold/10 rounded-sm">
          <h3 className="font-display text-xl text-parchment mb-4">条款变更</h3>
          <p className="text-gold-muted font-body mb-4">
            我们保留随时修改本使用条款的权利。修改后的条款将在本页面公布，
            继续使用本网站即表示您接受修改后的条款。
          </p>
          <p className="text-gold font-display text-lg">
            如您对本使用条款有任何疑问或建议，请随时联系我们。
          </p>
        </div>
      </div>
    </div>
  );
}
