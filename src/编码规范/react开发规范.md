## 1 组件命名与结构

### 1.1 文件命名

- 组件文件使用 PascalCase 命名，例如：`UserProfile.tsx`
- 非组件文件使用 camelCase 命名，例如：`userService.ts`
- 样式文件与组件文件同名，例如：`UserProfile.module.css` 或 `UserProfile.styles.ts`

### 1.2 组件命名

- 组件名称使用 PascalCase
- 组件名称应具有描述性，反映其功能

```tsx
// 推荐
function UserProfile() {}

// 避免
function User() {}
function ProfileComponent() {}
```

### 1.3 组件结构

- 使用函数式组件和 Hooks
- 组件结构顺序：
  1. 导入语句
  2. 类型定义
  3. 组件函数声明
  4. State 和 Hooks 调用
  5. 事件处理函数
  6. 辅助函数
  7. 渲染逻辑
  8. 导出语句

```tsx
import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';
import styles from './UserProfile.module.css';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // 异步获取用户数据
      const data = await getUserById(userId);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    onUpdate?.(updatedUser);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <div className={styles.error}>User not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* 更多渲染内容 */}
    </div>
  );
}
```

## 2 Hooks 使用规范

### 2.1 基本规则

- 只在 React 函数组件或自定义 Hook 中调用 Hooks
- 不要在循环、条件或嵌套函数中调用 Hooks
- 确保 Hooks 在每次渲染时按相同的顺序调用

### 2.2 useState 规范

- 使用函数式更新避免状态依赖
- 初始化复杂状态时使用函数式初始化

```tsx
// 推荐
const [count, setCount] = useState(0);
setCount(prevCount => prevCount + 1);

// 复杂状态初始化
const [data, setData] = useState(() => {
  // 复杂计算或从 localStorage 获取初始值
  return JSON.parse(localStorage.getItem('data') || '{}');
});
```

#### 2.2.1 避免过时闭包

- **使用函数式更新避免闭包陷阱**：
  - 当状态更新依赖于前一个状态值时，始终使用函数式更新
  - 函数式更新可以确保获取到最新的状态值，而不受闭包影响

```tsx
// 问题：闭包捕获了过时的 count 值
function OutdatedClosureExample() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    setTimeout(() => {
      // 问题：这里的 count 是闭包中捕获的值，可能已经过时
      setCount(count + 1);
    }, 1000);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment After Delay</button>
    </div>
  );
}

// 正确做法：使用函数式更新
function SolutionWithFunctionalUpdate() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    setTimeout(() => {
      // 函数式更新始终获取最新的状态值
      setCount(prevCount => prevCount + 1);
    }, 1000);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment After Delay</button>
    </div>
  );
}
```

- **使用 useRef 存储最新值**：
  - 当需要在回调函数中访问最新的状态值，而不想触发重新渲染时
  - 特别是在定时器、事件监听器等异步场景中

```tsx
function RefSolutionExample() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  
  // 同步 ref 和 state
  useEffect(() => {
    countRef.current = count;
  }, [count]);
  
  const handleDelayedLog = () => {
    setTimeout(() => {
      // 从 ref 获取最新值
      console.log('Current count:', countRef.current);
    }, 2000);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleDelayedLog}>Log After Delay</button>
    </div>
  );
}
```

- **setData 与对象/数组更新**：
  - 更新对象或数组时，确保创建新的副本，避免直接修改状态
  - 结合函数式更新可以确保获取到最新的状态值

```tsx
// 对象更新
const [user, setUser] = useState({ name: '', age: 0 });
// 正确做法：创建新对象并使用函数式更新
setUser(prevUser => ({
  ...prevUser,
  name: 'New Name'
}));

// 数组更新
const [items, setItems] = useState([]);
// 正确做法：创建新数组并使用函数式更新
setItems(prevItems => [...prevItems, newItem]);
setItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
```

### 2.3 useEffect 规范

- 明确依赖项，避免遗漏或不必要的依赖
- 及时清理副作用
- 拆分多个不相关的副作用

