# React 开发规范

## 1 概述

React 开发规范涵盖 JSX 和 TSX 的编写标准，旨在确保 React 代码的一致性、可维护性和性能优化。

## 2 基础规范

### 2.1 文件扩展名
- **JSX**：使用 `.jsx` 扩展名
- **TSX**：使用 `.tsx` 扩展名
- 组件文件名与组件名保持一致，使用帕斯卡命名法

```
// 推荐
App.jsx
UserProfile.tsx
Button.tsx

// 避免
App.js
userProfile.tsx
btn.jsx
```

### 2.2 编码格式
- 使用 UTF-8 编码
- 缩进使用 2 个空格
- 行末不保留空格
- 文件末尾添加换行符

## 3 组件规范

### 3.1 组件命名
- 组件名使用帕斯卡命名法（PascalCase）
- 命名应具有语义，反映组件功能

```jsx
// 推荐
const UserProfile = () => {
  return <div>用户资料</div>
}

// 避免
const userProfile = () => {
  return <div>用户资料</div>
}
```

### 3.2 组件结构
- 一个文件只包含一个组件
- 组件结构清晰，逻辑分离
- 使用函数组件优先于类组件
- 类组件必须有displayName属性（便于调试）
- 禁止在函数组件中使用this
- 禁止在类组件中使用未使用的方法和state

```jsx
// 推荐
// UserProfile.jsx
const UserProfile = ({ user }) => {
  // 组件逻辑
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>年龄：{user.age}</p>
    </div>
  )
}

// 类组件
class UserProfile extends React.Component {
  static displayName = 'UserProfile'; // 推荐设置displayName
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: null
    };
  }
  
  componentDidMount() {
    this.fetchUser();
  }
  
  fetchUser = async () => {
    // 获取用户数据
    this.setState({ isLoading: false });
  }
  
  render() {
    if (this.state.isLoading) return <div>加载中...</div>;
    
    return (
      <div className="user-profile">
        <h2>{this.state.user?.name}</h2>
      </div>
    );
  }
}

export default UserProfile

// 避免
// UserComponents.jsx
const UserProfile = () => {
  console.log(this); // 避免在函数组件中使用this
  return <div>用户资料</div>
}

class UserPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      unusedState: '永远不会使用' // 避免未使用的state
    };
  }
  
  unusedMethod() {
    // 避免未使用的方法
  }
  
  render() {
    return <div>用户文章</div>
  }
}

export { UserProfile, UserPosts } // 避免一个文件多个组件
```

### 3.3 组件类型
- **JSX**：使用函数式组件和 Hooks
- **TSX**：为组件属性定义明确的类型接口

```jsx
// JSX
const Button = ({ type = 'primary', onClick, children }) => {
  return (
    <button className={`button button--${type}`} onClick={onClick}>
      {children}
    </button>
  )
}

// TSX
interface ButtonProps {
  type?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ 
  type = 'primary', 
  onClick, 
  children 
}: ButtonProps) => {
  return (
    <button className={`button button--${type}`} onClick={onClick}>
      {children}
    </button>
  )
}
```

## 4 JSX 语法规则

### 4.1 标签闭合
- 所有标签必须正确闭合，自闭合标签使用自闭合语法

```jsx
// 推荐
<div>内容</div>
<input type="text" />
<UserProfile />

// 避免
<div>内容
<input type="text">
<UserProfile>
```

### 4.2 根元素
- JSX 必须有且只有一个根元素
- 使用 Fragment（<>）避免不必要的 div 包装

```jsx
// 推荐
const UserProfile = () => {
  return (
    <>
      <h2>用户资料</h2>
      <p>内容</p>
    </>
  );
};

// 避免
const UserProfile = () => {
  return (
    <div>
      <h2>用户资料</h2>
      <p>内容</p>
    </div>
  );
};
```

### 4.3 表达式嵌入
- 使用大括号 {} 嵌入 JavaScript 表达式
- 避免在 JSX 中执行复杂计算
- 禁止在 JSX 中使用未定义的变量
- 禁止在 JSX 中使用未被渲染的表达式

```jsx
// 推荐
const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>年龄：{user.age}</p>
      {user.isAdult && <p>成年人</p>}
    </div>
  );
};

// 避免
const UserProfile = ({ user }) => {
  // 避免复杂计算
  const fullName = `${user.firstName} ${user.lastName}`;
  
  return (
    <div>
      <h2>{fullName}</h2>
      <p>{undefinedVariable}</p> {/* 避免未定义变量 */}
      {user.name;} {/* 避免未被渲染的表达式 */}
    </div>
  );
};
```

