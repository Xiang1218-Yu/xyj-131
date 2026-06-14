import { Database, BookOpen, Globe, Shield, CheckCircle } from 'lucide-react';

export default function DataSources() {
  const sources = [
    {
      name: '中央银行公开资料',
      description: '各国中央银行及货币发行机构官方发布的纸币发行公告、技术参数、防伪特征说明等权威资料',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      name: '专业目录书籍',
      description: '《世界纸币标准目录》（Pick Catalog）、《中国纸币目录》等行业公认的专业参考书籍',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      name: '博物馆馆藏',
      description: '大英博物馆、美国国家历史博物馆、中国钱币博物馆等权威机构的馆藏资料和研究成果',
      icon: <Database className="w-6 h-6" />,
    },
    {
      name: '学术研究文献',
      description: '钱币学、货币史、金融史等领域的学术论文、研究报告和专业期刊文章',
      icon: <Globe className="w-6 h-6" />,
    },
  ];

  const verificationSteps = [
    { step: 1, title: '资料收集', desc: '从多渠道收集纸币相关信息和高清图片' },
    { step: 2, title: '交叉验证', desc: '通过至少3个独立来源核对数据准确性' },
    { step: 3, title: '专家审核', desc: '邀请钱币收藏专家进行内容审核' },
    { step: 4, title: '持续更新', desc: '根据新发现和研究成果定期更新' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">DATA SOURCES</span>
          </div>
          <h1 className="section-title">数据来源</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle max-w-2xl mx-auto">
            我们深知数据准确性的重要性，所有信息均经过严格的多源验证和专家审核
          </p>
        </div>

        <div className="bg-background-light/50 backdrop-blur-sm border border-gold/10 rounded-sm p-8 mb-12">
          <h2 className="font-display text-2xl text-parchment mb-6">参考来源</h2>
          <div className="space-y-6">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-background/30 rounded-sm border border-gold/5 hover:border-gold/20 transition-all"
              >
                <div className="text-gold flex-shrink-0 mt-1">{source.icon}</div>
                <div>
                  <h3 className="font-display text-lg text-parchment mb-2">{source.name}</h3>
                  <p className="text-gold-muted font-body">{source.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background-light/50 backdrop-blur-sm border border-gold/10 rounded-sm p-8 mb-12">
          <h2 className="font-display text-2xl text-parchment mb-6">数据质量保证流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {verificationSteps.map((item) => (
              <div
                key={item.step}
                className="relative text-center p-6 bg-background/30 rounded-sm border border-gold/5"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-background font-display text-xl">
                  {item.step}
                </div>
                <h3 className="font-display text-lg text-parchment mb-2">{item.title}</h3>
                <p className="text-gold-muted font-body text-sm">{item.desc}</p>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 text-gold/30">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold rounded-sm p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="text-gold w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-xl text-parchment mb-2">免责声明</h3>
              <p className="text-gold-muted font-body leading-relaxed">
                本网站所收录的纸币信息仅供参考和学习使用。虽然我们已尽最大努力确保数据的准确性，
                但由于钱币研究的专业性和复杂性，可能存在疏漏或错误。如需专业鉴定，请咨询正规的
                钱币鉴定机构或专家。本网站不承担因使用本网站信息而产生的任何直接或间接责任。
                所有纸币图片版权归原发行机构或收藏者所有。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