```tsx
// 推荐 - 拆分不相关的副作用
useEffect(() => {
  // 处理用户认证相关逻辑
  const subscription = authService.subscribeToAuthChanges(handleAuthChange);
  return () => subscription.unsubscribe();
}, []);

useEffect(() => {
  // 处理数据获取逻辑
  fetchData(userId);
}, [userId]);

// 避免 - 混合不相关的逻辑
useEffect(() => {
  document.title = `User: ${user?.name}`;
  fetchData(userId);
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, [userId, user?.name]);
```

### 2.4 useMemo 和 useCallback

#### 2.4.1 useMemo 详细使用规范

- **使用场景**：
  - 昂贵的计算操作（如数组排序、过滤、映射等）
  - 依赖项变化时才需要重新计算的值
  - 作为子组件的稳定prop，避免子组件不必要的重渲染

- **使用规范**：
  - 明确声明依赖数组中的所有外部变量
  - 避免在 useMemo 中执行有副作用的操作
  - 不要过度优化简单计算，权衡性能提升与内存开销

```tsx
// 推荐：缓存昂贵计算结果
const filteredUsers = useMemo(() => {
  console.log('执行过滤操作');
  return users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    user.age > minAge
  ).sort((a, b) => a.name.localeCompare(b.name));
}, [users, searchTerm, minAge]);

// 避免：简单计算不需要 memo
const sum = useMemo(() => a + b, [a, b]); // 过度优化
```

#### 2.4.2 useCallback 详细使用规范

- **使用场景**：
  - 函数作为prop传递给子组件，特别是使用了 React.memo 的子组件
  - 函数被用作 useEffect 的依赖项
  - 事件处理函数需要保持引用稳定

- **使用规范**：
  - 确保依赖数组包含所有在回调函数中使用的外部变量
  - 结合 React.memo 使用效果更佳
  - 避免对简单内联函数进行不必要的缓存

```tsx
// 推荐：缓存传递给 memo 组件的回调函数
const MemoizedChild = memo(function Child({ onUpdate }) {
  console.log('Child 组件渲染');
  return <button onClick={onUpdate}>更新</button>;
});

function Parent({ data, onSave }) {
  // 正确缓存回调函数，避免子组件不必要的重渲染
  const handleUpdate = useCallback(() => {
    onSave(data);
  }, [data, onSave]);

  return <MemoizedChild onUpdate={handleUpdate} />;
}

// 避免：在依赖项中使用不稳定的对象或函数
function IncorrectExample() {
  // 每次渲染都会创建新的配置对象
  const config = { timeout: 300 };
  
  // 问题：config 引用变化会导致 handleClick 重新创建
  const handleClick = useCallback(() => {
    console.log(config.timeout);
  }, [config]); // 错误：config 不是稳定引用
  
  return <button onClick={handleClick}>点击</button>;
}

// 正确做法：使用 useMemo 或内联常量
function CorrectExample() {
  // 方法1：内联常量
  const handleClick = useCallback(() => {
    console.log(300); // 直接使用常量
  }, []);
  
  // 方法2：使用 useMemo 缓存对象
  const config = useMemo(() => ({ timeout: 300 }), []);
  const handleClickWithConfig = useCallback(() => {
    console.log(config.timeout);
  }, [config]);
  
  return <button onClick={handleClick}>点击</button>;
}
```
### 2.5 生命周期相关 Hooks

#### 2.5.1 useEffect 生命周期模拟与最佳实践

- **模拟 componentDidMount**：
  ```tsx
  useEffect(() => {
    // 组件挂载时执行
    console.log('Component mounted');
    
    // 可选的清理函数（模拟 componentWillUnmount）
    return () => {
      console.log('Component unmounting');
    };
  }, []); // 空依赖数组
  ```

- **模拟 componentDidUpdate**：
  ```tsx
  useEffect(() => {
    // 当 count 或 name 变化时执行
    console.log(`Updated: count=${count}, name=${name}`);
  }, [count, name]); // 依赖项数组
  ```

- **useEffect 中处理异步操作**：
  ```tsx
  // 推荐方式：使用 async 函数包装
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchSomeData(id);
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  ```