### 4.4 条件渲染
- 条件渲染组件时使用逻辑运算符而不是 if 语句
- 避免在 JSX 中使用注释文本节点

```jsx
// 推荐
const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      {user.isAdult && <p>成年人</p>} {/* 逻辑与运算符 */}
      {user.role === 'admin' ? <AdminPanel /> : <UserPanel />} {/* 三元运算符 */}
    </div>
  );
};

// 避免
const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      {/* 避免注释文本节点 */}
      {if (user.isAdult) { return <p>成年人</p>; }} {/* 避免if语句 */}
    </div>
  );
};
```

### 4.5 iframe 要求
- iframe 元素必须包含 title 属性
- iframe 元素必须包含 sandbox 属性

```jsx
// 推荐
<iframe 
  title="地图" 
  src="https://maps.google.com" 
  sandbox="allow-scripts allow-same-origin"
/>

// 避免
<iframe src="https://maps.google.com" /> {/* 缺少title和sandbox */}
```

### 4.6 注释风格
- 行内注释使用块注释风格
- 避免在 JSX 中使用单行注释

```jsx
// 推荐
<div>
  {/* 用户信息区域 */}
  <h2>{user.name}</h2>
</div>

// 避免
<div>
  // 用户信息区域
  <h2>{user.name}</h2>
</div>
```

### 4.7 JSX 嵌套深度
- 限制 JSX 嵌套深度，建议不超过 8 层
- 复杂组件考虑拆分为多个子组件

```jsx
// 推荐 - 拆分组件
const UserProfile = ({ user }) => {
  return (
    <div>
      <UserHeader user={user} />
      <UserInfo user={user} />
      <UserActions user={user} />
    </div>
  );
};

const UserHeader = ({ user }) => {
  return <h2>{user.name}</h2>;
};

// 避免 - 嵌套过深
const UserProfile = ({ user }) => {
  return (
    <div>
      <div>
        <h2>{user.name}</h2>
        <div>
          <p>{user.email}</p>
          <div>
            <div>
              <p>{user.address.city}</p>
              <div>
                <p>{user.address.street}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 4.8 JSX 文件扩展名
- JSX 文件扩展名必须为 .jsx 或 .tsx
- 不允许在 .js 文件中使用 JSX 语法

### 4.9 上下文值
- 禁止在 JSX 中使用构造的上下文值
- 上下文值应为静态值或来自父组件的 props

```jsx
// 推荐
const App = () => {
  const [user, setUser] = useState({ name: '张三' });
  
  return (
    <UserContext.Provider value={user}>
      <UserProfile />
    </UserContext.Provider>
  );
};

// 避免
const App = () => {
  return (
    <UserContext.Provider value={{ name: '张三' }}> {/* 避免构造新对象 */}
      <UserProfile />
    </UserContext.Provider>
  );
};
```

### 4.10 片段使用
- 禁止在 JSX 中使用无意义的片段
- 当片段是唯一元素时，考虑直接返回子元素

```jsx
// 推荐
const UserList = ({ users }) => {
  return (
    <>
      {users.map(user => (
        <UserProfile key={user.id} user={user} />
      ))}
    </>
  );
};

// 避免
const UserProfile = ({ user }) => {
  return (
    <>
      <h2>{user.name}</h2>
    </>
  );
};
```

## 5 属性规范

### 5.1 属性命名
- 使用驼峰命名法
- 使用 className 替代 class
- 使用 htmlFor 替代 for

```jsx
// 推荐
<label htmlFor="username">用户名</label>
<input id="username" className="input-field" />
<div dataValue="123">内容</div>

// 避免
<label for="username">用户名</label>
<input id="username" class="input-field" />
<div data-value="123">内容</div>
```

### 5.2 属性值
- 属性值使用双引号
- 布尔属性使用简写形式
- 避免重复属性

```jsx
// 推荐
<div className="container" id="main">内容</div>
<input type="checkbox" checked />
<button disabled>禁用按钮</button>

// 避免
<div className='container' className='main'>内容</div>
<input type="checkbox" checked={true} />
<button disabled={true}>禁用按钮</button>
```

### 5.3 属性数量
- 单行最多 5 个属性
- 多行时每行 1 个属性
- 属性等号周围不允许有空格

```jsx
// 推荐
<UserProfile 
  id="1" 
  name="张三" 
  age="25" 
  gender="male" 
  role="admin"
  email="zhangsan@example.com"
/>

