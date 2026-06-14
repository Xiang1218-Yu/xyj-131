# Zustand Store 状态依赖图与架构分析

> 项目：纸币收藏鉴赏平台 | Store 总数：7 个 | 核心分析：3 个关键 Store

---

## 一、架构分层总览

```
┌─────────────────────────────────────────────────────────────────┐
│                        表现层 (Pages/Components)                 │
│  BanknoteList / BanknoteDetail / Home / SearchBar / FilterBar   │
│  NotePanel / Favorites / MyNotes / RecommendSection             │
└─────────────┬──────────────────────────────┬────────────────────┘
              │                              │
              ▼                              ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│    控制层 (Control)      │     │    交互层 (Interaction)   │
│  useFilterStore          │     │  useSearchStore          │
│  useRecommendStore       │     │  useFavoriteStore        │
│                          │     │  useNoteStore            │
└─────────────┬────────────┘     │  useQuizStore            │
              │                  └────────────┬─────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │      数据层 (Source)         │
               │      useBanknoteStore        │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │    静态数据 (Static Data)    │
               │  banknotes / countries       │
               │  quizData / recommendation   │
               └──────────────────────────────┘
```

---

## 二、核心 3 Store 深度分析

### 2.1 useBanknoteStore — 核心数据层

**文件**：[useBanknoteStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useBanknoteStore.ts#L5-L109)

#### 职责边界
| 维度 | 说明 |
|------|------|
| **定位** | 全量纸币数据源 + 查询服务层 |
| **数据** | `banknotes: Banknote[]` — 静态只读全量数据 |
| **职责** | 提供查询接口，不维护任何可变业务状态 |
| **设计模式** | Facade 模式：封装对 `@/data/banknotes` 的所有访问 |

#### 状态与方法结构
```typescript
interface BanknoteStore {
  // ─── 数据源（只读静态）───
  banknotes: Banknote[];                         // 全量数据

  // ─── 单条查询 ───
  getBanknoteById(id) → Banknote | undefined;    // 详情页核心

  // ─── 集合查询（维度筛选）───
  getBanknotesByCountry(countryCode) → Banknote[];    // 国家浏览页
  getBanknotesByYear(year) → Banknote[];              // 年份浏览页
  getBanknotesByDesignElement(element) → Banknote[];  // 设计元素页
  getPopularBanknotes(limit?) → Banknote[];           // 首页热门
  getLatestBanknotes(limit?) → Banknote[];            // 首页最新
  getRelatedBanknotes(currentId, limit?) → Banknote[];// 详情推荐

  // ─── 辅助数据 ───
  getYears() → number[];                              // 年份下拉
  getRandomBanknotes(count?, excludeIds?) → Banknote[]; // 幸运抽奖
  getDesignElementCounts() → Record<string, number>;   // 设计元素统计

  // ─── 核心组合查询（数据流关键节点）───
  filterBanknotes(filters) → Banknote[];               // 列表页筛选
}
```

#### 设计特点
- **无状态变更**：全程使用 `(() => ({}))`，无 `set` 操作，是纯 Provider
- **纯函数查询**：所有方法均为确定性计算，不改变 store 内部状态
- **被依赖地位**：7 个 store 中唯一被其他所有业务场景消费的数据源

---

### 2.2 useFilterStore — 筛选控制层

**文件**：[useFilterStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useFilterStore.ts#L4-L47)

#### 职责边界
| 维度 | 说明 |
|------|------|
| **定位** | UI 筛选条件的状态容器 + URL 同步中介 |
| **数据** | 9 个筛选字段 + 3 个视图字段 |
| **职责** | 只存筛选条件，不做实际筛选逻辑 |
| **设计模式** | Presentation Model — 将 UI 状态与视图分离 |

#### 状态字段全景
```typescript
interface FilterState {
  // ─── 文本类 ───
  search: string;              // 全文搜索（来自 SearchBar 或 URL）
  tag: string;                 // 标签筛选（来自 BanknoteCard 点击）

  // ─── 枚举类（联动约束）───
  country: string;             // 国家 → 级联约束 denomination/year/material/designElement
  denomination: string;        // 面值（受 country 约束）
  material: string;            // 材质（受 country 约束，默认"全部"）
  designElement: string;       // 设计元素（受 country 约束，默认"全部"）

  // ─── 范围类 ───
  yearFrom: number | null;     // 起始年份（受 country 约束）
  yearTo: number | null;       // 结束年份（受 country 约束）

  // ─── 排序类 ───
  sortBy: 'year' | 'country' | 'favorite';  // 排序维度
  sortOrder: 'asc' | 'desc';                // 排序方向

  // ─── 展示类 ───
  viewMode: 'grid' | 'list' | 'compact';    // 视图切换
}
```

#### 设计特点
- **极简 setter**：每个字段对应单一 setter，无业务逻辑
- **单一数据源**：组件永远从 store 读状态，不使用本地 state 存筛选条件
- **外部约束逻辑**：级联约束在 [FilterBar.tsx](file:///Users/tog/Desktop/code/solo/xyj-131/src/components/banknote/FilterBar.tsx#L73-L101) 中通过 `useEffect` 实现，不污染 store

---

### 2.3 useNoteStore — 用户关联数据层

**文件**：[useNoteStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useNoteStore.ts#L9-L52)

#### 职责边界
| 维度 | 说明 |
|------|------|
| **定位** | 用户学习笔记的 CRUD + 持久化容器 |
| **数据** | `notes: Note[]` — 用户创建的笔记数组 |
| **关联** | 通过 `banknoteId` 外键关联 `useBanknoteStore` |
| **持久化** | `persist` middleware → LocalStorage (`banknote-notes`) |

#### 状态与方法
```typescript
interface NoteState {
  // ─── 状态 ───
  notes: Note[];          // [{ id, banknoteId, title, content, tags, createdAt, updatedAt }]

  // ─── 写操作 ───
  addNote(banknoteId, noteData) → Note;      // 新建笔记，关联纸币
  updateNote(noteId, updates) → void;        // 编辑（自动更新 updatedAt）
  deleteNote(noteId) → void;                 // 删除

  // ─── 读操作 ───
  getNotesByBanknoteId(banknoteId) → Note[]; // 详情页面板查询
  getAllNotes() → Note[];                    // 我的笔记页全量
}
```

#### 设计特点
- **自动 ID 生成**：`Date.now(36) + Math.random(36)`，无需依赖后端
- **自动时间戳**：`addNote`/`updateNote` 自动维护 `createdAt`/`updatedAt`
- **外键关联模式**：通过 `banknoteId` 与 Banknote 形成 N:1 关联，组件层进行 JOIN

---

## 三、核心数据流走向（3 Store 协作）

### 3.1 主数据流：列表页筛选链路

```
                    URL searchParams
                         │
              ┌──────────┴──────────┐
              │  初始化（URL→Store） │
              └──────────┬──────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    useFilterStore (状态容器)                      │
│  search, country, yearFrom, yearTo, denomination,                │
│  material, designElement, tag, sortBy, sortOrder, viewMode       │
└───────────┬──────────────────────────────────────┬───────────────┘
            │                                      │
            │ 1. FilterBar 读取 + 用户交互更新     │ 2. BanknoteList
            │    (setSearch/setCountry/...)        │    解构读取全部字段
            ▼                                      ▼
    ┌───────────────────┐          ┌─────────────────────────────┐
    │   FilterBar.tsx   │          │      BanknoteList.tsx       │
    │  - 级联约束逻辑    │          │  - useMemo 计算触发         │
    │  (useEffect 清除  │───read──▶│  - filterBanknotes(...)      │
    │   无效字段)       │          │    传入 filters 对象        │
    └───────────────────┘          └────────────┬────────────────┘
                                                │
                                                ▼
                                   ┌─────────────────────────────┐
                                   │   useBanknoteStore          │
                                   │   filterBanknotes(filters)  │
                                   │  ┌───────────────────────┐  │
                                   │  │  1. search 模糊匹配    │  │
                                   │  │     (7 字段全文检索)   │  │
                                   │  │  2. country 精确匹配   │  │
                                   │  │  3. yearFrom/To 范围   │  │
                                   │  │  4. denomination 精确  │  │
                                   │  │  5. material 精确      │  │
                                   │  │  6. designElement 包含 │  │
                                   │  │  7. tag 包含匹配       │  │
                                   │  │  8. sortBy+Order 排序  │  │
                                   │  └───────────────────────┘  │
                                   └────────────┬────────────────┘
                                                │
                                                ▼
                                   ┌─────────────────────────────┐
                                   │   filteredBanknotes[]       │
                                   │   → BanknoteGrid 渲染       │
                                   └─────────────────────────────┘
                                                │
                                                ▼
                         ┌────────────────────────────────────┐
                         │  URL 同步 (Store→searchParams)     │
                         │  useEffect 监听字段变化 → 写入 URL │
                         └────────────────────────────────────┘
```

**关键代码位置**：
- URL 初始化：[BanknoteList.tsx#L38-L62](file:///Users/tog/Desktop/code/solo/xyj-131/src/pages/BanknoteList.tsx#L38-L62)
- URL 回写：[BanknoteList.tsx#L64-L77](file:///Users/tog/Desktop/code/solo/xyj-131/src/pages/BanknoteList.tsx#L64-L77)
- 筛选触发：[BanknoteList.tsx#L79-L92](file:///Users/tog/Desktop/code/solo/xyj-131/src/pages/BanknoteList.tsx#L79-L92)
- 级联约束：[FilterBar.tsx#L73-L101](file:///Users/tog/Desktop/code/solo/xyj-131/src/components/banknote/FilterBar.tsx#L73-L101)
- 筛选实现：[useBanknoteStore.ts#L43-L108](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useBanknoteStore.ts#L43-L108)

---

### 3.2 搜索建议链路

```
 ┌────────────────────────────────────────────────────────────────┐
 │                     SearchBar.tsx                              │
 │  value (props) ────▶ getSuggestions(value)                     │
 │                       getHotSearches()                         │
 └──────────────┬─────────────────────────────┬───────────────────┘
                │                             │
                ▼                             ▼
 ┌───────────────────────────┐    ┌───────────────────────────────┐
 │    useSearchStore         │    │  useSearchStore                │
 │  ┌─────────────────────┐  │    │  ┌──────────────────────────┐ │
 │  │ getSuggestions(q)   │  │    │  │ getHotSearches()         │ │
 │  │  读取 banknotes 静态│  │    │  │  读取 banknotes 静态     │ │
 │  │  5 维度匹配:        │  │    │  │  统计频次:               │ │
 │  │  • country (名称/码)│  │    │  │  • tag Top3              │ │
 │  │  • year (包含匹配)  │  │    │  │  • country Top3          │ │
 │  │  • denomination     │  │    │  │  • denomination Top2     │ │
 │  │  • tag (包含匹配)   │  │    │  │  → 取前 8 合成           │ │
 │  │  • design 元素      │  │    │  └──────────────────────────┘ │
 │  │  → 前 10 条         │  │    │                               │
 │  └─────────────────────┘  │    │  ┌──────────────────────────┐ │
 │                           │    │  │ addToHistory(query)      │ │
 │                           │    │  │ 去重 + LRU(最多 10 条)    │ │
 │                           │    │  │ persist → search-history │ │
 │  SearchSuggestion[] ◀─────┤    │  └──────────────────────────┘ │
 └──────────────┬────────────┘    └───────────────┬───────────────┘
                │                                 │
                │ suggestion.filterParams         │ 点击建议后
                ▼                                 ▼
    ┌────────────────────────────────────────────────────────┐
    │  navigateWithParams(filterParams)                      │
    │  → navigate(`/banknotes?${qs}`)                        │
    │    ↓ (下一页加载)                                      │
    │  useFilterStore 从 URL searchParams 初始化字段         │
    │  → 进入 3.1 主数据流                                  │
    └────────────────────────────────────────────────────────┘
```

**关键代码位置**：
- 建议计算：[useSearchStore.ts#L108-L223](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useSearchStore.ts#L108-L223)
- 热门搜索：[useSearchStore.ts#L26-L86](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useSearchStore.ts#L26-L86)
- 历史管理：[useSearchStore.ts#L92-L107](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useSearchStore.ts#L92-L107)
- 跳转链路：[SearchBar.tsx#L70-L111](file:///Users/tog/Desktop/code/solo/xyj-131/src/components/common/SearchBar.tsx#L70-L111)

---

### 3.3 笔记关联链路

```
┌─────────────────────────────────────────────────────────────────────┐
│                       BanknoteDetail.tsx                            │
│  URL params: id ──▶ getBanknoteById(id) ──▶ banknote 对象          │
└────────────┬──────────────────────────────────────────┬─────────────┘
             │                                          │
             │ 1. 渲染详情头部/图片                     │ 2. 渲染笔记面板
             │                                          │    (NotePanel)
             ▼                                          ▼
   ┌──────────────────────┐             ┌───────────────────────────────┐
   │ useBanknoteStore     │             │       NotePanel.tsx           │
   │                      │             │  banknoteId (props 传入)      │
   │                      │             │                               │
   │                      │             │  notes.filter(                │
   │                      │             │    n.banknoteId === banknoteId│
   │                      │             │  ) ← 组件层 JOIN 操作          │
   │                      │             │                               │
   │                      │             │  addNote(banknoteId, {...})   │
   │                      │             │    ↓                          │
   │                      │             │  useNoteStore                 │
   │                      │             │  ┌─────────────────────────┐ │
   │                      │             │  │ notes: Note[] (持久化)   │ │
   │                      │             │  │ persist: banknote-notes  │ │
   │                      │             │  └─────────────────────────┘ │
   └──────────────────────┘             └───────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         MyNotes.tsx (全量笔记页)                     │
│  notes = useNoteStore.getAllNotes()                                 │
│  banknotes = useBanknoteStore.banknotes                             │
│                                                                     │
│  组件层 JOIN:                                                        │
│  notes.map(note => ({                                               │
│    ...note,                                                          │
│    banknote: banknotes.find(b => b.id === note.banknoteId)          │
│  }))                                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

**关键代码位置**：
- 笔记面板 JOIN：[NotePanel.tsx#L22-L25](file:///Users/tog/Desktop/code/solo/xyj-131/src/components/banknote/NotePanel.tsx#L22-L25)
- 新建笔记：[NotePanel.tsx#L35-L44](file:///Users/tog/Desktop/code/solo/xyj-131/src/components/banknote/NotePanel.tsx#L35-L44)
- 全量笔记 JOIN：[MyNotes.tsx](file:///Users/tog/Desktop/code/solo/xyj-131/src/pages/MyNotes.tsx)
- Note Store 实现：[useNoteStore.ts#L9-L52](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useNoteStore.ts#L9-L52)

---

## 四、完整 Store 依赖关系图

### 4.1 依赖矩阵（谁消费谁）

| 消费方 \ 数据源 | useBanknoteStore | useFilterStore | useSearchStore | useNoteStore | useFavoriteStore | useRecommendStore | useQuizStore |
|-----------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **BanknoteList** | ✅ filterBanknotes | ✅ 全字段读取+写入 | — | — | — | — | — |
| **BanknoteDetail** | ✅ getById/getRelated | — | — | — | ✅ 收藏切换 | — | — |
| **FilterBar** | ✅ banknotes (级联计算) | ✅ 全字段读取+写入 | — | — | — | — | — |
| **SearchBar** | — | — | ✅ 建议/历史/热门 | — | — | — | — |
| **NotePanel** | — | — | — | ✅ 增删改查 | — | — | — |
| **MyNotes** | ✅ banknotes (JOIN) | — | — | ✅ 全量 | — | — | — |
| **RecommendSection** | ✅ banknotes | — | — | — | — | ✅ 推荐加载 | — |
| **Favorites** | ✅ banknotes (JOIN) | — | — | — | ✅ ids+操作 | — | — |
| **LuckyDraw** | ✅ getRandomBanknotes | — | — | — | ✅ 收藏切换 | — | — |
| **BanknoteCard** | — | ✅ setTag | — | — | ✅ 收藏切换 | — | — |
| **Home** | ✅ getLatest/banknotes | — | — | — | — | — | — |
| **Quiz 系列页面** | — | — | — | — | — | — | ✅ 全流程 |

### 4.2 依赖拓扑图

```
                         ┌─────────────────────┐
                         │   Static Data       │
                         │  banknotes[]        │
                         │  countries[]        │
                         └──────────┬──────────┘
                                    │ 直接 import
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
┌──────────────────────┐  ┌────────────────────┐  ┌─────────────────────┐
│  useBanknoteStore    │  │  useSearchStore    │  │  useRecommendStore  │
│  (只读数据源)         │  │  (建议+历史)       │  │  (推荐算法封装)      │
│                      │  │                    │  │                     │
│  banknotes[]         │  │  history[]         │  │  recommendations[] │
│  filterBanknotes()   │  │  getSuggestions()  │  │  dimension         │
│  getXxxBanknotes()   │  │  getHotSearches()  │  │  loadRecommendations│
└───────┬──────────────┘  └────────┬───────────┘  └──────────┬──────────┘
        │   ↑                      │                         │
        │   │                      │ filterParams            │
        │   │                      ▼                         │
        │   │           ┌────────────────────┐               │
        │   │           │  URL Search Params │◀──────────────┘
        │   │           └─────────┬──────────┘
        │   │                     │
        │   │                     ▼
        │   │           ┌────────────────────┐
        │   │           │  useFilterStore    │
        │   │           │  (筛选状态容器)     │
        │   │           │                    │
        │   │           │  search/country/   │
        │   │           │  yearFrom/To/...   │
        │   │           │  viewMode          │
        │   │           └────────┬───────────┘
        │   │                    │
        │   │  filters 对象      │ setTag
        │   └────────────────────┼───────────┐
        │                        │           │
        │                        ▼           ▼
        │  ┌──────────────────────────┐ ┌──────────────────────┐
        │  │  BanknoteCard.tsx        │ │ FilterBar.tsx        │
        │  │  - tag 点击跳转          │ │ - 级联约束 useEffect │
        │  └──────────────────────────┘ └──────────────────────┘
        │
        │  JOIN (组件层)
        ├─────────────────────────────────────────────────┐
        │                                                 │
        ▼                                                 ▼
┌──────────────────────┐                       ┌──────────────────────┐
│  useFavoriteStore    │                       │  useNoteStore        │
│  (持久化收藏)         │                       │  (持久化笔记)         │
│                      │                       │                      │
│  ids: string[]       │                       │  notes: Note[]       │
│  isFavorite/add/rm   │                       │  CRUD + getByBanknote│
└──────────┬───────────┘                       └──────────┬───────────┘
           │                                                 │
           ▼                                                 ▼
   Favorites.tsx                                    NotePanel / MyNotes.tsx
   (收藏列表 JOIN)                                   (笔记详情 + 列表 JOIN)
```

---

## 五、其他 Stores 概览（补充分析）

### 5.1 useFavoriteStore — 收藏容器

**文件**：[useFavoriteStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useFavoriteStore.ts#L5-L25)

- **模式**：与 useNoteStore 相同的"ID 数组 + 外键关联"模式
- **持久化**：`persist` → LocalStorage (`banknote-favorites`)
- **特殊点**：`favoriteCount` 排序在 useBanknoteStore 中使用 Banknote 静态字段，不读此 store（排序是数据内置属性）

### 5.2 useRecommendStore — 推荐引擎封装

**文件**：[useRecommendStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useRecommendStore.ts#L30-L89)

- **核心职责**：管理推荐维度 + 已浏览去重 + 调用 `recommendation.ts` 算法
- **独立数据**：不依赖其他 store，直接 import `recommendByDimension`
- **去重机制**：`seenIds` 记录已推荐 ID，`refreshBatch()` 循环浏览

### 5.3 useQuizStore — 测验状态机

**文件**：[useQuizStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useQuizStore.ts#L23-L101)

- **状态机**：`phase: select → playing → result`
- **独立性**：完全自治，不依赖任何其他 store（从 `quizData` 生成题目）
- **无持久化**：刷新即重置

---

## 六、架构设计评价

### ✅ 优点

1. **单一职责清晰**：数据层（BanknoteStore）、控制层（FilterStore）、用户层（Note/FavoriteStore）严格分离
2. **无循环依赖**：所有依赖单向指向 useBanknoteStore，拓扑清晰
3. **持久化策略明确**：用户数据（笔记/收藏/搜索历史）持久化，业务状态（筛选/推荐/测验）不持久化
4. **组合而非继承**：store 间不互相 import，在组件层做 JOIN 和组合调用

### ⚠️ 潜在优化点

| 问题 | 现状 | 建议 |
|------|------|------|
| **FilterBar 级联约束散落组件层** | 5 个 `useEffect` 在 FilterBar 内做字段清除 | 可在 useFilterStore 中提供 `setCountryWithCascade()` 聚合方法 |
| **SearchStore 重复读取 banknotes** | 每次 getSuggestions 都遍历全量数据 | 可在 store 初始化时构建倒排索引（国家/年份/标签 Map） |
| **收藏与排序脱钩** | filterBanknotes 的 favorite 排序用静态字段，非用户实际收藏数 | 可考虑 filterBanknotes 接受 favoriteIds 参数动态排序 |

---

## 七、关键代码索引

| 模块 | 入口文件 | 核心方法行数 |
|------|----------|-------------|
| 数据源核心 | [useBanknoteStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useBanknoteStore.ts) | filterBanknotes: L43-L108 |
| 筛选容器 | [useFilterStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useFilterStore.ts) | 状态定义: L19-L31 |
| 笔记容器 | [useNoteStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useNoteStore.ts) | persist 配置: L48-L50 |
| 主链路组合 | [BanknoteList.tsx](file:///Users/tog/Desktop/code/solo/xyj-131/src/pages/BanknoteList.tsx) | URL 双向同步: L38-L77 |
| 级联约束 | [FilterBar.tsx](file:///Users/tog/Desktop/code/solo/xyj-131/src/components/banknote/FilterBar.tsx) | 字段清除 useEffect: L73-L101 |
| 搜索建议 | [useSearchStore.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/store/useSearchStore.ts) | 5 维匹配: L108-L223 |
| 推荐算法 | [recommendation.ts](file:///Users/tog/Desktop/code/solo/xyj-131/src/utils/recommendation.ts) | 9 维度打分: L152-L308 |
