import type { Banknote, DesignElementCategory } from '@/types';

const imgPrompt = (desc: string) => 
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(desc)}&image_size=landscape_16_9`;

export const banknotes: Banknote[] = [
  {
    id: 'cn-100-2015',
    country: '中国',
    countryCode: 'CN',
    year: 2015,
    denomination: '100',
    currency: '元',
    obverseImage: imgPrompt('Chinese 100 yuan banknote obverse side, red color, Mao Zedong portrait, intricate design, high resolution, currency photography'),
    reverseImage: imgPrompt('Chinese 100 yuan banknote reverse side, Great Hall of the People, red color, detailed engraving, currency collection'),
    dimensions: '155 × 77 mm',
    material: '棉麻',
    mainColor: '红色',
    obverseDesign: '毛泽东头像、梅花、中国人民银行行名、面额数字',
    reverseDesign: '人民大会堂、中国人民银行汉语拼音行名',
    securityFeatures: ['光彩光变数字', '光变镂空开窗安全线', '人像水印', '胶印对印图案', '横竖双号码', '白水印', '雕刻凹印'],
    history: '2015年版第五套人民币100元纸币，在保持2005年版规格、正背面主图案、主色调不变的前提下，对部分图案做了适当调整，对整体防伪性能进行了提升。这是中国人民银行首次采用光彩光变技术，使钞票的防伪技术达到国际先进水平。',
    rarity: 1,
    favoriteCount: 2847,
    tags: ['人民币', '第五套', '流通钞'],
    createdAt: '2024-01-15',
    designElements: ['人物', '建筑', '符号'],
  },
  {
    id: 'cn-50-2019',
    country: '中国',
    countryCode: 'CN',
    year: 2019,
    denomination: '50',
    currency: '元',
    obverseImage: imgPrompt('Chinese 50 yuan banknote obverse, green color, Mao Zedong portrait, beautiful currency design, professional photography'),
    reverseImage: imgPrompt('Chinese 50 yuan banknote reverse, Potala Palace Tibet, green color, detailed banknote art, collection quality'),
    dimensions: '150 × 70 mm',
    material: '棉麻',
    mainColor: '绿色',
    obverseDesign: '毛泽东头像、菊花、中国人民银行行名',
    reverseDesign: '布达拉宫',
    securityFeatures: ['光彩光变面额数字', '动感光变镂空开窗安全线', '人像水印', '胶印对印图案'],
    history: '2019年版第五套人民币50元纸币，采用了先进的防伪技术，包括动感光变镂空开窗安全线，是中国纸币防伪技术的集大成者。布达拉宫图案展现了西藏的壮丽风光和民族文化。',
    rarity: 1,
    favoriteCount: 1923,
    tags: ['人民币', '第五套', '流通钞'],
    createdAt: '2024-02-10',
    designElements: ['人物', '建筑', '自然'],
  },
  {
    id: 'cn-10-1999',
    country: '中国',
    countryCode: 'CN',
    year: 1999,
    denomination: '10',
    currency: '元',
    obverseImage: imgPrompt('Chinese 10 yuan banknote 1999 edition, blue color, Mao Zedong, Three Gorges of Yangtze River, vintage currency'),
    reverseImage: imgPrompt('Chinese 10 yuan banknote reverse, Yangtze River Three Gorges, majestic landscape, blue tones, banknote photography'),
    dimensions: '140 × 70 mm',
    material: '棉麻',
    mainColor: '蓝黑色',
    obverseDesign: '毛泽东头像、月季花',
    reverseDesign: '长江三峡',
    securityFeatures: ['固定人像水印', '红蓝字缩微文字', '隐形面额数字', '雕刻凹印'],
    history: '1999年版第五套人民币10元纸币，是第五套人民币的首发版别。背面的长江三峡图案气势恢宏，展现了中国壮丽的自然风光。此版别由于流通时间长，好品已较为少见。',
    rarity: 3,
    favoriteCount: 3156,
    tags: ['人民币', '第五套', '99版', '收藏热门'],
    createdAt: '2024-01-20',
    designElements: ['人物', '自然', '符号'],
  },
  {
    id: 'us-100-2009',
    country: '美国',
    countryCode: 'US',
    year: 2009,
    denomination: '100',
    currency: '美元',
    obverseImage: imgPrompt('US 100 dollar bill obverse, Benjamin Franklin portrait, green color, American currency, high detail banknote'),
    reverseImage: imgPrompt('US 100 dollar bill reverse, Independence Hall Philadelphia, green Treasury seal, United States currency'),
    dimensions: '156 × 66.3 mm',
    material: '棉麻',
    mainColor: '绿色',
    obverseDesign: '本杰明·富兰克林肖像、美国财政部印章',
    reverseDesign: '独立纪念馆',
    securityFeatures: ['3D安全条', '钟形变色墨水瓶', '肖像水印', '变色面额数字', '缩微文字', '凸版印刷'],
    history: '2009年版100美元纸币是美国历史上防伪技术最先进的纸币之一。正面印有本杰明·富兰克林肖像，他是美国开国元勋之一，也是著名的科学家、发明家。背面的独立纪念馆见证了美国独立宣言的签署。',
    rarity: 1,
    favoriteCount: 4521,
    tags: ['美元', '流通钞', '世界货币'],
    createdAt: '2024-01-05',
    designElements: ['人物', '建筑', '历史', '符号'],
  },
  {
    id: 'us-20-2017',
    country: '美国',
    countryCode: 'US',
    year: 2017,
    denomination: '20',
    currency: '美元',
    obverseImage: imgPrompt('US 20 dollar bill obverse, Andrew Jackson portrait, green color, American paper money, detailed design'),
    reverseImage: imgPrompt('US 20 dollar bill reverse, White House Washington DC, green color, United States Treasury note'),
    dimensions: '156 × 66.3 mm',
    material: '棉麻',
    mainColor: '绿色',
    obverseDesign: '安德鲁·杰克逊肖像',
    reverseDesign: '白宫',
    securityFeatures: ['安全线', '水印', '变色油墨', '缩微文字', '凸版印刷'],
    history: '20美元纸币是美国流通最广泛的纸币之一。正面印有美国第七任总统安德鲁·杰克逊，背面则是美国总统官邸白宫。这张纸币见证了美国历史的变迁。',
    rarity: 1,
    favoriteCount: 2341,
    tags: ['美元', '流通钞'],
    createdAt: '2024-02-15',
    designElements: ['人物', '建筑'],
  },
  {
    id: 'jp-10000-2004',
    country: '日本',
    countryCode: 'JP',
    year: 2004,
    denomination: '10000',
    currency: '日元',
    obverseImage: imgPrompt('Japanese 10000 yen banknote obverse, Yukichi Fukuzawa portrait, brown and purple, Japanese currency, exquisite design'),
    reverseImage: imgPrompt('Japanese 10000 yen banknote reverse, Phoenix sculpture from Byodo-in Temple, Kyoto, beautiful Japanese art'),
    dimensions: '160 × 76 mm',
    material: '棉麻',
    mainColor: '棕紫色',
    obverseDesign: '福泽谕吉肖像',
    reverseDesign: '平等院凤凰',
    securityFeatures: ['全息图', '珠光油墨', '水印', '隐形面额数字', '缩微文字', '凸版印刷'],
    history: '2004年版10000日元纸币是日本最高面额的纸币。正面印有日本著名思想家、教育家福泽谕吉，他创立了庆应义塾大学，对日本近代化产生了深远影响。背面的平等院凤凰是日本国宝级文物。',
    rarity: 2,
    favoriteCount: 3892,
    tags: ['日元', '流通钞', '日本文化'],
    createdAt: '2024-01-12',
    designElements: ['人物', '艺术', '建筑'],
  },
  {
    id: 'jp-5000-2004',
    country: '日本',
    countryCode: 'JP',
    year: 2004,
    denomination: '5000',
    currency: '日元',
    obverseImage: imgPrompt('Japanese 5000 yen banknote obverse, Ichiyo Higuchi portrait, purple color, Japanese woman writer, beautiful currency'),
    reverseImage: imgPrompt('Japanese 5000 yen banknote reverse, Iris flowers painting by Ogata Korin, Japanese art masterpiece, purple tones'),
    dimensions: '156 × 76 mm',
    material: '棉麻',
    mainColor: '紫色',
    obverseDesign: '樋口一叶肖像',
    reverseDesign: '尾形光琳《燕子花图》',
    securityFeatures: ['全息图', '珠光油墨', '水印', '隐形印刷'],
    history: '5000日元纸币正面印有日本明治时期著名女作家樋口一叶，她是日本纸币上第一位女性肖像人物。背面的《燕子花图》是日本江户时代著名画家尾形光琳的代表作，展现了日本传统艺术之美。',
    rarity: 2,
    favoriteCount: 2784,
    tags: ['日元', '流通钞', '艺术'],
    createdAt: '2024-02-20',
    designElements: ['人物', '艺术', '自然'],
  },
  {
    id: 'gb-50-2011',
    country: '英国',
    countryCode: 'GB',
    year: 2011,
    denomination: '50',
    currency: '英镑',
    obverseImage: imgPrompt('UK 50 pound banknote obverse, Queen Elizabeth II portrait, red color, British sterling, elegant design'),
    reverseImage: imgPrompt('UK 50 pound banknote reverse, Matthew Boulton and James Watt, Industrial Revolution pioneers, British currency'),
    dimensions: '156 × 85 mm',
    material: '纸质',
    mainColor: '红色',
    obverseDesign: '伊丽莎白二世女王肖像',
    reverseDesign: '马修·博尔顿和詹姆斯·瓦特',
    securityFeatures: ['全息贴片', '动感安全线', '水印', '变色油墨', '凹版印刷', '缩微文字'],
    history: '2011年版50英镑纸币是英格兰银行发行的最高面额纸币。正面印有伊丽莎白二世女王，背面则是工业革命的先驱——企业家马修·博尔顿和发明家詹姆斯·瓦特，他们的合作推动了蒸汽机的商业化应用，改变了世界历史进程。',
    rarity: 3,
    favoriteCount: 4123,
    tags: ['英镑', '流通钞', '女王'],
    createdAt: '2024-01-08',
    designElements: ['人物', '科技', '历史'],
  },
  {
    id: 'gb-20-2007',
    country: '英国',
    countryCode: 'GB',
    year: 2007,
    denomination: '20',
    currency: '英镑',
    obverseImage: imgPrompt('UK 20 pound banknote obverse, Queen Elizabeth II, blue-purple color, Bank of England note, classic design'),
    reverseImage: imgPrompt('UK 20 pound banknote reverse, Adam Smith economist portrait, pin factory illustration, British currency'),
    dimensions: '149 × 80 mm',
    material: '纸质',
    mainColor: '蓝紫色',
    obverseDesign: '伊丽莎白二世女王肖像',
    reverseDesign: '亚当·斯密肖像',
    securityFeatures: ['全息条', '安全线', '水印', '变色数字'],
    history: '20英镑纸币背面印有经济学之父亚当·斯密，他的《国富论》奠定了现代经济学的基础。这是英格兰银行首次在纸币上使用经济学家肖像，体现了英国对经济思想的重视。',
    rarity: 2,
    favoriteCount: 2891,
    tags: ['英镑', '流通钞'],
    createdAt: '2024-02-25',
    designElements: ['人物', '历史'],
  },
  {
    id: 'eu-100-2002',
    country: '德国',
    countryCode: 'DE',
    year: 2002,
    denomination: '100',
    currency: '欧元',
    obverseImage: imgPrompt('Euro 100 banknote obverse, green color, Baroque and Rococo architectural style, European currency, ECB series'),
    reverseImage: imgPrompt('Euro 100 banknote reverse, bridge and map of Europe, green color, European Central Bank, architectural style'),
    dimensions: '147 × 82 mm',
    material: '棉麻',
    mainColor: '绿色',
    obverseDesign: '巴洛克和洛可可风格建筑、窗户、拱门',
    reverseDesign: '桥梁、欧洲地图',
    securityFeatures: ['全息图', '动感安全线', '水印', '变色数字', '微缩文字', '凹版印刷', '紫外线特征'],
    history: '2002年发行的100欧元纸币是欧元区流通的重要货币。设计主题为欧洲不同历史时期的建筑风格，正面展现巴洛克和洛可可风格的窗户和拱门，背面则是象征欧洲联系的桥梁。这张纸币代表了欧洲一体化的进程。',
    rarity: 2,
    favoriteCount: 3567,
    tags: ['欧元', '流通钞', '欧洲一体化'],
    createdAt: '2024-01-18',
    designElements: ['建筑', '艺术', '符号'],
  },
  {
    id: 'eu-50-2017',
    country: '法国',
    countryCode: 'FR',
    year: 2017,
    denomination: '50',
    currency: '欧元',
    obverseImage: imgPrompt('Euro 50 banknote obverse, orange color, Renaissance architectural style, Europa series, European Central Bank'),
    reverseImage: imgPrompt('Euro 50 banknote reverse, bridge and Europe map, orange color, Europa series, architectural elements'),
    dimensions: '140 × 77 mm',
    material: '棉麻',
    mainColor: '橙色',
    obverseDesign: '文艺复兴风格建筑、欧罗巴公主肖像、窗户',
    reverseDesign: '桥梁、欧洲地图',
    securityFeatures: ['欧罗巴水印', '全息图', '动感安全线', '翠绿数字', '卫星全息图', '触感标记'],
    history: '2017年版50欧元纸币是欧罗巴系列的最新版本，融入了更多先进的防伪技术。设计主题是文艺复兴时期的建筑，展现了欧洲灿烂的文化遗产。欧罗巴公主的肖像出现在水印和全息图中，这是希腊神话中的人物，也是欧洲名称的由来。',
    rarity: 1,
    favoriteCount: 2945,
    tags: ['欧元', '欧罗巴系列', '流通钞'],
    createdAt: '2024-02-05',
    designElements: ['建筑', '人物', '艺术', '符号'],
  },
  {
    id: 'ch-1000-2019',
    country: '瑞士',
    countryCode: 'CH',
    year: 2019,
    denomination: '1000',
    currency: '瑞士法郎',
    obverseImage: imgPrompt('Swiss 1000 franc banknote obverse, vertical design, science theme, red color, Swiss National Bank, modern design'),
    reverseImage: imgPrompt('Swiss 1000 franc banknote reverse, particle collision and DNA, science and research theme, vertical format'),
    dimensions: '158 × 74 mm',
    material: '棉麻',
    mainColor: '红色',
    obverseDesign: '科学主题、粒子轨迹、人类剪影',
    reverseDesign: '粒子碰撞、DNA双螺旋、瑞士地图',
    securityFeatures: ['动感安全线', '全息窗口', '多层水印', '变色油墨', '触感功能', '微缩文字', 'IR特征'],
    history: '2019年版1000瑞士法郎纸币是瑞士第九版纸币系列的最高面额，也是世界上最有价值的流通纸币之一。设计主题是"瑞士的科学成就"，垂直设计在世界纸币中独树一帜。这张纸币体现了瑞士在科学研究领域的卓越贡献。',
    rarity: 4,
    favoriteCount: 5234,
    tags: ['瑞士法郎', '高面额', '垂直设计', '现代设计'],
    createdAt: '2024-01-02',
    designElements: ['科技', '艺术', '符号'],
  },
  {
    id: 'ch-100-2016',
    country: '瑞士',
    countryCode: 'CH',
    year: 2016,
    denomination: '100',
    currency: '瑞士法郎',
    obverseImage: imgPrompt('Swiss 100 franc banknote obverse, blue color, humanitarian theme, vertical design, Switzerland currency'),
    reverseImage: imgPrompt('Swiss 100 franc banknote reverse, water and Switzerland map, humanitarian theme, blue color, Swiss National Bank'),
    dimensions: '148 × 70 mm',
    material: '棉麻',
    mainColor: '蓝色',
    obverseDesign: '人道主义主题、手势、水波纹',
    reverseDesign: '水流、瑞士地图、山脉',
    securityFeatures: ['动感安全线', '全息图', '水印', '变色油墨'],
    history: '100瑞士法郎纸币的设计主题是"瑞士的人道主义传统"。蓝色象征着水和生命，体现了瑞士作为国际红十字会发源地的人道主义精神。垂直设计和现代艺术风格使其成为世界最美纸币之一。',
    rarity: 2,
    favoriteCount: 3124,
    tags: ['瑞士法郎', '人道主义', '现代设计'],
    createdAt: '2024-02-18',
    designElements: ['自然', '艺术', '符号'],
  },
  {
    id: 'sg-1000-2014',
    country: '新加坡',
    countryCode: 'SG',
    year: 2014,
    denomination: '1000',
    currency: '新加坡元',
    obverseImage: imgPrompt('Singapore 1000 dollar banknote obverse, portrait of Yusof Ishak, first president, gold color, Singapore currency'),
    reverseImage: imgPrompt('Singapore 1000 dollar banknote reverse, Singapore Parliament building, national governance theme, gold color'),
    dimensions: '170 × 83 mm',
    material: '聚合物',
    mainColor: '金色',
    obverseDesign: '尤索夫·伊萨总统肖像、新加坡国徽',
    reverseDesign: '新加坡国会大厦、治国理念',
    securityFeatures: ['透明视窗', '动感图像', '衍射光栅', '水印', '凹版印刷', '荧光特征'],
    history: '新加坡1000元纸币是肖像系列的最高面额，正面印有新加坡第一任总统尤索夫·伊萨。背面的国会大厦象征着新加坡的民主制度和国家治理。新加坡以其先进的聚合物防伪技术著称，这张纸币是世界上最安全的纸币之一。',
    rarity: 4,
    favoriteCount: 2789,
    tags: ['新加坡元', '聚合物', '高面额'],
    createdAt: '2024-01-22',
    designElements: ['人物', '建筑', '符号'],
  },
  {
    id: 'au-100-2020',
    country: '澳大利亚',
    countryCode: 'AU',
    year: 2020,
    denomination: '100',
    currency: '澳元',
    obverseImage: imgPrompt('Australian 100 dollar banknote obverse, green color, Dame Nellie Melba portrait, polymer note, Australia currency'),
    reverseImage: imgPrompt('Australian 100 dollar banknote reverse, Sir John Monash portrait, green color, Australian polymer banknote, WWI theme'),
    dimensions: '158 × 65 mm',
    material: '聚合物',
    mainColor: '绿色',
    obverseDesign: '内莉·梅尔巴女爵士肖像、歌剧元素',
    reverseDesign: '约翰·莫纳什爵士肖像、军事工程元素',
    securityFeatures: ['透明窗口', '动感效果', '3D视窗', '荧光特征', '触觉标记', '微缩文字'],
    history: '澳大利亚是世界上第一个发行聚合物纸币的国家。100澳元纸币正面印有澳大利亚著名歌剧演员内莉·梅尔巴女爵士，背面是一战时期澳大利亚著名军事工程师约翰·莫纳什爵士。这张纸币展现了澳大利亚在文化和军事领域的杰出人物。',
    rarity: 2,
    favoriteCount: 2567,
    tags: ['澳元', '聚合物', '世界首创'],
    createdAt: '2024-01-25',
    designElements: ['人物', '艺术', '历史'],
  },
  {
    id: 'ca-100-2011',
    country: '加拿大',
    countryCode: 'CA',
    year: 2011,
    denomination: '100',
    currency: '加元',
    obverseImage: imgPrompt('Canadian 100 dollar bill obverse, brown color, Sir Robert Borden portrait, polymer frontier series, Canada currency'),
    reverseImage: imgPrompt('Canadian 100 dollar bill reverse, medical research theme, DNA helix and microscope, brown color, innovation'),
    dimensions: '152.4 × 69.85 mm',
    material: '聚合物',
    mainColor: '棕色',
    obverseDesign: '罗伯特·博登爵士肖像',
    reverseDesign: '医学研究、DNA双螺旋、胰岛素发明',
    securityFeatures: ['全息条带', '透明窗口', '动感图像', '荧光特征', '触感墨水', '微缩文字'],
    history: '加拿大100加元纸币是前沿系列的最高面额，背面主题是加拿大在医学研究领域的成就，特别是胰岛素的发现。加拿大科学家班廷和麦克劳德因发现胰岛素而获得1923年诺贝尔生理学或医学奖，这一发现挽救了无数糖尿病患者的生命。',
    rarity: 2,
    favoriteCount: 2345,
    tags: ['加元', '聚合物', '科技主题'],
    createdAt: '2024-02-12',
    designElements: ['人物', '科技', '历史'],
  },
  {
    id: 'kr-50000-2009',
    country: '韩国',
    countryCode: 'KR',
    year: 2009,
    denomination: '50000',
    currency: '韩元',
    obverseImage: imgPrompt('South Korea 50000 won banknote obverse, green and gold, Shin Saimdang portrait, Korean artist, beautiful currency'),
    reverseImage: imgPrompt('South Korea 50000 won banknote reverse, Chochungdo painting by Shin Saimdang, insects and plants, Korean art'),
    dimensions: '154 × 76 mm',
    material: '棉麻',
    mainColor: '绿金色',
    obverseDesign: '申师任堂肖像、梅花图案',
    reverseDesign: '申师任堂《草虫图》',
    securityFeatures: ['全息图', '变色油墨', '水印', '安全线', '微缩文字', '凸版印刷', '红外特征'],
    history: '50000韩元是韩国最高面额的纸币，也是韩国第一张印有女性肖像的流通纸币。申师任堂是朝鲜王朝时期著名的女艺术家、文学家和教育家，以其诗书绘画的才华和贤母形象著称。背面的《草虫图》是她的代表作，展现了韩国传统绘画的精髓。',
    rarity: 2,
    favoriteCount: 3456,
    tags: ['韩元', '女性肖像', '艺术'],
    createdAt: '2024-01-10',
    designElements: ['人物', '艺术', '自然'],
  },
  {
    id: 'in-2000-2016',
    country: '印度',
    countryCode: 'IN',
    year: 2016,
    denomination: '2000',
    currency: '印度卢比',
    obverseImage: imgPrompt('India 2000 rupee banknote obverse, magenta color, Mahatma Gandhi portrait, Reserve Bank of India, new series'),
    reverseImage: imgPrompt('India 2000 rupee banknote reverse, Mangalyaan Mars Orbiter Mission, space technology, magenta color, ISRO achievement'),
    dimensions: '166 × 66 mm',
    material: '棉麻',
    mainColor: '洋红色',
    obverseDesign: '圣雄甘地肖像、印度储备银行印章',
    reverseDesign: '曼加里安号火星轨道探测器',
    securityFeatures: ['隐形图案', '窗口安全线', '变色数字', '水印', '微缩文字', '盲文标记', '荧光特征'],
    history: '2000卢比纸币是印度2016年废钞运动后发行的最高面额纸币。背面印有印度火星探测器曼加里安号，这是印度空间研究组织（ISRO）的重大成就，使印度成为亚洲第一个成功将探测器送入火星轨道的国家。这张纸币象征着印度在科技领域的雄心。',
    rarity: 3,
    favoriteCount: 2890,
    tags: ['印度卢比', '航天科技', '高面额'],
    createdAt: '2024-01-28',
    designElements: ['人物', '科技', '符号'],
  },
  {
    id: 'br-100-2010',
    country: '巴西',
    countryCode: 'BR',
    year: 2010,
    denomination: '100',
    currency: '雷亚尔',
    obverseImage: imgPrompt('Brazil 100 real banknote obverse, green and blue, Republic effigy, Brazilian wildlife theme, beautiful currency'),
    reverseImage: imgPrompt('Brazil 100 real banknote reverse, jaguar animal, Amazon rainforest wildlife, Brazil fauna, green color, nature theme'),
    dimensions: '155 × 70 mm',
    material: '棉麻',
    mainColor: '蓝绿色',
    obverseDesign: '共和国肖像、巴西国徽',
    reverseDesign: '美洲豹、亚马逊雨林',
    securityFeatures: ['全息条', '变色油墨', '水印', '安全线', '微缩文字', '触感标记', '紫外荧光'],
    history: '巴西100雷亚尔纸币属于第二版雷亚尔系列，背面印有美洲豹图案，这是南美洲最大的猫科动物，也是巴西雨林生态系统的旗舰物种。这张纸币体现了巴西对保护亚马逊雨林和生物多样性的重视，是世界上最美丽的野生动物主题纸币之一。',
    rarity: 2,
    favoriteCount: 2456,
    tags: ['巴西雷亚尔', '野生动物', '亚马逊'],
    createdAt: '2024-02-02',
    designElements: ['人物', '动物', '自然', '符号'],
  },
  {
    id: 'hk-1000-2018',
    country: '中国香港',
    countryCode: 'HK',
    year: 2018,
    denomination: '1000',
    currency: '港币',
    obverseImage: imgPrompt('Hong Kong 1000 dollar banknote obverse, gold color, HSBC lion, Hong Kong skyline, modern financial center'),
    reverseImage: imgPrompt('Hong Kong 1000 dollar banknote reverse, Hong Kong harbor skyline, Victoria Harbour, night view, gold color'),
    dimensions: '163 × 81.5 mm',
    material: '纸质',
    mainColor: '金色',
    obverseDesign: '汇丰银行狮子、香港金融中心',
    reverseDesign: '维多利亚港夜景、香港天际线',
    securityFeatures: ['动感光亮图案', '开窗金属线', '高透光水印', '荧光透视对印', '凹凸触感', '隐形银码'],
    history: '香港1000元纸币由香港上海汇丰银行发行，是香港最高面额的流通纸币。正面的汇丰狮子是香港的标志性象征，背面的维多利亚港夜景展现了香港作为国际金融中心的繁华景象。这张纸币的金色调象征着财富和繁荣，是香港经济的象征。',
    rarity: 2,
    favoriteCount: 3789,
    tags: ['港币', '汇丰银行', '金融中心'],
    createdAt: '2024-01-15',
    designElements: ['建筑', '动物', '符号'],
  },
  {
    id: 'my-100-2012',
    country: '马来西亚',
    countryCode: 'MY',
    year: 2012,
    denomination: '100',
    currency: '林吉特',
    obverseImage: imgPrompt('Malaysia 100 ringgit banknote obverse, blue color, Abdul Rahman of Negeri Sembilan, first king, Malaysia currency'),
    reverseImage: imgPrompt('Malaysia 100 ringgit banknote reverse, Mount Kinabalu and Rafflesia flower, Sabah nature, blue color, Malaysian beauty'),
    dimensions: '152 × 72 mm',
    material: '纸质',
    mainColor: '蓝色',
    obverseDesign: '端古·阿卜杜勒·拉赫曼肖像、马来西亚国徽',
    reverseDesign: '京那巴鲁山、莱佛士花',
    securityFeatures: ['全息图', '变色油墨', '水印', '安全线', '微缩文字', '盲文标记'],
    history: '马来西亚100林吉特纸币属于马来西亚第四系列纸币，正面印有马来西亚第一任最高元首端古·阿卜杜勒·拉赫曼。背面的京那巴鲁山是东南亚最高的山峰，而莱佛士花则是世界上最大的花。这张纸币展现了马来西亚丰富的自然资源和多元文化。',
    rarity: 2,
    favoriteCount: 2134,
    tags: ['马来西亚林吉特', '自然风光', '生物多样性'],
    createdAt: '2024-02-08',
    designElements: ['人物', '自然', '符号'],
  },
  {
    id: 'th-1000-2015',
    country: '泰国',
    countryCode: 'TH',
    year: 2015,
    denomination: '1000',
    currency: '泰铢',
    obverseImage: imgPrompt('Thailand 1000 baht banknote obverse, silver color, King Bhumibol Adulyadej portrait, Rama IX, Thai royal family'),
    reverseImage: imgPrompt('Thailand 1000 baht banknote reverse, King Bhumibol agricultural projects, Pa Sak Jolasid Dam, Thai development'),
    dimensions: '162 × 84 mm',
    material: '纸质',
    mainColor: '银灰色',
    obverseDesign: '普密蓬·阿杜德国王（拉玛九世）肖像',
    reverseDesign: '国王农业项目、巴沙春拉西大坝',
    securityFeatures: ['全息安全线', '水印', '变色油墨', '隐形图案', '微缩文字', '凹凸印刷', '盲文标记'],
    history: '泰国1000泰铢纸币是纪念泰国国王普密蓬·阿杜德（拉玛九世）登基70周年发行的。普密蓬国王是世界上在位时间最长的君主之一，深受泰国人民爱戴。背面展示了国王倡导的农业发展项目，体现了他对泰国农村发展的巨大贡献。',
    rarity: 3,
    favoriteCount: 3567,
    tags: ['泰铢', '国王纪念', '皇家主题'],
    createdAt: '2024-01-20',
    designElements: ['人物', '建筑', '自然', '历史'],
  },
  {
    id: 'id-100000-2016',
    country: '印度尼西亚',
    countryCode: 'ID',
    year: 2016,
    denomination: '100000',
    currency: '印尼盾',
    obverseImage: imgPrompt('Indonesia 100000 rupiah banknote obverse, red color, Sukarno and Mohammad Hatta, founding fathers, Indonesia independence'),
    reverseImage: imgPrompt('Indonesia 100000 rupiah banknote reverse, Borobudur Temple and Lake Toba, cultural heritage, red color, Indonesian tourism'),
    dimensions: '151 × 65 mm',
    material: '纸质',
    mainColor: '红色',
    obverseDesign: '苏加诺和穆罕默德·哈达肖像、印尼国徽',
    reverseDesign: '婆罗浮屠、多巴湖、印尼传统织物',
    securityFeatures: ['全息图', '变色数字', '水印', '安全线', '微缩文字', '荧光特征', '凹凸印刷'],
    history: '印度尼西亚10万盾纸币是印尼最高面额的流通货币。正面印有印尼独立宣言的两位签署者——苏加诺总统和哈达副总统，他们是印尼的国父。背面的婆罗浮屠是世界上最大的佛教寺庙，而多巴湖是世界上最大的火山湖，展现了印尼丰富的文化和自然遗产。',
    rarity: 2,
    favoriteCount: 2345,
    tags: ['印尼盾', '高面额', '世界遗产'],
    createdAt: '2024-02-22',
    designElements: ['人物', '建筑', '自然', '历史', '艺术'],
  },
  {
    id: 'ru-5000-2010',
    country: '俄罗斯',
    countryCode: 'RU',
    year: 2010,
    denomination: '5000',
    currency: '卢布',
    obverseImage: imgPrompt('Russia 5000 rubles banknote obverse, brown and red, Amur River bridge, Khabarovsk, Russian far east, Russian currency'),
    reverseImage: imgPrompt('Russia 5000 rubles banknote reverse, Amur tiger and Taiga forest, Russian wildlife, Siberia nature, brown color'),
    dimensions: '157 × 69 mm',
    material: '棉麻',
    mainColor: '棕红色',
    obverseDesign: '哈巴罗夫斯克纪念碑、阿穆尔河大桥',
    reverseDesign: '阿穆尔虎、西伯利亚针叶林',
    securityFeatures: ['全息图', '变色数字', '潜像', '水印', '安全线', '微缩文字', '凹凸感', '磁性特征'],
    history: '俄罗斯5000卢布纸币是俄罗斯最高面额的纸币，设计主题是俄罗斯远东地区。阿穆尔虎（东北虎）是世界上最大的猫科动物，也是俄罗斯的珍稀保护动物。这张纸币体现了俄罗斯广袤的领土和丰富的自然资源，以及对远东地区开发的重视。',
    rarity: 3,
    favoriteCount: 2890,
    tags: ['俄罗斯卢布', '野生动物', '远东地区'],
    createdAt: '2024-01-30',
    designElements: ['动物', '建筑', '自然'],
  },
];

export const getBanknotesByDesignElement = (element: string): Banknote[] => {
  return banknotes.filter(b => b.designElements.includes(element as DesignElementCategory));
};

export const getRandomBanknotes = (count: number = 1, excludeIds: string[] = []): Banknote[] => {
  const available = banknotes.filter(b => !excludeIds.includes(b.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getDesignElementCounts = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  banknotes.forEach(b => {
    b.designElements.forEach(e => {
      counts[e] = (counts[e] || 0) + 1;
    });
  });
  return counts;
};

export const getBanknoteById = (id: string): Banknote | undefined => {
  return banknotes.find(b => b.id === id);
};

export const getBanknotesByCountry = (countryCode: string): Banknote[] => {
  return banknotes.filter(b => b.countryCode === countryCode);
};

export const getBanknotesByYear = (year: number): Banknote[] => {
  return banknotes.filter(b => b.year === year);
};

export const getBanknotesByDenomination = (denomination: string): Banknote[] => {
  return banknotes.filter(b => b.denomination === denomination);
};

export const getPopularBanknotes = (limit: number = 6): Banknote[] => {
  return [...banknotes].sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, limit);
};

export const getLatestBanknotes = (limit: number = 6): Banknote[] => {
  return [...banknotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
};

export const getRelatedBanknotes = (currentId: string, limit: number = 4): Banknote[] => {
  const current = getBanknoteById(currentId);
  if (!current) return [];
  
  return banknotes
    .filter(b => b.id !== currentId && (b.countryCode === current.countryCode || b.year === current.year))
    .slice(0, limit);
};

export const getYears = (): number[] => {
  const years = [...new Set(banknotes.map(b => b.year))];
  return years.sort((a, b) => b - a);
};

export const getDenominations = (): string[] => {
  const denoms = [...new Set(banknotes.map(b => `${b.denomination} ${b.currency}`))];
  return denoms;
};

export interface TagInfo {
  name: string;
  count: number;
  banknoteIds: string[];
  totalFavorites: number;
}

export const getAllTags = (): TagInfo[] => {
  const tagMap = new Map<string, { count: number; banknoteIds: string[]; totalFavorites: number }>();
  banknotes.forEach(b => {
    b.tags.forEach(t => {
      const existing = tagMap.get(t);
      if (existing) {
        existing.count += 1;
        existing.banknoteIds.push(b.id);
        existing.totalFavorites += b.favoriteCount;
      } else {
        tagMap.set(t, { count: 1, banknoteIds: [b.id], totalFavorites: b.favoriteCount });
      }
    });
  });
  return Array.from(tagMap.entries()).map(([name, info]) => ({
    name,
    ...info,
  }));
};

export const getTagInfo = (tagName: string): TagInfo | undefined => {
  return getAllTags().find(t => t.name === tagName);
};

export const getBanknotesByTag = (tagName: string): Banknote[] => {
  return banknotes.filter(b => b.tags.includes(tagName));
};

export const getRelatedTags = (tagName: string, limit: number = 10): (TagInfo & { coOccurrence: number })[] => {
  const targetBanknotes = getBanknotesByTag(tagName);
  const coOccurrence = new Map<string, number>();
  targetBanknotes.forEach(b => {
    b.tags.forEach(t => {
      if (t !== tagName) {
        coOccurrence.set(t, (coOccurrence.get(t) || 0) + 1);
      }
    });
  });
  const allTags = getAllTags();
  return Array.from(coOccurrence.entries())
    .map(([name, coCount]) => {
      const info = allTags.find(t => t.name === name);
      return info ? { ...info, coOccurrence: coCount } : null;
    })
    .filter((t): t is (TagInfo & { coOccurrence: number }) => t !== null)
    .sort((a, b) => b.coOccurrence - a.coOccurrence)
    .slice(0, limit);
};

export type TagCategory = '货币类型' | '版别系列' | '特殊属性' | '设计主题' | '地域';

const tagCategoryMap: Record<string, TagCategory> = {
  '人民币': '货币类型',
  '美元': '货币类型',
  '日元': '货币类型',
  '英镑': '货币类型',
  '欧元': '货币类型',
  '瑞士法郎': '货币类型',
  '新加坡元': '货币类型',
  '澳元': '货币类型',
  '加元': '货币类型',
  '韩元': '货币类型',
  '印度卢比': '货币类型',
  '巴西雷亚尔': '货币类型',
  '港币': '货币类型',
  '马来西亚林吉特': '货币类型',
  '泰铢': '货币类型',
  '印尼盾': '货币类型',
  '俄罗斯卢布': '货币类型',
  '第五套': '版别系列',
  '99版': '版别系列',
  '欧罗巴系列': '版别系列',
  '流通钞': '特殊属性',
  '收藏热门': '特殊属性',
  '高面额': '特殊属性',
  '聚合物': '特殊属性',
  '世界货币': '特殊属性',
  '世界首创': '特殊属性',
  '垂直设计': '特殊属性',
  '现代设计': '特殊属性',
  '日本文化': '设计主题',
  '艺术': '设计主题',
  '女王': '设计主题',
  '女性肖像': '设计主题',
  '航天科技': '设计主题',
  '科技主题': '设计主题',
  '野生动物': '设计主题',
  '亚马逊': '设计主题',
  '国王纪念': '设计主题',
  '皇家主题': '设计主题',
  '世界遗产': '设计主题',
  '自然风光': '设计主题',
  '生物多样性': '设计主题',
  '欧洲一体化': '设计主题',
  '人道主义': '设计主题',
  '汇丰银行': '地域',
  '金融中心': '地域',
  '远东地区': '地域',
};

export const getTagCategory = (tagName: string): TagCategory => {
  return tagCategoryMap[tagName] || '特殊属性';
};

export const getTagsByCategory = (): Record<TagCategory, TagInfo[]> => {
  const allTags = getAllTags();
  const result: Record<TagCategory, TagInfo[]> = {
    '货币类型': [],
    '版别系列': [],
    '特殊属性': [],
    '设计主题': [],
    '地域': [],
  };
  allTags.forEach(tag => {
    const category = getTagCategory(tag.name);
    result[category].push(tag);
  });
  return result;
};