// 避免
<UserProfile id="1" name="张三" age="25" gender="male" role="admin" email="zhangsan@example.com" />
<UserProfile id = "1" name = "张三">内容</UserProfile>
```

## 6 列表渲染

### 6.1 Key 属性
- 列表渲染时必须提供 key 属性
- 使用唯一且稳定的值作为 key

```jsx
// 推荐
const UserList = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// 避免
const UserList = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={Math.random()}>{user.name}</li>
      ))}
    </ul>
  );
};
```

## 7 事件处理

### 7.1 事件命名
- 事件处理函数使用 handle 前缀
- 事件属性使用 on 前缀

```jsx
// 推荐
const UserProfile = () => {
  const handleClick = () => {
    console.log('点击事件');
  };
  
  return (
    <button onClick={handleClick}>
      点击
    </button>
  );
};

// 避免
const UserProfile = () => {
  const click = () => {
    console.log('点击事件');
  };
  
  return (
    <button onClick={click}>
      点击
    </button>
  );
};
```

### 7.2 事件绑定
- 避免在 JSX 中使用箭头函数或 bind 绑定事件
- 优先使用函数组件和 Hooks

```jsx
// 推荐 - 函数组件
const UserProfile = () => {
  const handleClick = () => {
    console.log('点击事件');
  };
  
  return (
    <button onClick={handleClick}>
      点击
    </button>
  );
};

// 推荐 - 类组件
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    console.log('点击事件');
  }
  
  render() {
    return (
      <button onClick={this.handleClick}>
        点击
      </button>
    );
  }
}

// 避免
class UserProfile extends React.Component {
  handleClick() {
    console.log('点击事件');
  }
  
  render() {
    return (
      <button onClick={() => this.handleClick()}>
        点击
      </button>
    );
  }
}
```

## 8 样式规范

### 8.1 行内样式
- 行内样式必须是对象
- 样式属性使用驼峰命名法

```jsx
// 推荐
const UserProfile = () => {
  return (
    <div style={{ color: 'red', fontSize: '16px' }}>
      用户资料
    </div>
  );
};

// 避免
const UserProfile = () => {
  return (
    <div style="color: red; font-size: 16px;">
      用户资料
    </div>
  );
};
```

### 8.2 CSS 类名
- 使用 className 替代 class
- 推荐使用 BEM 命名规范

```jsx
// 推荐
const UserProfile = () => {
  return (
    <div className="user-profile">
      <h2 className="user-profile__name">用户名</h2>
      <div className="user-profile__actions">
        <button className="user-profile__btn user-profile__btn--primary">编辑</button>
      </div>
    </div>
  );
};
```

## 9 Hooks 规范

### 9.1 Hooks 规则
- 只在函数组件的顶层调用 Hooks
- 不要在条件、循环或嵌套函数中调用 Hooks
- 只在 React 函数组件或自定义 Hook 中调用 Hooks
- 强制遵守 React Hooks 规则

```jsx
// 推荐
const UserProfile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  
  useEffect(() => {
    console.log('组件挂载');
  }, []);
  
  return <div>用户资料</div>;
};

// 避免
const UserProfile = () => {
  if (true) {
    const [name, setName] = useState(''); // 错误：在条件语句中使用 Hooks
  }
  
  return <div>用户资料</div>;
};

// 避免 - 在普通函数中使用 Hooks
function fetchData() {
  const [data, setData] = useState(null); // 错误：在普通函数中使用 Hooks
}
```

### 9.2 useState 使用
- useState 必须包含初始值
- 使用函数式更新处理依赖于当前状态的更新
- 避免在 useState 中使用复杂对象的内联初始化

```jsx
// 推荐
const Counter = () => {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: '', age: 0 }); // 初始值可以是空对象
  
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={handleIncrement}>增加</button>
    </div>
  );
};

// 避免
const Counter = () => {
  const [count, setCount] = useState(); // 错误：缺少初始值
  
  const handleIncrement = () => {
    setCount(count + 1); // 潜在问题：依赖闭包
  };
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={handleIncrement}>增加</button>
    </div>
  );
};
```

### 9.3 useEffect 使用
- 为 useEffect 添加依赖项数组
- 清理副作用
- 拆分多个不相关的副作用

```jsx
// 推荐
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('获取用户失败:', error);
      }
    };
    
    fetchUser();
    
    // 清理函数
    return () => {
      // 清理资源
    };
  }, [userId]); // 依赖项数组
  
  return user ? <div>{user.name}</div> : <div>加载中...</div>;
};

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

### 9.4 useMemo 和 useCallback