#### 2.5.2 useLayoutEffect

- **使用场景**：
  - 需要在 DOM 更新后但浏览器绘制前读取或操作 DOM
  - 需要精确测量 DOM 节点尺寸或位置
  - 同步调整 DOM 布局

- **使用规范**：
  - 优先使用 useEffect，仅在必要时使用 useLayoutEffect
  - 避免在 useLayoutEffect 中执行耗时操作
  - 服务端渲染时注意 useLayoutEffect 不执行的问题

```tsx
function MeasureComponent() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    if (ref.current) {
      // 在 DOM 更新后但浏览器绘制前获取尺寸
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);
  
  return (
    <div>
      <div ref={ref} style={{ width: '100%', height: '200px', background: 'lightblue' }}>
        测量我
      </div>
      <p>Width: {dimensions.width}px, Height: {dimensions.height}px</p>
    </div>
  );
}
```

### 2.6 React 18+ 新 Hooks

#### useId

用于生成唯一 ID，适用于表单、无障碍等场景：

```tsx
const id = useId();

return (
  <div>
    <label htmlFor={id}>Name:</label>
    <input id={id} type="text" />
  </div>
);
```

#### useTransition

用于区分紧急和非紧急更新：

```tsx
const [isPending, startTransition] = useTransition();

const handleSearch = (query) => {
  // 紧急更新：更新输入状态
  setQuery(query);
  // 非紧急更新：执行搜索
  startTransition(() => {
    performSearch(query);
  });
};
```

#### useDeferredValue

延迟更新不那么紧急的值：

```tsx
const deferredValue = useDeferredValue(value);
```

### 2.7 其他常用 Hooks

#### 2.7.1 useReducer

- **使用场景**：
  - 复杂的状态逻辑，特别是状态转换依赖于之前的状态
  - 多个状态之间相互关联
  - 状态更新逻辑复杂或需要复用

- **使用规范**：
  - 将 reducer 函数定义在组件外部或使用 useCallback 缓存
  - action 类型使用常量定义
  - 遵循 FSA (Flux Standard Action) 模式

```tsx
// 定义 action 类型常量
type CounterAction = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_VALUE'; payload: number };

// 定义 reducer 函数
function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'RESET':
      return 0;
    case 'SET_VALUE':
      return action.payload;
    default:
      return state;
  }
}

function CounterWithReducer() {
  const [count, dispatch] = useReducer(counterReducer, 0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET_VALUE', payload: 100 })}>Set to 100</button>
    </div>
  );
}

// 复杂状态管理示例
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_TODOS'; payload: Todo[] };

function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now().toString(), text: action.payload, completed: false }];
    case 'TOGGLE_TODO':
      return state.map(todo => 
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'SET_TODOS':
      return action.payload;
    default:
      return state;
  }
}
```

#### 2.7.2 useContext

- **使用场景**：
  - 全局状态管理（简单场景）
  - 跨组件传递数据，避免 props drilling
  - 主题配置、用户认证状态等全局信息

- **使用规范**：
  - 为 Context 提供默认值
  - 使用 Provider 包装需要访问上下文的组件树
  - 考虑使用 useReducer + useContext 组合管理复杂上下文状态
  - 避免在 Context 中存储频繁变化的值

```tsx
// 创建 Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

// 创建 Provider 组件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 Hook 简化使用
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 使用 Context 的组件
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        border: `1px solid ${theme === 'light' ? '#ddd' : '#666'}`
      }}
    >
      Toggle Theme
    </button>
  );
}
```

#### 2.7.3 useRef

- **使用场景**：
  - 获取 DOM 元素引用
  - 存储不需要触发重新渲染的可变值
  - 保存定时器 ID、WebSocket 连接等
  - 解决闭包问题

- **使用规范**：
  - 使用适当的 TypeScript 类型标注
  - 避免过度使用 ref 操作 DOM
  - 对于复杂 DOM 操作，考虑使用专门的库

