(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.GHTI = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const rawQuestions = `
1. 最近3个月，你选择下装的频率分布？
A. 直筒裤、烟管裤等有型款式（70%以上）
B. 垂感裙、飘逸裤等柔软款式（70%以上）
C. 根据搭配需要，有型和柔软都选
D. 宽松舒适为主，不太在意版型
2. 试穿时，哪种衣服让你立刻想买？
A. 穿上后轮廓立体，姿态自然挺拔
B. 面料舒适，身体可以自由舒展
C. 版型别致，有设计感但不夸张
D. 上身无感，像没穿一样舒适
3. 看到结构感很强的西装外套，你的真实反应？
A. "这就是我要的效果"
B. "太严肃，不适合我的生活"
C. "配其他单品应该会很好看"
D. "更喜欢柔软的外套"
4. 你的腰线处理习惯？
A. 总是强调，显示身材比例
B. 顺其自然，不刻意强调
C. 看整体搭配效果决定
D. 宽松掩盖，舒适第一
5. 在快时尚店里，你最容易被什么吸引？
A. 版型利落的基础款
B. 柔软亲肤的材质
C. 有小设计细节的单品
D. 宽松舒适的休闲款
6. 你衣橱里占比最大的单品类型？
A. 有腰线、有型但舒适的款式
B. 垂感好、跟随身体线条的款式
C. 可塑性强、能搭出不同效果的
D. 宽松版型、忽略身材曲线的
7. 最让你穿着不舒服的设计？
A. 版型松垮，没有支撑感
B. 面料硬挺，束缚身体活动
C. 设计混乱，没有重点
D. 过于修身，强调身材曲线
8. 挑选连衣裙时，你优先考虑？
A. 剪裁是否利落有型
B. 面料是否柔软舒适
C. 设计是否有层次感
D. 版型是否宽松自在
9. 关于肩线，你的偏好？
A. 喜欢清晰的肩线轮廓
B. 喜欢自然的落肩设计
C. 根据场合和搭配需要
D. 不太关注这个细节
10. 只能选一种裤型，你会选？
A. 直筒裤（经典不出错）
B. 阔腿裤（飘逸舒适）
C. 锥形裤（有型又舒适）
D. 宽松运动裤（最舒适）
11. 对于硬挺面料（如挺括棉、西装料），你的态度？
A. 很喜欢，让我感觉有力量
B. 不喜欢，更偏爱柔软面料
C. 看款式，硬挺软糯各有用处
D. 基本不考虑，优先舒适度
12. 穿衣时最在意的身体感受？
A. 身体被很好地支撑着
B. 身体可以自由活动
C. 身体线条被恰当修饰
D. 身体完全没有束缚感
13. 你的"舒适"更接近哪种？
A. 有支撑但不紧绷
B. 柔软贴身但不束缚
C. 恰到好处的包容感
D. 完全宽松的自由感
14. 什么样的衣服让你觉得"穿对了"？
A. 轮廓分明，精神状态更好
B. 舒适自然，情绪更放松
C. 比例协调，整体很和谐
D. 毫无束缚，可以做任何事
15. 【一致性检验】你更容易为了舒适而放弃？
A. 永远不放弃版型要求
B. 永远不放弃柔软舒适
C. 看重要程度决定
D. 舒适是最高优先级
16. 最近一次参加重要聚会，你的穿搭选择？
A. 选择能让我在人群中有存在感的款式
B. 选择不会过于突出但得体的款式
C. 根据聚会性质选择合适的风格
D. 选择让我感觉最自在的衣服
17. 陌生人第一次见你，你希望给出的印象？
A. 有气场，值得信任
B. 温和，容易亲近
C. 有品味，层次丰富
D. 真实，不做作
18. 在团队会议中，你的自然状态？
A. 主动发言，影响会议节奏
B. 认真倾听，适时给出反馈
C. 根据议题重要性调整参与度
D. 保持自己的节奏，不被氛围裹挟
19. 状态不佳的日子，你会选择？
A. 穿有结构感的衣服，撑住气场
B. 穿柔软舒适的衣服，安抚情绪
C. 穿最安全保险的搭配组合
D. 穿最舒适的衣服，减少额外负担
20. 你通过什么最强烈地感受到"存在感"？
A. 身体轮廓和姿态被清楚感知
B. 当下的情绪状态被接纳
C. 在环境中找到自己的位置
D. 内在的稳定和自我确认
21. 在重要场合被人注意时，你的真实感受？
A. 希望展现稳定专业的一面
B. 希望给人温暖亲近的感觉
C. 希望被看到真实多面的自己
D. 希望快速转移他人注意力
22. 你的能量更倾向于？
A. 向外投射，影响和塑造环境
B. 向内收纳，在内心构建安全感
C. 在内外之间找到平衡点
D. 保持流动，不被固定模式限制
23. 穿搭选择时，你优先考虑？
A. 他人的评价和社会反馈
B. 自己和他人感受的平衡
C. 具体场合的适宜性
D. 自己当下最真实的感受
24. 你希望穿搭主要帮你？
A. 在场合中站稳脚跟
B. 在情绪上被温柔接住
C. 在不同角色中保持平衡
D. 在行动中保持自由
25. 日常生活中，穿搭最常给你的感受？
A. 稳定感（让我立得住）
B. 安抚感（让我放松下来）
C. 适配感（让我不格格不入）
D. 自主感（让我按自己的方式）
26. 哪句话最接近你的穿搭体验？
A. 好的穿搭让我在任何场合都站得住
B. 好的穿搭让我在情绪上被温柔对待
C. 好的穿搭让我更容易融入环境
D. 好的穿搭让我保持行动的自由
27. 面对压力时，你穿衣的本能反应？
A. 选择更有架势的款式来应对
B. 选择更舒适的款式来缓解
C. 选择最不会出错的安全款式
D. 选择能让我忽略压力的舒适款
28. 你最不能接受的社交状态？
A. 失去控制，被环境推着走
B. 被误解，无法传达真实的自己
C. 格格不入，无法融入集体
D. 被定义，失去表达真我的空间
29. 在陌生环境中，你的适应方式？
A. 先建立自己的气场和边界
B. 先观察氛围，找到融入的方式
C. 先了解规则，按合适的方式行事
D. 保持自己的节奏，不刻意改变
30. 【注意力检查题】为确保答题质量，请选择"保持观察"
A. 主动出击
B. 保持观察
C. 寻找平衡
D. 随心而行
31. 你更容易被哪类风格"一见钟情"？
A. 强烈明确，有视觉冲击力
B. 温和克制，质感细腻耐看
C. 情绪饱满，氛围感强烈
D. 低调自然，越看越舒服
32. 他人最常用哪个词形容你？
A. 有气场、有力量
B. 温柔、亲和
C. 有个性、独特
D. 自然、真实
33. 你更喜欢哪种"美"？
A. 一眼就能抓住人的强烈美
B. 细节中慢慢显露的精致美
C. 整体氛围营造的意境美
D. 越看越顺眼的耐看美
34. 你更愿意在哪个层面表达个性？
A. 轮廓和线条的强烈对比
B. 材质和触感的精致体验
C. 整体氛围的情绪传达
D. 真实态度的自然流露
35. 对于设计感强烈的单品，你的态度？
A. 很喜欢，这样才够特别
B. 一点点就好，不能太过
C. 看整体效果，适度最好
D. 不需要，简单自然就好
36. 你最容易在什么时候被人记住？
A. 第一眼见面的时候
B. 深入交谈的时候
C. 共同经历之后
D. 长期相处的回忆中
37. 哪种穿搭更容易获得他人信任？
A. 线条清晰，结构稳定的
B. 材质舒适，触感友好的
C. 整体和谐，层次丰富的
D. 自然真实，不做作的
38. 你希望风格在社交中发挥的作用？
A. 建立第一印象，快速传达信息
B. 创造舒适氛围，拉近距离
C. 展现多面性，引发深层交流
D. 保持真实性，筛选合适的人
39. 对于"风格统一性"的要求？
A. 很重要，要有清晰的个人标识
B. 比较重要，但允许细微变化
C. 可有可无，多样性更有趣
D. 不重要，随心情和状态变化
40. 你觉得自己的存在方式更像？
A. 轮廓清晰的建筑
B. 温和包容的微风
C. 变幻流动的云彩
D. 自然生长的植物
41. 什么样的品牌更容易吸引你？
A. 结构感强，有明确风格定位的
B. 情感化强，能触动内心的
C. 平衡感好，适合不同场合的
D. 理念独特，不随主流的
42. 你最在意风格传达的什么特质？
A. 力量感和掌控感
B. 温度感和亲和力
C. 平衡感和包容性
D. 自由度和可能性
43. 什么样的穿搭让你觉得"用力过度"？
A. 轮廓过于强硬，缺乏柔和
B. 情绪过于饱满，缺乏克制
C. 元素过于复杂，缺乏重点
D. 风格过于刻意，缺乏自然
44. 在表达个性和融入环境之间，你更倾向？
A. 坚持个性表达，影响环境
B. 适度调整，寻求和谐
C. 灵活应变，保持平衡
D. 忠于自己，不刻意迎合
45. 你希望风格给人的总体印象？
A. 稳定可靠，值得依赖
B. 温暖治愈，让人安心
C. 层次丰富，引人思考
D. 灵活真实，充满可能
46. 最近一次购买衣服，让你最终决定的因素？
A. 版型比例符合我的搭配标准
B. 上身感受让我觉得很舒服
C. 实用性强，能搭配很多单品
D. 当下就是觉得很喜欢
47. 你的购衣决策更依赖？
A. 明确的判断标准和搭配逻辑
B. 真实的身体感受和情绪反应
C. 以往的穿搭经验和场合需求
D. 当下的直觉感受和状态
48. 每天早上穿搭，你更常？
A. 前一天就搭配好，有备而来
B. 大致规划方向，当天微调
C. 看当天的日程和心情决定
D. 临时感觉，拿起什么穿什么
49. 你的衣橱构成，占比最大的是？
A. 经典基础款，不容易过时
B. 舒适感强的款式，情绪友好
C. 实用百搭款，适合多种场合
D. 有感觉的单品，购买时很喜欢
50. 最容易让你购买后悔的原因？
A. 版型不如预期，搭配效果不好
B. 上身不舒服，情绪体验不佳
C. 实用性不强，搭配场合有限
D. 新鲜感过去，不再有感觉
51. 你更愿意为哪类单品投入高预算？
A. 能撑住场面，提升整体质感的
B. 舒适度高，能安抚情绪的
C. 百搭实用，穿着频率很高的
D. 很有感觉，独特有个性的
52. 穿搭中你最看重？
A. 正确性（不出错，有标准）
B. 舒适度（身心愉悦，无负担）
C. 适配性（符合场合，恰到好处）
D. 真实感（像自己，不违和）
53. 你的穿搭风格是怎样形成的？
A. 长期遵循的穿衣原则和搭配规律
B. 情绪和感受的反复选择积累
C. 生活阶段和角色需求的演变
D. 身体状态和当下感觉的变化
54. 你最不能接受的穿搭状态？
A. 明显搭配错误，不符合基本原则
B. 身体不舒适，情绪被影响
C. 场合不合适，显得格格不入
D. 被风格束缚，无法自由表达
55. 你希望AI穿搭助手如何理解你？
A. 提供标准化方案，减少选择焦虑
B. 理解我的感受状态，给出贴心建议
C. 提供判断参考，帮我做出合适选择
D. 尊重我的变化，不固化我的风格
56. 当系统推荐穿搭时，你更希望基于？
A. 经典搭配逻辑，稳定不出错
B. 我当下的情绪状态和需求
C. 具体的场合需求和角色定位
D. 跳出常规的灵感和新可能
57. 对你来说，"适合"更接近？
A. 有客观标准可以衡量
B. 是主观感受的体现
C. 要结合当下的具体情况
D. 是流动变化的，没有固定答案
58. 判断穿搭"对不对"，你更依赖？
A. 清晰的结构逻辑（比例、层次、搭配原则）
B. 真实的感受反馈（舒适、愉悦、自在）
C. 理性分析与感性体验的结合
D. 当下的身体状态和内心感受
59. 以下哪个词最能打动你？
A. 精准（准确到位）
B. 温柔（体贴舒适）
C. 和谐（恰到好处）
D. 松弛（自由自在）
60. 在穿搭中，你最核心的长期需求是？
A. 获得稳定感和支撑，建立可靠的形象
B. 被温柔接纳和安抚，保持情绪的舒适
C. 在不同角色中保持平衡，适应各种场合
D. 保持自主和自由，不被固定的风格束缚
`;

  const CHAPTERS = [
    {
      id: "sf",
      index: "01",
      name: "轮廓",
      roman: "SILHOUETTE",
      subtitle: "你与衣服的几何关系",
      range: [1, 15],
      pos: "S",
      neg: "F",
      posName: "结构 STRUCTURE",
      negName: "流动 FLOW",
      weights: { A: 2, B: -2, C: 1, D: -1 },
    },
    {
      id: "ar",
      index: "02",
      name: "存在",
      roman: "PRESENCE",
      subtitle: "你被看见的方式",
      range: [16, 30],
      pos: "A",
      neg: "R",
      posName: "主动 ASSERTIVE",
      negName: "内敛 RESERVED",
      weights: { A: 2, B: -1, C: -1, D: -2 },
    },
    {
      id: "dc",
      index: "03",
      name: "张力",
      roman: "TENSION",
      subtitle: "风格强度与记忆点",
      range: [31, 45],
      pos: "D",
      neg: "C",
      posName: "显性 DYNAMIC",
      negName: "克制 CALM",
      weights: { A: 2, B: -1, C: 1, D: -2 },
    },
    {
      id: "pi",
      index: "04",
      name: "决策",
      roman: "DECISION",
      subtitle: "你如何确认穿对了",
      range: [46, 60],
      pos: "P",
      neg: "I",
      posName: "流程 PROTOCOL",
      negName: "直觉 INTUITION",
      weights: { A: 2, B: -1, C: 1, D: -2 },
    },
  ];

  const TYPES = {
    SADP: { name: "权威架构者", english: "The Sovereign Architect", tagline: "结构化强势 · 高对比张力 · 标准驱动", refs: "巩俐、陈数" },
    SADI: { name: "锋芒指挥者", english: "The Instinct Commander", tagline: "结构化强势 · 高对比张力 · 直觉拍板", refs: "宁静、张雨绮" },
    SACP: { name: "冷静策士", english: "The Poised Strategist", tagline: "结构化强势 · 克制张力 · 标准驱动", refs: "袁泉、俞飞鸿" },
    SACI: { name: "克制革新者", english: "The Restrained Innovator", tagline: "结构化强势 · 克制张力 · 灵感驱动", refs: "倪妮、万茜" },
    SRDP: { name: "秩序表演者", english: "The Ordered Performer", tagline: "结构化低调 · 高对比张力 · 标准驱动", refs: "刘雯、杜鹃" },
    SRDI: { name: "冷感潮人", english: "The Cool Maverick", tagline: "结构化低调 · 高对比张力 · 灵感驱动", refs: "钟楚曦、宋佳" },
    SRCP: { name: "精密策展人", english: "The Precise Curator", tagline: "结构化低调 · 克制张力 · 标准驱动", refs: "汤唯、陈数" },
    SRCI: { name: "透明极简者", english: "The Lucid Minimalist", tagline: "结构化低调 · 克制张力 · 灵感驱动", refs: "桂纶镁、周迅" },
    FADP: { name: "舞台缪斯", english: "The Stage Muse", tagline: "流动强势 · 戏剧张力 · 标准驱动", refs: "范冰冰、迪丽热巴" },
    FADI: { name: "灵感女主", english: "The Instinct Heroine", tagline: "流动强势 · 戏剧张力 · 直觉驱动", refs: "杨幂、周冬雨" },
    FACP: { name: "优雅主理人", english: "The Grace Director", tagline: "流动强势 · 温和张力 · 标准驱动", refs: "高圆圆、刘诗诗" },
    FACI: { name: "诗意游牧者", english: "The Poetic Nomad", tagline: "流动强势 · 温和张力 · 灵感驱动", refs: "倪妮、周迅" },
    FRDP: { name: "危险魅影", english: "The Velvet Specter", tagline: "流动低调 · 戏剧张力 · 标准驱动", refs: "张曼玉、钟楚曦" },
    FRDI: { name: "神秘海妖", english: "The Hidden Siren", tagline: "流动低调 · 戏剧张力 · 直觉驱动", refs: "汤唯、周迅" },
    FRCP: { name: "安静治愈者", english: "The Quiet Healer", tagline: "流动低调 · 温和张力 · 标准驱动", refs: "刘亦菲、高圆圆" },
    FRCI: { name: "自然母性者", english: "The Natural Nurturer", tagline: "流动低调 · 温和张力 · 灵感驱动", refs: "海清、蒋雯丽" },
  };

  const TYPE_STORIES = {
    SADP:
      "你的穿搭像一套清晰的权力结构：肩线、比例和对比先把气场立住，再用稳定公式确保每次出场都可控。你适合干净利落但不无聊的强轮廓，越是重要场合，越需要让衣服替你传达专业、边界和决断。",
    SADI:
      "你的风格不需要预热，线条一到位就能立刻进入状态。结构感给你底盘，高对比和直觉选择给你锋芒；你适合有态度的外套、利落下装和突然点亮的配饰，让造型像一句直接的判断。",
    SACP:
      "你适合把强势藏在秩序里。清晰廓形让你站得稳，克制质感让人愿意靠近；比起夸张表达，你更像用比例、面料和细节管理场面。穿搭公式越清楚，你的冷静和判断力越容易被看见。",
    SACI:
      "你的造型有骨架，但不喜欢被套路困住。利落线条负责清醒，低对比质感负责余韵，而灵感会在某个材质、开口或配饰上悄悄转向。你适合看似克制、细看有新意的穿法。",
    SRDP:
      "你不是高声吸引注意的人，但你的衣服需要有节奏和秩序。清晰轮廓让你保持分寸，戏剧对比负责留下记忆点；只要把强元素控制在局部，你就能安静地显得锋利、可靠、有章法。",
    SRDI:
      "你的风格像冷调里的突然闪光。你需要结构来维持清爽，也需要一点反常规的对比来表达情绪；直觉会告诉你今天该亮出哪一个重点。最适合你的不是热闹，而是低声量的锋芒。",
    SRCP:
      "你的好看来自精确和长期耐看。清晰版型、低调存在与克制质感会让你显得干净可靠；你适合把衣橱整理成一套稳定系统，用少量高质量单品反复组合，越简单越能看出分寸。",
    SRCI:
      "你的风格像透明的结构：轻、准、少，但每一处都有理由。你需要清楚线条维持轮廓，也需要给当下灵感留一点空白；不必堆叠存在感，一个恰好的剪裁或材质变化就足够说明你。",
    FADP:
      "你适合把流动感穿成舞台感。柔软线条负责身体感，高对比元素负责抓住视线，再用成熟公式把浪漫收住。你的造型可以鲜明、丰盛、有情绪，但最好始终有一个稳定主轴。",
    FADI:
      "你的穿搭靠直觉点燃。垂坠、曲线和戏剧对比会放大你的女主感，而你不需要每次都按同一套公式出牌；今天的颜色、光泽或露肤度只要对了，整个人就会立刻成立。",
    FACP:
      "你的风格强在松弛的掌控感。流动廓形让你有亲和力，温和质感让气场更耐看；你适合用稳定的配色和成熟单品搭出柔软但有主见的形象，像把优雅变成一种管理能力。",
    FACI:
      "你的穿搭需要呼吸和故事感。柔软线条、自然垂坠和低对比质感是底色，灵感则决定今天更像度假、展览还是夜晚微风。你适合不费力却有画面感的组合，越真实越迷人。",
    FRDP:
      "你的魅力不靠外放，而靠暗处的张力。流动廓形让你保留松弛，高对比细节让人回头，再用可复用规则避免过度飘散。你适合温柔里有危险感、低调里有记忆点的穿法。",
    FRDI:
      "你的造型像夜色里的波光，安静，但有吸引力。柔软线条和戏剧元素会一起工作：一个负责靠近身体，一个负责制造神秘。你适合凭直觉选择今天的亮点，让风格停在刚好想被多看一眼的位置。",
    FRCP:
      "你的穿搭最动人的地方是舒服、稳定、可亲近。流动版型让身体放松，温和质感让人感到安心；当你建立几套可靠公式后，就能在不同场合保持柔和但不散、简单但不寡淡。",
    FRCI:
      "你的风格像自然生长出来的秩序。柔软、垂坠和低声量质感是你的底盘，直觉会带你选择更贴近当下的颜色和材质。你不需要被造型固定，越像自己，越有温度和辨识度。",
  };

  const TYPE_PORTRAIT_IMAGE_BASE = "assets/portraits/";
  Object.keys(TYPES).forEach((typeCode) => {
    TYPES[typeCode].portraitImage = `${TYPE_PORTRAIT_IMAGE_BASE}${typeCode}.webp`;
  });

  const SHARE_PRESENCE_LABELS = {
    SA: { zh: "结构化强势", en: "Structured Assertive" },
    SR: { zh: "结构化低调", en: "Structured Reserve" },
    FA: { zh: "流动强势", en: "Fluid Assertive" },
    FR: { zh: "流动低调", en: "Fluid Reserve" },
  };
  const SHARE_TENSION_LABELS = {
    D: { zh: "戏剧张力", en: "Dynamic Tension" },
    C: { zh: "克制张力", en: "Restrained Tension" },
  };
  const SHARE_DECISION_LABELS = {
    P: { zh: "标准驱动", en: "Standards Driven" },
    I: { zh: "直觉驱动", en: "Intuition Driven" },
  };

  const NEED_TAGS = { A: "稳定", B: "被接住", C: "平衡", D: "自主" };
  const DECISION_TAGS = { A: "架构型", B: "感受型", C: "平衡型", D: "状态型" };

  const FRAGMENTS = {
    S: {
      story: "结构、边界与挺括感会替你撑起状态；你的造型越有骨架，越能显出清醒和可靠。",
      strategy: "优先选择有肩线/有边界的版型：西装、风衣、直线裤、利落连衣裙。",
      pitfall: "过度松垮、边界模糊的廓形会削弱稳定感。",
      chip: "利落廓形",
    },
    F: {
      story: "流动、垂坠与身体感是你的安全区；衣服跟随你，而不是把你固定在某种姿态里。",
      strategy: "优先选择带垂坠/飘逸的版型：裹身、吊带裙、飘带、开衩、软外套。",
      pitfall: "过硬、过直、过制服化的版型可能压住自然流动。",
      chip: "流动线条",
    },
    A: {
      story: "你适合让造型成为主语，在场合中清楚地站住，让人一眼读到你的姿态。",
      strategy: "强调上半身、肩颈或腰线，让造型在第一眼就建立存在感。",
      pitfall: "太低存在、太安全的穿法容易让你觉得浪费自己。",
      chip: "主动存在",
    },
    R: {
      story: "你更适合把造型做成背景，不喧哗，但要足够精确，让人慢慢意识到你的分寸。",
      strategy: "重在整体干净与舒适区间，保留低调但可被记住的局部重点。",
      pitfall: "太高存在、太用力的造型容易消耗能量。",
      chip: "稳妥背景",
    },
    D: {
      story: "对比、记忆点与戏剧性会唤醒你的风格能量，你并不害怕被看见。",
      strategy: "用对比建立记忆点：高反差配色、锐利配饰、图案或光泽点睛。",
      pitfall: "没有重点的强元素堆叠会让造型从有力变成嘈杂。",
      chip: "戏剧对比",
    },
    C: {
      story: "你的张力来自克制与耐看，越安静的质感越能留下长期印象。",
      strategy: "用质感建立高级感：同色系层次、简洁线条、材质细节胜过装饰。",
      pitfall: "过度追求安全会让风格失去辨识度。",
      chip: "克制质感",
    },
    P: {
      story: "你喜欢可复用、可解释、可稳定发挥的穿衣逻辑，模板会让你更自由。",
      strategy: "建立可复用衣橱公式：场合模板 + 基础矩阵 + 固定配色。",
      pitfall: "太依赖固定公式时，容易忽略身体和情绪的即时反馈。",
      chip: "可复用模板",
    },
    I: {
      story: "你需要给当下状态留下余地，灵感和真实感会比公式更能说服你。",
      strategy: "建立灵感库与情绪衣架：按状态、季节、事件准备触发单品。",
      pitfall: "只追随瞬间感觉，可能让衣橱难以互相搭配。",
      chip: "灵感驱动",
    },
  };

  const QUESTIONS = parseQuestions(rawQuestions);

  function parseQuestions(input) {
    return input
      .trim()
      .split(/\n(?=\d+\.\s)/)
      .map((block) => {
        const lines = block.trim().split("\n");
        const header = lines.shift();
        const match = header.match(/^(\d+)\.\s*(.+)$/);
        const id = Number(match[1]);
        const chapter = CHAPTERS.find((item) => id >= item.range[0] && id <= item.range[1]);
        return {
          id,
          title: match[2],
          axis: chapter.id,
          options: lines.map((line) => {
            const optionMatch = line.match(/^([A-D])\.\s*(.+)$/);
            return { key: optionMatch[1], text: optionMatch[2] };
          }),
        };
      });
  }

  function pickMostFrequent(answers, start, end) {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    for (let id = start; id <= end; id += 1) {
      if (answers[id]) counts[answers[id]] += 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
  }

  function getFirstMissingQuestion(answers, start, end) {
    for (let id = start; id <= end; id += 1) {
      if (!answers[id]) return id;
    }
    return null;
  }

  function computeAxis(chapter, answers) {
    const [start, end] = chapter.range;
    const total = end - start + 1;
    let score = 0;
    let answered = 0;
    for (let id = start; id <= end; id += 1) {
      const answer = answers[id];
      if (!answer) continue;
      score += chapter.weights[answer];
      answered += 1;
    }
    const maxScore = total * 2;
    const norm = score / maxScore;
    const positivePercent = Math.round(((norm + 1) / 2) * 100);
    const balanced = Math.abs(norm) < 0.1;
    return {
      id: chapter.id,
      pos: chapter.pos,
      neg: chapter.neg,
      posName: chapter.posName,
      negName: chapter.negName,
      score,
      answered,
      total,
      norm,
      positivePercent,
      negativePercent: 100 - positivePercent,
      letter: positivePercent >= 50 ? chapter.pos : chapter.neg,
      rawLetter: balanced ? "X" : positivePercent >= 50 ? chapter.pos : chapter.neg,
      balanced,
    };
  }

  function computeResult(answers) {
    const axis = CHAPTERS.map((chapter) => computeAxis(chapter, answers));
    const typeCode = axis.map((item) => item.letter).join("");
    const rawTypeCode = axis.map((item) => item.rawLetter).join("");
    const needKey = pickMostFrequent(answers, 16, 30);
    const decisionKey = pickMostFrequent(answers, 46, 60);
    const type = TYPES[typeCode] || TYPES.SRCP;
    return {
      axis,
      typeCode,
      rawTypeCode,
      type,
      needTag: NEED_TAGS[needKey],
      decisionTag: DECISION_TAGS[decisionKey],
      qualityPassed: answers[30] === "B",
      strategies: buildStrategies(typeCode),
      pitfalls: buildPitfalls(typeCode),
      story: buildStory(typeCode),
      chips: typeCode.split("").map((letter) => FRAGMENTS[letter].chip),
    };
  }

  function buildStory(code) {
    const letters = code.split("");
    return TYPE_STORIES[code] || letters.map((letter) => FRAGMENTS[letter].story).join("");
  }

  function buildStrategies(code) {
    return code.split("").map((letter) => FRAGMENTS[letter].strategy);
  }

  function buildPitfalls(code) {
    return code
      .split("")
      .map((letter) => FRAGMENTS[letter].pitfall)
      .filter((item, index, list) => list.indexOf(item) === index)
      .slice(0, 3);
  }

  function buildShareHighlights(code) {
    const safeCode = TYPES[code] ? code : "SRCP";
    return [
      SHARE_PRESENCE_LABELS[safeCode.slice(0, 2)],
      SHARE_TENSION_LABELS[safeCode[2]],
      SHARE_DECISION_LABELS[safeCode[3]],
    ];
  }

  return {
    CHAPTERS,
    QUESTIONS,
    TYPES,
    buildShareHighlights,
    computeResult,
    getFirstMissingQuestion,
  };
});
