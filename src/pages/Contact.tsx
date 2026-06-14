import { useState } from 'react';
import { Mail, MessageCircle, Send, Check, Github, User, AtSign } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactChannels = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: '电子邮件',
      content: 'contact@banknote-museum.example.com',
      description: '24小时内回复',
    },
    {
      icon: <Github className="w-6 h-6" />,
      title: 'GitHub',
      content: 'github.com/banknote-museum',
      description: '提交 Issue 或 PR',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: '交流社区',
      content: 'discord.gg/banknote-museum',
      description: '与藏友在线交流',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">CONTACT US</span>
          </div>
          <h1 className="section-title">联系我们</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle max-w-2xl mx-auto">
            欢迎与我们取得联系，无论是建议、合作还是纠错，我们都认真对待每一条反馈
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactChannels.map((channel, index) => (
            <div
              key={index}
              className="bg-background-light/50 border border-gold/10 rounded-sm p-6 text-center hover:border-gold/30 hover:bg-background-light/70 transition-all cursor-pointer"
            >
              <div className="text-gold mb-4 flex justify-center">{channel.icon}</div>
              <h3 className="font-display text-lg text-parchment mb-2">{channel.title}</h3>
              <p className="text-gold font-body text-sm mb-2">{channel.content}</p>
              <p className="text-gold-muted/60 font-body text-xs">{channel.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-background-light/50 backdrop-blur-sm border border-gold/10 rounded-sm p-8">
            <h2 className="font-display text-2xl text-parchment mb-6">发送消息</h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-display text-xl text-parchment mb-2">发送成功！</h3>
                <p className="text-gold-muted font-body">感谢您的来信，我们会尽快回复您。</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">
                    <User className="inline w-4 h-4 mr-2" />
                    您的称呼
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="请输入您的称呼"
                    className="w-full bg-background border border-gold/20 rounded-sm px-4 py-3 text-parchment placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">
                    <AtSign className="inline w-4 h-4 mr-2" />
                    电子邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="请输入您的邮箱"
                    className="w-full bg-background border border-gold/20 rounded-sm px-4 py-3 text-parchment placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">
                    <MessageCircle className="inline w-4 h-4 mr-2" />
                    消息内容
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="请描述您想告诉我们的内容..."
                    className="w-full bg-background border border-gold/20 rounded-sm px-4 py-3 text-parchment placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-background rounded-sm hover:opacity-90 transition-all font-display tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      <span>发送中...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>发送消息</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-background-light/50 border border-gold/10 rounded-sm p-6">
              <h3 className="font-display text-xl text-parchment mb-4">常见问题</h3>
              <div className="space-y-4">
                <div className="p-4 bg-background/30 rounded-sm">
                  <h4 className="font-display text-gold mb-2">如何提交新的纸币信息？</h4>
                  <p className="text-gold-muted font-body text-sm">
                    您可以通过本联系表单提交新纸币的资料和图片，我们会尽快审核并添加到数据库中。
                  </p>
                </div>
                <div className="p-4 bg-background/30 rounded-sm">
                  <h4 className="font-display text-gold mb-2">发现数据错误怎么办？</h4>
                  <p className="text-gold-muted font-body text-sm">
                    非常感谢您的指正！请通过联系表单告知具体错误信息和正确来源，我们会及时修正。
                  </p>
                </div>
                <div className="p-4 bg-background/30 rounded-sm">
                  <h4 className="font-display text-gold mb-2">可以合作或赞助吗？</h4>
                  <p className="text-gold-muted font-body text-sm">
                    欢迎各类文化机构、博物馆、收藏团体与我们合作。请说明您的合作意向，我们会尽快回复。
                  </p>
                </div>
                <div className="p-4 bg-background/30 rounded-sm">
                  <h4 className="font-display text-gold mb-2">响应时间是多久？</h4>
                  <p className="text-gold-muted font-body text-sm">
                    我们是一个志愿者团队，一般会在24-48小时内回复您的邮件。感谢您的耐心等待！
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold rounded-sm p-6">
              <p className="text-gold font-body leading-relaxed">
                您的每一条反馈都是我们前进的动力，感谢您对世界纸币收藏馆的支持与厚爱！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