```tsx
function UseRefExamples() {
  // 1. DOM 引用
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 2. 存储可变值
  const counterRef = useRef(0);
  
  // 3. 存储定时器 ID
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      counterRef.current += 1;
      console.log(`Timer: ${counterRef.current}s`);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  // 清理副作用
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <input ref={inputRef} placeholder="输入内容" />
      <button onClick={focusInput}>聚焦输入框</button>
      <div>
        <button onClick={startTimer}>开始计时</button>
        <button onClick={stopTimer}>停止计时</button>
        <p>当前计数: {counterRef.current}</p>
      </div>
    </div>
  );
}
```

### 2.8 自定义 Hook

- 命名以 `use` 开头
- 封装可复用的状态逻辑
- 遵循 Hook 规则

```tsx
// 自定义 Hook 示例
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## 3 性能优化

### 3.1 组件拆分

- 将大型组件拆分为更小的专注组件
- 使用无状态组件（memo）避免不必要的重渲染

```tsx
// 使用 memo 优化组件
const ExpensiveComponent = memo(function ExpensiveComponent({ value }) {
  // 昂贵的渲染逻辑
  return <div>{value}</div>;
});
```

### 3.2 虚拟列表

对于长列表，使用虚拟滚动技术：

```tsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index]}</div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 3.3 代码分割

使用动态导入实现代码分割：

```tsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
```

## 4 状态管理

### 4.1 组件级状态
- 使用 `useState` 和 `useReducer` 管理组件内部状态
- 避免将所有状态放在顶层组件

### 4.2 全局状态
- 使用 Context API 或状态管理库（如 Redux Toolkit、Zustand、Jotai 等）
- 遵循状态管理最佳实践

```tsx
// Redux Toolkit 示例
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// 在组件中使用
import { useDispatch, useSelector } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
      <div>{count}</div>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </>
  );
}
```

## 5 受控组件与非受控组件

### 5.1 受控组件

受控组件是由React状态控制其值的表单元素。

#### 5.1.1 使用场景
- 需要实时验证用户输入
- 需要根据用户输入动态更新UI
- 需要同步多个输入字段
- 表单数据需要与其他UI状态协同工作

#### 5.1.2 实现规范
- 使用`useState`管理表单值
- 为每个表单元素提供`value`和`onChange`属性
- `onChange`处理函数应更新对应的状态

```tsx
// 受控组件示例
function ControlledForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理表单提交
    console.log({ username, email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">邮箱:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">提交</button>
    </form>
  );
}
```

### 5.2 非受控组件

非受控组件是由DOM自身管理其值的表单元素，React不直接控制其值。

#### 5.2.1 使用场景
- 简单表单，不需要实时验证
- 需要保留初始值
- 集成第三方库
- 文件上传功能
- 性能敏感场景

#### 5.2.2 实现规范
- 使用`useRef`创建对DOM元素的引用
- 可以使用`defaultValue`或`defaultChecked`设置初始值
- 通过引用访问表单值

```tsx
// 非受控组件示例
function UncontrolledForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 通过引用获取表单值
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    console.log({ username, email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名:</label>
        <input
          id="username"
          type="text"
          ref={usernameRef}
          defaultValue=""
          required
        />
      </div>
      <div>
        <label htmlFor="email">邮箱:</label>
        <input
          id="email"
          type="email"
          ref={emailRef}
          defaultValue=""
          required
        />
      </div>
      <button type="submit">提交</button>
    </form>
  );
}

// 文件上传示例
function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = () => {
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      console.log('上传文件:', file.name);
      // 处理文件上传逻辑
    }
  };
  
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current?.click()}>
        选择文件
      </button>
      <button onClick={handleUpload}>
        上传文件
      </button>
    </div>
  );
}
```

### 5.3 最佳实践

- **优先使用受控组件**：在大多数表单场景中，受控组件提供更好的可预测性和控制能力
- **避免混合使用**：同一个表单中尽量避免混合使用受控和非受控组件
- **性能考虑**：对于包含大量输入字段的复杂表单，可以考虑使用状态管理库或表单库（如Formik、React Hook Form）
- **使用表单库**：对于复杂表单，推荐使用专门的表单库来简化受控组件的实现

