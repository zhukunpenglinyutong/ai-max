---
name: coding-standards
description: TypeScript、JavaScript、React 和 Node.js 开发的通用编码标准、最佳实践和模式。
---

# 编码标准与最佳实践

适用于所有项目的通用编码标准。

## 代码质量原则

### 1. 可读性优先
- 代码阅读次数远多于编写次数
- 使用清晰的变量和函数名
- 优先选择自解释的代码而非注释
- 保持格式一致

### 2. KISS（保持简单）
- 使用能工作的最简单方案
- 避免过度工程化
- 不做过早优化
- 易于理解 > 聪明的代码

### 3. DRY（不要重复自己）
- 将通用逻辑抽取为函数
- 创建可复用组件
- 跨模块共享工具函数
- 避免复制粘贴式编程

### 4. YAGNI（你不会需要它）
- 不要在需要之前构建功能
- 避免投机性泛化
- 只在需要时增加复杂性
- 从简单开始，需要时再重构

## TypeScript/JavaScript 标准

### 变量命名

```typescript
// ✅ 推荐：描述性名称
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ 不推荐：不清晰的名称
const q = 'election'
const flag = true
const x = 1000
```

### 函数命名

```typescript
// ✅ 推荐：动词-名词模式
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ 不推荐：不清晰或只有名词
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

### 不可变性模式（关键）

```typescript
// ✅ 始终使用展开运算符
const updatedUser = {
  ...user,
  name: 'New Name'
}

const updatedArray = [...items, newItem]

// ❌ 永不直接修改
user.name = 'New Name'  // 不推荐
items.push(newItem)     // 不推荐
```

### 错误处理

```typescript
// ✅ 推荐：全面的错误处理
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// ❌ 不推荐：没有错误处理
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

### Async/Await 最佳实践

```typescript
// ✅ 推荐：尽可能并行执行
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ 不推荐：不必要的串行执行
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### 类型安全

```typescript
// ✅ 推荐：正确的类型定义
interface Market {
  id: string
  name: string
  status: 'active' | 'resolved' | 'closed'
  created_at: Date
}

function getMarket(id: string): Promise<Market> {
  // 实现
}

// ❌ 不推荐：使用 'any'
function getMarket(id: any): Promise<any> {
  // 实现
}
```

## React 最佳实践

### 组件结构

```typescript
// ✅ 推荐：带类型的函数组件
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// ❌ 不推荐：没有类型，结构不清晰
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### 自定义 Hooks

```typescript
// ✅ 推荐：可复用的自定义 hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// 用法
const debouncedQuery = useDebounce(searchQuery, 500)
```

### 状态管理

```typescript
// ✅ 推荐：正确的状态更新
const [count, setCount] = useState(0)

// 对于基于前一个状态的更新使用函数式更新
setCount(prev => prev + 1)

// ❌ 不推荐：直接引用状态
setCount(count + 1)  // 在异步场景中可能过时
```

### 条件渲染

```typescript
// ✅ 推荐：清晰的条件渲染
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ 不推荐：三元运算符地狱
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}
```

## API 设计标准

### REST API 约定

```
GET    /api/markets              # 列出所有市场
GET    /api/markets/:id          # 获取特定市场
POST   /api/markets              # 创建新市场
PUT    /api/markets/:id          # 更新市场（完整）
PATCH  /api/markets/:id          # 更新市场（部分）
DELETE /api/markets/:id          # 删除市场

# 用于过滤的查询参数
GET /api/markets?status=active&limit=10&offset=0
```

### 响应格式

```typescript
// ✅ 推荐：一致的响应结构
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// 成功响应
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// 错误响应
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

### 输入验证

```typescript
import { z } from 'zod'

// ✅ 推荐：Schema 验证
const CreateMarketSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  endDate: z.string().datetime(),
  categories: z.array(z.string()).min(1)
})

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const validated = CreateMarketSchema.parse(body)
    // 使用验证后的数据继续处理
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
  }
}
```

## 文件组织

### 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── markets/           # 市场页面
│   └── (auth)/           # 认证页面（路由组）
├── components/            # React 组件
│   ├── ui/               # 通用 UI 组件
│   ├── forms/            # 表单组件
│   └── layouts/          # 布局组件
├── hooks/                # 自定义 React hooks
├── lib/                  # 工具函数和配置
│   ├── api/             # API 客户端
│   ├── utils/           # 辅助函数
│   └── constants/       # 常量
├── types/                # TypeScript 类型
└── styles/              # 全局样式
```

### 文件命名

```
components/Button.tsx          # 组件使用 PascalCase
hooks/useAuth.ts              # hooks 使用 camelCase 并带 'use' 前缀
lib/formatDate.ts             # 工具函数使用 camelCase
types/market.types.ts         # 类型文件使用 camelCase 并带 .types 后缀
```

## 注释与文档

### 何时添加注释

```typescript
// ✅ 推荐：解释"为什么"，而不是"是什么"
// 使用指数退避避免在服务故障期间压垮 API
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)

// 这里故意使用修改操作以提高大数组的性能
items.push(newItem)

// ❌ 不推荐：陈述显而易见的事实
// 将计数器增加 1
count++

// 将 name 设置为用户的名字
name = user.name
```

### 公共 API 的 JSDoc

```typescript
/**
 * 使用语义相似度搜索市场。
 *
 * @param query - 自然语言搜索查询
 * @param limit - 最大结果数量（默认：10）
 * @returns 按相似度分数排序的市场数组
 * @throws {Error} 如果 OpenAI API 失败或 Redis 不可用
 *
 * @example
 * ```typescript
 * const results = await searchMarkets('election', 5)
 * console.log(results[0].name) // "Trump vs Biden"
 * ```
 */
export async function searchMarkets(
  query: string,
  limit: number = 10
): Promise<Market[]> {
  // 实现
}
```

## 性能最佳实践

### 记忆化

```typescript
import { useMemo, useCallback } from 'react'

// ✅ 推荐：记忆化昂贵的计算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ 推荐：记忆化回调函数
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

### 懒加载

```typescript
import { lazy, Suspense } from 'react'

// ✅ 推荐：懒加载重型组件
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### 数据库查询

```typescript
// ✅ 推荐：只选择需要的列
const { data } = await supabase
  .from('markets')
  .select('id, name, status')
  .limit(10)

// ❌ 不推荐：选择所有列
const { data } = await supabase
  .from('markets')
  .select('*')
```

## 测试标准

### 测试结构（AAA 模式）

```typescript
test('calculates similarity correctly', () => {
  // Arrange（准备）
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act（执行）
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert（断言）
  expect(similarity).toBe(0)
})
```

### 测试命名

```typescript
// ✅ 推荐：描述性测试名称
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ 不推荐：模糊的测试名称
test('works', () => { })
test('test search', () => { })
```

## 代码异味检测

注意这些反模式：

### 1. 过长的函数
```typescript
// ❌ 不推荐：函数超过 50 行
function processMarketData() {
  // 100 行代码
}

// ✅ 推荐：拆分为更小的函数
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

### 2. 深层嵌套
```typescript
// ❌ 不推荐：5 层以上嵌套
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // 做一些事情
        }
      }
    }
  }
}

// ✅ 推荐：提前返回
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// 做一些事情
```

### 3. 魔法数字
```typescript
// ❌ 不推荐：无解释的数字
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ 推荐：命名常量
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

**切记**：代码质量不可妥协。清晰、可维护的代码能够支撑快速开发和自信的重构。
