import { Coins, Globe, BookOpen, Shield, Heart } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: '全球覆盖',
      description: '收录来自世界五大洲20多个国家和地区的精美纸币',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: '详尽资料',
      description: '每张纸币都包含发行背景、图案解读、防伪特征等完整信息',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '专业鉴定',
      description: '所有数据均经过严格考证，确保信息准确可靠',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: '收藏管理',
      description: '个性化收藏夹功能，轻松管理您的藏品清单',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">ABOUT US</span>
          </div>
          <h1 className="section-title">关于项目</h1>
          <div className="gold-divider mb-4" />
        </div>

        <div className="bg-background-light/50 backdrop-blur-sm border border-gold/10 rounded-sm p-8 mb-12">
          <div className="prose prose-invert max-w-none">
            <h2 className="font-display text-2xl text-parchment mb-6">项目缘起</h2>
            <p className="text-gold-muted leading-relaxed mb-6 font-body text-lg">
              世界纸币收藏馆诞生于对世界货币文化的热爱。纸币作为一个国家的"名片"，不仅是交易媒介，
              更是承载着历史、文化、艺术和科技的重要载体。每张纸币的图案、色彩、防伪技术都反映了
              发行国独特的文化底蕴和时代特征。
            </p>
            <p className="text-gold-muted leading-relaxed mb-6 font-body text-lg">
              我们致力于打造一个开放、专业的在线纸币博物馆，让收藏爱好者和历史研究者足不出户，
              就能欣赏到来自世界各地的精美纸币，了解背后的故事和文化。
            </p>

            <h2 className="font-display text-2xl text-parchment mb-6 mt-12">项目使命</h2>
            <p className="text-gold-muted leading-relaxed mb-6 font-body text-lg">
              <span className="text-gold font-display">传承 · 分享 · 教育</span>
            </p>
            <ul className="space-y-4 text-gold-muted font-body text-lg">
              <li className="flex items-start gap-3">
                <span className="text-gold font-display text-xl">•</span>
                <span>传承世界货币文化，让更多人了解纸币背后的历史故事</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold font-display text-xl">•</span>
                <span>分享收藏知识和经验，促进收藏爱好者之间的交流</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold font-display text-xl">•</span>
                <span>普及货币金融知识，提升公众对钱币文化的认知</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background-light/30 border border-gold/10 rounded-sm p-6 hover:border-gold/30 transition-all"
            >
              <div className="text-gold mb-4">{feature.icon}</div>
              <h3 className="font-display text-xl text-parchment mb-2">{feature.title}</h3>
              <p className="text-gold-muted font-body">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gold-muted font-body text-lg mb-4">
            本项目为非盈利性质的文化科普网站，所有内容仅供学习交流使用。
          </p>
          <p className="text-gold-muted/60 font-body text-sm">
            © {new Date().getFullYear()} 世界纸币收藏馆 · 用心呈现每一张纸币的故事
          </p>
        </div>
      </div>
    </div>
  );
}