```tsx
// 使用 React Hook Form 的示例
import { useForm } from 'react-hook-form';

function FormWithHookForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: any) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">用户名:</label>
        <input
          id="username"
          {...register('username', { required: '用户名不能为空' })}
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <button type="submit">提交</button>
    </form>
  );
}
```

## 6 TypeScript 使用
  
### 6.1 类型定义

- 为所有组件 props 和 state 添加类型
- 使用接口定义组件 props
- 避免使用 `any` 类型

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ variant = 'primary', size = 'medium', disabled, onClick, children }: ButtonProps) {
  // 组件实现
}
```

### 6.2 类型导入

使用 `import type` 导入仅用于类型的模块：

```tsx
import type { User, Product } from '@/types/models';
import { fetchUser } from '@/services/userService';
```

## 7 代码格式与规范

### 7.1 ESLint 和 Prettier

- 使用 ESLint 检查代码质量和语法错误
- 使用 Prettier 统一代码格式

### 7.2 JSX 规范

- 组件属性顺序：
  1. `key` 属性
  2. 事件处理函数
  3. 其他属性
  4. `className`
  5. `style`
  6. `children`

```tsx
// 推荐
<li key={item.id} onClick={handleClick} data-testid="item" className={styles.item}>
  {item.name}
</li>

// 避免
<li className={styles.item} key={item.id} data-testid="item" onClick={handleClick}>
  {item.name}
</li>
```

### 7.3 注释规范

- 为复杂组件和函数添加 JSDoc 注释
- 解释业务逻辑和边缘情况处理

```tsx
/**
 * 用户资料展示组件
 * @param props 组件属性
 * @returns React 元素
 */
function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 实现
}
```

## 8 组件测试

### 8.1 测试工具

- 使用 React Testing Library 进行组件测试
- 使用 Jest 作为测试运行器

### 8.2 测试覆盖

- 测试组件的渲染
- 测试交互行为
- 测试边缘情况

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 9 无障碍性 (A11Y)

- 使用语义化 HTML
- 提供适当的 ARIA 属性
- 确保键盘可访问性
- 测试色彩对比度

```tsx
// 推荐
<button aria-label="Close dialog" onClick={handleClose}>
  ✕
</button>

// 避免
<div onClick={handleClose} style={{ cursor: 'pointer' }}>✕</div>
```

## 10 错误边界

使用错误边界处理组件错误，避免整个应用崩溃：

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// 使用
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <MyComponent />
</ErrorBoundary>
```

## 11 最新 React 特性（React 19+）

### 11.1 useOptimistic Hook

用于乐观 UI 更新，提升用户体验：

```tsx
function App() {
  const [optimisticState, addOptimistic] = useOptimistic(
    currentState,
    (state, optimisticUpdate) => {
      // 返回应用乐观更新后的临时状态
      return { ...state, ...optimisticUpdate };
    }
  );

  const handleSubmit = async (data) => {
    // 立即更新 UI
    addOptimistic({ isPending: true });
    try {
      await saveData(data);
    } catch (error) {
      // 错误处理
    }
  };
}
```

### 11.2 useFormStatus Hook

简化表单状态管理：

```tsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>Submit</button>;
}
```

## 12 DOM 操作规范与最佳实践

### 12.1 禁止使用 jQuery 操作 DOM

- **绝对禁止**在 React 项目中使用 jQuery 进行 DOM 操作
- jQuery 直接操作 DOM 会绕过 React 的虚拟 DOM，导致状态与视图不一致
- React 提供了声明式的方式处理 UI，不需要直接操作 DOM

### 12.2 React 推荐的 DOM 操作方式

- 使用 React 的声明式 API 处理 UI 更新
- 对于需要直接 DOM 引用的场景，使用 `useRef` Hook
- 对于复杂交互，考虑使用 React 状态驱动 UI 变化

```tsx
// 推荐做法
function MyComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  return (
    <div>
      <div className={`container ${isVisible ? 'visible' : ''}`}>
        内容区域
      </div>
      <input 
        ref={inputRef}
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={!isVisible}
      />
      <button onClick={focusInput}>聚焦输入框</button>
      <button onClick={() => setIsVisible(!isVisible)}>切换显示</button>
    </div>
  );
}
```