#### 9.4.1 useMemo 详细使用规范

- **使用场景**：
  - 昂贵的计算操作（如数组排序、过滤、映射等）
  - 依赖项变化时才需要重新计算的值
  - 作为子组件的稳定prop，避免子组件不必要的重渲染

- **使用规范**：
  - 明确声明依赖数组中的所有外部变量
  - 避免在 useMemo 中执行有副作用的操作
  - 不要过度优化简单计算，权衡性能提升与内存开销

```jsx
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

#### 9.4.2 useCallback 详细使用规范

- **使用场景**：
  - 函数作为prop传递给子组件，特别是使用了 React.memo 的子组件
  - 函数被用作 useEffect 的依赖项
  - 事件处理函数需要保持引用稳定

- **使用规范**：
  - 确保依赖数组包含所有在回调函数中使用的外部变量
  - 结合 React.memo 使用效果更佳
  - 避免对简单内联函数进行不必要的缓存

```jsx
// 推荐：缓存传递给 memo 组件的回调函数
const MemoizedChild = React.memo(function Child({ onUpdate }) {
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
```

### 9.5 useContext

- **使用场景**：
  - 全局状态管理（简单场景）
  - 跨组件传递数据，避免 props drilling
  - 主题配置、用户认证状态等全局信息

- **使用规范**：
  - 为 Context 提供默认值
  - 使用 Provider 包装需要访问上下文的组件树
  - 考虑使用 useReducer + useContext 组合管理复杂上下文状态
  - 避免在 Context 中存储频繁变化的值

```jsx
// 创建 Context
const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// 创建 Provider 组件
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
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
  const context = React.useContext(ThemeContext);
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

### 9.6 useRef

- **使用场景**：
  - 获取 DOM 元素引用
  - 存储不需要触发重新渲染的可变值
  - 保存定时器 ID、WebSocket 连接等
  - 解决闭包问题

- **使用规范**：
  - 避免过度使用 ref 操作 DOM
  - 对于复杂 DOM 操作，考虑使用专门的库

```jsx
function UseRefExamples() {
  // 1. DOM 引用
  const inputRef = useRef(null);
  
  // 2. 存储可变值
  const counterRef = useRef(0);
  
  // 3. 存储定时器 ID
  const timerRef = useRef(null);
  
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
      </div>
    </div>
  );
}
```

### 9.7 自定义 Hooks
- 自定义 Hook 必须以 use 开头
- 使用驼峰命名法

```jsx
// 推荐
function useUser(userId) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('获取用户失败:', error);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  return user;
}

// 使用
const UserProfile = ({ userId }) => {
  const user = useUser(userId);
  
  return user ? <div>{user.name}</div> : <div>加载中...</div>;
};
```

## 10 TypeScript 规范（TSX）

### 10.1 类型注解
- 为变量、函数参数和返回值提供显式类型注解
- 避免使用 any 类型

```tsx
// 推荐
const name: string = '张三';
function getUser(id: number): Promise<User> {
  // 函数体
}

// 避免
const name = '张三';
function getUser(id: any) {
  // 函数体
}
```

### 10.2 接口定义
- 接口名使用帕斯卡命名法
- 为只读属性添加 readonly 修饰符

```tsx
// 推荐
interface User {
  readonly id: number;
  name: string;
  email: string;
  age?: number;
}

// 避免
interface user {
  id: number;
  name: string;
  email: string;
  age?: number;
}
```

### 10.3 组件属性类型
- 使用接口定义组件属性类型
- 为可选属性添加 ? 标记

```tsx
// 推荐
interface UserProfileProps {
  id: number;
  name: string;
  age: number;
  gender?: 'male' | 'female';
  onEdit?: () => void;
}

const UserProfile = ({ id, name, age, gender, onEdit }: UserProfileProps) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>年龄：{age}</p>
      {gender && <p>性别：{gender}</p>}
      {onEdit && <button onClick={onEdit}>编辑</button>}
    </div>
  );
};
```

### 10.4 泛型使用
- 使用泛型创建可复用组件

```tsx
// 推荐
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// 使用
<List<User>
  items={users}
  renderItem={(user) => <div>{user.name}</div>}
/>
```

## 11 代码风格

### 11.1 缩进与空格
- 使用 2 个空格进行缩进
- 运算符前后必须有空格
- 花括号内不允许有不必要的空格

```jsx
// 推荐
const UserProfile = () => {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    setCount(count + 1);
  };
  
  return <div>{count}</div>;
};

// 避免
const UserProfile = () => {
    const [count, setCount] = useState(0);
  
    const handleIncrement = () => {
        setCount(count+1);
    };
  
  return <div>{ count }</div>;
};
```

### 11.2 括号
- 多行 JSX 使用小括号包裹
- 花括号与选择器在同一行

```jsx
// 推荐
const UserProfile = () => {
  return (
    <div>
      <h2>用户资料</h2>
      <p>内容</p>
    </div>
  );
};

// 避免
const UserProfile = () => {
  return <div>
    <h2>用户资料</h2>
    <p>内容</p>
  </div>;
};
```

### 11.3 引号
- JavaScript/TypeScript 字符串使用单引号
- JSX 属性值使用双引号

```jsx
// 推荐
const name = '张三';
const UserProfile = () => {
  return <div className="user-profile">{name}</div>;
};

// 避免
const name = "张三";
const UserProfile = () => {
  return <div className='user-profile'>{name}</div>;
};
```

### 11.4 分号
- 语句结束必须使用分号

```jsx
// 推荐
const UserProfile = () => {
  const name = '张三';
  return <div>{name}</div>;
};

// 避免
const UserProfile = () => {
  const name = '张三'
  return <div>{name}</div>
}
```

## 12 最佳实践

### 12.1 性能优化
- 使用 React.memo 优化函数组件性能
- 使用 useMemo 缓存计算结果
- 使用 useCallback 缓存函数引用
- 避免不必要的重渲染

```jsx
// 推荐
const MemoizedComponent = React.memo(function ExpensiveComponent({ data }) {
  // 组件体
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const expensiveData = useMemo(() => calculateExpensiveData(), []);
  const handleClick = useCallback(() => {
    // 处理点击
  }, []);
  
  return (
    <div>
      <MemoizedComponent data={expensiveData} />
      <button onClick={handleClick}>点击</button>
    </div>
  );
}
```

### 12.2 错误处理
- 使用错误边界处理组件渲染错误
- 为异步操作添加错误处理

```jsx
// 推荐
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}, {
  hasError: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 12.3 条件渲染
- 使用逻辑与 (&&) 或三元表达式进行条件渲染
- 使用早期返回简化逻辑

```jsx
// 推荐
const UserProfile = ({ user }) => {
  if (!user) return <div>用户不存在</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      {user.isAdult && <p>成年人</p>}
      {user.isMember ? <p>会员</p> : <p>非会员</p>}
    </div>
  );
};

// 避免
const UserProfile = ({ user }) => {
  let content;
  if (user) {
    content = (
      <div>
        <h2>{user.name}</h2>
        {user.isAdult ? <p>成年人</p> : null}
        <p>{user.isMember ? '会员' : '非会员'}</p>
      </div>
    );
  } else {
    content = <div>用户不存在</div>;
  }
  
  return content;
};
```

## 13 常见错误与避免方法

### 13.1 未定义的变量
- **错误**：使用未定义的变量

```jsx
// 错误
const UserProfile = () => {
  return <div>{name}</div>; // name 未定义
};

// 正确
const UserProfile = () => {
  const name = '张三';
  return <div>{name}</div>;
};
```

### 13.2 直接修改状态
- **错误**：直接修改 React 状态

```jsx
// 错误
const UserProfile = () => {
  const [user, setUser] = useState({ name: '张三', age: 25 });
  
  const handleUpdate = () => {
    user.age = 26; // 错误：直接修改状态
  };
  
  return <div>{user.name}</div>;
};

// 正确
const UserProfile = () => {
  const [user, setUser] = useState({ name: '张三', age: 25 });
  
  const handleUpdate = () => {
    setUser(prevUser => ({ ...prevUser, age: 26 })); // 正确：使用状态更新函数
  };
  
  return <div>{user.name}</div>;
};
```

### 13.3 忽略类型安全（TSX）
- **错误**：使用 any 类型或忽略类型检查

```tsx
// 错误
const data: any = JSON.parse(response);
console.log(data.someProperty); // 潜在错误：someProperty 可能不存在

// 正确
interface Data {
  someProperty: string;
}

const data: Data = JSON.parse(response) as Data;
console.log(data.someProperty);
```

### 13.4 组件嵌套过深
- **错误**：组件嵌套过深

```jsx
// 错误
const App = () => {
  return (
    <div>
      <div>
        <div>
          <div>
            <p>内容</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 正确
const Content = () => {
  return <p>内容</p>;
};

const Container = () => {
  return <div><Content /></div>;
};

const App = () => {
  return <div><Container /></div>;
};