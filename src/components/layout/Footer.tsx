import { Coins, Github, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-light border-t border-gold/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Coins className="w-5 h-5 text-background" />
              </div>
              <div>
                <h3 className="font-display text-xl text-parchment">世界纸币收藏馆</h3>
                <p className="text-xs text-gold-muted font-sans tracking-widest">WORLD BANKNOTE MUSEUM</p>
              </div>
            </Link>
            <p className="font-body text-lg text-gold-muted max-w-md leading-relaxed mb-6">
              收录全球各国各年份、各面值的精美纸币，让您足不出户就能欣赏到世界各国的货币文化和历史。
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-background transition-all duration-300"
              >
                <Globe size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-background transition-all duration-300"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-background transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-parchment mb-4 tracking-wider">快速链接</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/banknotes" className="font-body text-gold-muted hover:text-gold transition-colors">
                  全部纸币
                </Link>
              </li>
              <li>
                <Link to="/countries" className="font-body text-gold-muted hover:text-gold transition-colors">
                  按国家浏览
                </Link>
              </li>
              <li>
                <Link to="/years" className="font-body text-gold-muted hover:text-gold transition-colors">
                  按年份浏览
                </Link>
              </li>
              <li>
                <Link to="/denominations" className="font-body text-gold-muted hover:text-gold transition-colors">
                  按面值浏览
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="font-body text-gold-muted hover:text-gold transition-colors">
                  我的收藏
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-parchment mb-4 tracking-wider">关于我们</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-body text-gold-muted hover:text-gold transition-colors">
                  关于项目
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gold-muted hover:text-gold transition-colors">
                  数据来源
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gold-muted hover:text-gold transition-colors">
                  隐私政策
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gold-muted hover:text-gold transition-colors">
                  使用条款
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gold-muted hover:text-gold transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-gold-muted text-sm">
              © {currentYear} 世界纸币收藏馆. 保留所有权利.
            </p>
            <p className="font-body text-gold-muted text-sm">
              本网站仅供学习和收藏爱好者交流使用，不涉及任何商业交易。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