```jsx
// 避免做法 - 使用 jQuery
class BadComponent extends Component {
  showElement = () => {
    $("#waitingSendExportId").css({ display: "flex" });
    $("#sendErrorByLeftId").css({ display: "none" });
  };
  
  disableInput = () => {
    $("#supplierWangWangInputId").attr("disabled", "disabled");
  };
  
  render() {
    return (
      <div>
        <div id="waitingSendExportId">内容</div>
        <input id="supplierWangWangInputId" />
      </div>
    );
  }
}
```

## 13 避免使用 Class 组件

### 13.1 使用函数式组件替代 Class 组件

> 现代 React 开发中，应优先使用函数式组件和 Hooks，避免使用传统的 Class 组件。

```tsx
// 推荐 - 使用函数式组件和 Hooks
function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    loadOrderList();
  }, []);
  
  const loadOrderList = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders();
      setOrderList(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="order-list">
      {isLoading && <LoadingSpinner />}
      {orderList.map(order => <OrderItem key={order.id} order={order} />)}
    </div>
  );
}

// 避免 - 使用 Class 组件
// class OrderList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       orderList: [],
//       isLoading: false
//     };
//   }
//   
//   componentDidMount() {
//     this.loadList();
//   }
//   
//   loadList = async () => {
//     this.setState({ isLoading: true });
//     const res = await OrderListRequest();
//     // ...
//   };
// }
```

## 14 状态管理规范

### 14.1 禁止直接修改 state

- 永远不要直接修改 state，这可能导致组件不会重新渲染
- 使用函数式更新或 setState 方法更新状态

```tsx
// 函数式组件中
const [isLoading, setIsLoading] = useState(false);
const loadData = async () => {
  setIsLoading(true);  // 正确
  try {
    await fetchData();
  } finally {
    setIsLoading(false);
  }
};

// 禁止直接修改 state
// this.state.isLoading = true;  // 错误
// this.state.isNotList = true;  // 错误
```

### 14.2 避免过度庞大的 state

- 组件的 state 应该保持精简，避免在单个组件中管理过多状态
- 考虑使用状态管理库或拆分组件
- 使用自定义 Hook 封装相关状态逻辑

```tsx
// 使用自定义 Hook 管理相关状态
function useOrderState() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  
  const loadOrders = async () => {
    // 加载逻辑
  };
  
  return {
    orders,
    filters,
    pagination,
    loadOrders,
    setFilters
  };
}
```

## 15 样式使用规范

### 15.1 样式文件组织
- 样式文件与组件文件同名，例如：`UserProfile.module.css` 或 `UserProfile.styles.ts`
- 将样式文件与组件文件放在同一目录下，便于维护
- 对于共享样式，创建单独的 `styles` 目录进行管理

### 15.2 CSS Modules 使用规范

**CSS Modules 是React项目中推荐的样式方案之一，具有以下优势：**
1. **样式隔离**：类名自动哈希处理，避免全局命名冲突
2. **局部作用域**：默认情况下所有样式都是局部的
3. **构建优化**：未使用的样式会被自动移除
4. **预处理器支持**：可与SCSS/LESS等预处理器结合使用，增强CSS能力

**使用规范：**
- 支持使用 `.module.css`、`.module.scss` 和 `.module.less` 扩展名
- 类名采用驼峰命名法，方便在JavaScript中以对象属性形式访问
- 对于需要全局的样式，使用 `:global()` 包裹
- 避免在CSS Modules中使用ID选择器
- 命名应遵循BEM或语义化原则

**CSS Modules (CSS) 示例：**

```css
/* Button.module.css */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.primaryButton {
  background-color: #1890ff;
  color: white;
}

.primaryButton:hover {
  background-color: #40a9ff;
}

.secondaryButton {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.secondaryButton:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 全局样式 */
:global(.text-center) {
  text-align: center;
}
```

**CSS Modules (SCSS) 示例：**

```scss
/* Button.module.scss */
// 变量定义
$primary-color: #1890ff;
$primary-hover: #40a9ff;
$border-color: #d9d9d9;
$text-color: #333;
$transition-time: 0.3s;

// 混合器
@mixin buttonBase {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all $transition-time ease;
}

.button {
  @include buttonBase;
}

// 嵌套样式
.primaryButton {
  @extend .button;
  background-color: $primary-color;
  color: white;
  
  &:hover {
    background-color: $primary-hover;
  }
}

.secondaryButton {
  @extend .button;
  background-color: #f5f5f5;
  color: $text-color;
  border: 1px solid $border-color;
  
  &:hover {
    border-color: $primary-hover;
    color: $primary-hover;
  }
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  
  &:hover {
    // 禁用悬停效果
    background-color: inherit !important;
    color: inherit !important;
    border-color: inherit !important;
  }
}

// 全局样式
:global(.text-center) {
  text-align: center;
}
```

**CSS Modules (LESS) 示例：**

```less
/* Button.module.less */
// 变量定义
@primary-color: #1890ff;
@primary-hover: #40a9ff;
@border-color: #d9d9d9;
@text-color: #333;
@transition-time: 0.3s;

// 混合器
.button-base() {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all @transition-time ease;
}

.button {
  .button-base();
}

// 嵌套样式
.primaryButton {
  .button-base();
  background-color: @primary-color;
  color: white;
  
  &:hover {
    background-color: @primary-hover;
  }
}

.secondaryButton {
  .button-base();
  background-color: #f5f5f5;
  color: @text-color;
  border: 1px solid @border-color;
  
  &:hover {
    border-color: @primary-hover;
    color: @primary-hover;
  }
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  
  &:hover {
    // 禁用悬停效果
    background-color: inherit !important;
    color: inherit !important;
    border-color: inherit !important;
  }
}

// 全局样式
  :global(.text-center) {
    text-align: center;
  }
```
```jsx
// Button.jsx - 与CSS Modules (.css/.scss/.less) 兼容
import React from 'react';

// 注意：以下三种导入方式根据实际使用的预处理器类型选择其一
// 1. 普通CSS - 适用于Button.module.css文件
// import styles from './Button.module.css';

// 2. SCSS预处理器 - 适用于Button.module.scss文件
// import styles from './Button.module.scss';

// 3. LESS预处理器 - 适用于Button.module.less文件
// import styles from './Button.module.less';

// 示例中使用普通CSS
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  // 其他HTML button元素支持的属性
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  className,
  ...rest
}) => {
  // 构建类名数组，便于过滤掉可能为空的类名
  const buttonClasses = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    disabled && styles.disabled,
    className // 允许外部传入额外的类名
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

// 使用示例（相同的组件可配合不同的CSS Modules文件使用）
/*
import Button from './Button';

// 使用示例
<Button>主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button disabled>禁用按钮</Button>
<Button onClick={() => console.log('点击了')}>点击按钮</Button>
*/
```

### 15.3 CSS-in-JS 使用规范

**CSS-in-JS 是另一种流行的样式方案，具有以下优势：**
1. **组件化**：样式与组件逻辑紧密结合
2. **动态样式**：轻松根据props生成动态样式
3. **主题支持**：内置主题系统
4. **类型安全**：在TypeScript项目中提供更好的类型支持

**使用规范：**
- 推荐使用 Styled Components 或 Emotion 库
- 样式组件命名应使用 PascalCase
- 复杂样式逻辑应提取到辅助函数中
- 避免在样式定义中进行复杂计算
- 使用主题系统管理颜色、间距等变量

**Styled Components 示例：**

```tsx
// Card.styles.ts
import styled, { css } from 'styled-components';

interface CardProps {
  padding?: number;
  margin?: number;
  elevation?: number;
  isActive?: boolean;
}

// 共享的样式辅助函数
const elevation = (level: number) => {
  switch (level) {
    case 1: return '0 2px 4px rgba(0,0,0,0.1)';
    case 2: return '0 4px 8px rgba(0,0,0,0.12)';
    case 3: return '0 8px 16px rgba(0,0,0,0.15)';
    default: return 'none';
  }
};

export const CardContainer = styled.div<CardProps>`
  background-color: white;
  border-radius: 8px;
  padding: ${props => props.padding || 20}px;
  margin: ${props => props.margin || 16}px;
  box-shadow: ${props => elevation(props.elevation || 1)};
  transition: all 0.3s ease;
  
  ${props => props.isActive && css`
    box-shadow: ${elevation(3)};
    border: 1px solid #1890ff;
  `}
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
`;

export const CardContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #666;
`;
```

```tsx
// Card.tsx
import React from 'react';
import { CardContainer, CardTitle, CardContent } from './Card.styles';

interface CardProps {
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
  elevation?: number;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  isActive = false,
  elevation = 1
}) => {
  return (
    <CardContainer isActive={isActive} elevation={elevation}>
      <CardTitle>{title}</CardTitle>
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

export default Card;
```

### 15.4 选择建议

- **选择 CSS Modules 的情况**：
  - 团队更熟悉 CSS 语法
  - 需要更简单的构建配置
  - 项目规模较小
  - 需要更好的浏览器兼容性

- **选择 CSS-in-JS 的情况**：
  - 需要大量动态样式
  - 项目使用 TypeScript 并需要类型安全
  - 需要强大的主题系统
  - 组件库开发

## 16 组件设计与组织
### 16.1 组件拆分与职责单一原则

- 组件应该保持小而专注，每个组件只负责一个特定的功能
- 避免创建包含数千行代码的巨型组件
- 基于功能将大型组件拆分为多个小组件

```tsx
// 推荐的组件结构
function ProcurementSystem() {
  return (
    <div className="procurement-system">
      <Header />
      <ShopSelector />
      <OrderFilterPanel />
      <OrderTable />
      <BatchActions />
      <Modals />
    </div>
  );
}
```

### 15.2 TypeScript 类型定义

- 所有组件的 props 和 state 都应该有明确的 TypeScript 类型定义
- 避免使用 any 类型，提高代码可维护性和类型安全

```tsx
interface OrderItem {
  id: string;
  orderCode: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
  createdAt: string;
}

interface OrderListProps {
  shopId: string;
  onOrderSelect: (orderId: string) => void;
  initialFilter?: OrderFilter;
}

function OrderList({ shopId, onOrderSelect, initialFilter = {} }: OrderListProps) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState<OrderFilter>(initialFilter);
  
  // 组件逻辑
}
```

### 15.3 代码复用与常量管理

- 提取共享配置到常量文件，避免硬编码重复的配置对象
- 集中管理相关常量，提高代码可维护性

```tsx
// 提取共享配置到常量文件
const TAG_CONFIGS = {
  WARNING: { tagClass: 'warning_tag', style: { zIndex: '10000', maxWidth: '680px' } },
  DANGER: { tagClass: 'danger_tag', style: { zIndex: '10000', maxWidth: '680px' } }
};

// 集中管理相关常量
export const ORDER_STATUS = {
  WAITING_SEND: 'waitsellersend',
  WAITING_RECEIVE: 'waitbuyerreceive',
  SUCCESS: 'success',
  CANCEL: 'cancel'
};
```

### 15.4 错误处理和异常捕获

- 所有异步操作都应该有适当的错误处理机制
- 使用 try/catch/finally 捕获异常并提供用户友好的错误信息
- 确保即使在错误情况下 UI 也能正常响应

```tsx
// 推荐做法
async function loadData() {
  try {
    setIsLoading(true);
    const response = await apiRequest();
    setData(response.data);
  } catch (error) {
    console.error('加载数据失败:', error);
    setError('无法加载数据，请稍后重试');
  } finally {
    setIsLoading(false);
  }
}

// 避免做法 - 没有错误处理
// const res = await OrderListV2Request(dto);
```

### 15.5 事件处理器（Class 组件兼容）

> 在必须使用 Class 组件的情况下，使用箭头函数定义事件处理器

```jsx
class MyComponent extends Component {
  // 推荐 - 使用箭头函数
  handleClick = () => {
    // 处理点击事件
  };
  
  render() {
    return <button onClick={this.handleClick}>点击我</button>;
  }
}