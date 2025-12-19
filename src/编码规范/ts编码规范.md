# TypeScript 编码规范

## 1 基本类型与声明

### 1.1 避免使用 any 类型
- **类型安全优先**：除非绝对必要，否则应避免使用 `any` 类型
- **合理使用场景**：
  - 处理来自外部API的未知结构数据
  - 与JavaScript代码库集成时的临时方案
- **推荐替代方案**：
  - 使用更具体的联合类型
  - 使用接口或类型别名
  - 使用 `unknown` 类型并进行类型断言

```typescript
// 避免
function processData(data: any) {}

// 推荐
interface UserData { name: string; age: number; }
function processData(data: UserData) {}

// 对于未知结构的数据
function processUnknownData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // 类型守卫后使用
  }
}
```

### 1.2 使用 readonly 关键字
- **不可变数据**：对于不应修改的属性，使用 `readonly` 修饰符
- **类属性**：为类中的常量属性添加 `readonly`
- **接口属性**：在接口中标记不应修改的字段

```typescript
class User {
  public readonly id: string;
  public name: string;
  
  constructor(id: string, name: string) {
    this.id = id; // 只可在构造函数中赋值
    this.name = name;
  }
}

interface Config {
  readonly apiUrl: string;
  timeout: number;
}
```

### 1.3 显式类型标注
- **函数参数与返回值**：始终为函数参数和返回值添加类型
- **类成员**：为类的属性和方法添加类型
- **变量初始化**：即使TypeScript可以推断类型，对于复杂结构也应显式标注

```typescript
// 函数类型标注
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 类成员类型标注
class Calculator {
  private result: number = 0;
  
  add(value: number): this {
    this.result += value;
    return this;
  }
  
  getResult(): number {
    return this.result;
  }
}
```

## 2 接口与类型别名

### 2.1 接口 vs 类型别名
- **接口优先**：对于对象形状的定义，优先使用 `interface`
- **类型别名使用场景**：
  - 联合类型和交叉类型
  - 原始类型的别名
  - 元组类型
  - 映射类型

```typescript
// 接口用于对象形状
interface User {
  id: string;
  name: string;
  email: string;
  // 接口可以被扩展
  optionalProperty?: string;
}

// 类型别名用于联合类型
 type Status = 'pending' | 'approved' | 'rejected';

// 类型别名用于原始类型
 type UserId = string;

// 类型别名用于映射类型
 type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

### 2.2 接口设计原则
- **单一职责**：每个接口应只表示单一概念
- **可扩展性**：使用可选属性 `?` 支持向后兼容
- **命名规范**：使用 PascalCase 命名接口
- **避免空接口**：接口应至少包含一个成员

```typescript
// 好的接口设计
interface UserCredentials {
  username: string;
  password: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string; // 可选属性
}

// 组合接口
interface CompleteUser extends UserProfile {
  createdAt: Date;
  updatedAt: Date;
}
```

## 3 类与继承

### 3.1 类的成员规范
- **访问修饰符**：为所有成员添加访问修饰符（`public`, `private`, `protected`）
- **成员排序**：
  1. 静态属性和方法
  2. 实例属性
  3. 构造函数
  4. 实例方法
- **getter/setter**：使用 getter/setter 进行属性访问控制

```typescript
class BankAccount {
  // 静态属性
  private static accountCounter: number = 0;
  
  // 实例属性
  private readonly accountNumber: string;
  private _balance: number;
  protected ownerName: string;
  
  // 构造函数
  constructor(ownerName: string, initialBalance: number = 0) {
    this.accountNumber = `ACC-${++BankAccount.accountCounter}`;
    this.ownerName = ownerName;
    this._balance = initialBalance;
  }
  
  // Getter/Setter
  get balance(): number {
    return this._balance;
  }
  
  // 实例方法
  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this._balance += amount;
  }
  
  withdraw(amount: number): boolean {
    if (amount <= 0 || amount > this._balance) {
      return false;
    }
    this._balance -= amount;
    return true;
  }
}
```

### 3.2 继承与多态
- **避免深层继承**：尽量限制继承深度，优先使用组合而非继承
- **方法重写**：重写父类方法时使用 `override` 关键字（TypeScript 4.3+）
- **抽象类**：对于只用作基类的类，使用 `abstract` 关键字

```typescript
// 抽象基类
abstract class Vehicle {
  protected brand: string;
  
  constructor(brand: string) {
    this.brand = brand;
  }
  
  abstract getMaxSpeed(): number;
  
  start(): void {
    console.log(`${this.brand} vehicle started`);
  }
}

// 继承并实现抽象方法
class Car extends Vehicle {
  private numDoors: number;
  
  constructor(brand: string, numDoors: number) {
    super(brand);
    this.numDoors = numDoors;
  }
  
  // 使用 override 标记重写
  override getMaxSpeed(): number {
    return 200; // km/h
  }
}
```

## 4 枚举（Enums）

### 4.1 枚举使用规范
- **命名规范**：枚举名称使用 PascalCase，枚举值使用 SNAKE_CASE
- **使用场景**：枚举适用于一组相关的常量值
- **避免字符串枚举**：优先使用数字枚举，或使用 `as const` 断言作为替代

```typescript
// 数字枚举
enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

// 替代字符串枚举的方式
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

type LogLevel = typeof LogLevel[keyof typeof LogLevel];
```

## 5 泛型（Generics）

### 5.1 泛型命名与使用
- **类型参数命名**：使用有意义的单字母名称（T, U, V 或更具描述性的名称）
- **泛型约束**：使用 `extends` 限制泛型参数的类型
- **默认类型参数**：为泛型参数提供默认类型

```typescript
// 基本泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型约束
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 带默认类型的泛型
class ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
  
  constructor(data: T, message: string = 'Success', status: number = 200) {
    this.data = data;
    this.message = message;
    this.status = status;
  }
}
```

### 5.2 高级泛型技术
- **映射类型**：使用映射类型转换现有类型
- **条件类型**：使用条件类型实现更灵活的类型逻辑
- **模板字面量类型**：TypeScript 4.1+ 支持字符串模板类型

```typescript
// 映射类型
interface Person {
  name: string;
  age: number;
}

// 只读版本
type ReadonlyPerson = { readonly [K in keyof Person]: Person[K] };

// 可选版本
type PartialPerson = { [K in keyof Person]?: Person[K] };

// 条件类型
 type NonNullable<T> = T extends null | undefined ? never : T;
 type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

// 模板字面量类型
 type EventName<T extends string> = `on${Capitalize<T>}`;
 type ClickEvent = EventName<'click'>; // 'onClick'
```

## 6 模块与命名空间

### 6.1 模块导入导出
- **使用 ES 模块**：优先使用 `import`/`export` 语法
- **避免使用命名空间**：对于现代 TypeScript 项目，避免使用 `namespace`
- **导入规范**：
  - 从同一模块导入多个内容时，使用解构导入
  - 对于默认导出，使用简洁的导入语法
  - 避免通配符导入

```typescript
// 导出多个内容
export const PI = 3.14159;
export interface Circle { radius: number; }
export function calculateArea(circle: Circle): number {
  return PI * circle.radius * circle.radius;
}

// 导入\import { PI, Circle, calculateArea } from './geometry';

// 默认导出
class Calculator {
  // ...
}

export default Calculator;

// 导入默认导出
import Calculator from './calculator';
```

### 6.2 模块设计原则
- **单一职责**：每个模块应专注于单一功能
- **文件结构**：按功能组织文件，避免过大的文件
- **循环依赖**：避免模块间的循环依赖

## 7 类型断言与守卫

### 7.1 类型断言
- **使用 as 关键字**：优先使用 `as` 语法而非尖括号语法
- **避免过度使用**：仅在必要时使用类型断言，不要滥用绕过类型检查
- **双重断言**：避免使用双重断言，除非绝对必要

```typescript
// 类型断言
const someValue: unknown = 'hello';
const strLength = (someValue as string).length;

// 尖括号语法（不推荐，在JSX中可能冲突）
// const strLength = (<string>someValue).length;
```

### 7.2 类型守卫
- **使用 typeof 守卫**：用于基本类型检查
- **使用 instanceof 守卫**：用于类实例检查
- **使用自定义类型守卫**：对于复杂对象类型检查

```typescript
// typeof 守卫
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // 在此作用域内，value 被推断为 string 类型
    console.log(value.toUpperCase());
  } else {
    // 在此作用域内，value 被推断为 number 类型
    console.log(value.toFixed(2));
  }
}

// 自定义类型守卫
interface Dog {
  bark: () => void;
}

interface Cat {
  meow: () => void;
}

function isDog(animal: Dog | Cat): animal is Dog {
  return 'bark' in animal;
}

function interactWithAnimal(animal: Dog | Cat) {
  if (isDog(animal)) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

## 8 装饰器（Decorators）

### 8.1 装饰器使用规范
- **命名规范**：装饰器名称使用 camelCase
- **适用场景**：
  - 类装饰器：修改类行为或元数据
  - 方法装饰器：修改方法行为
  - 属性装饰器：修改属性行为或添加元数据
- **使用实验性语法**：注意装饰器目前仍是实验性特性（TypeScript 5.0+ 已稳定）

```typescript
// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// 方法装饰器
function enumerable(value: boolean) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

// 属性装饰器
function format(formatString: string) {
  return function(target: any, propertyName: string) {
    // 实现格式化逻辑
  };
}

@sealed
class Greeter {
  @format('Hello, %s!')
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  @enumerable(false)
  greet() {
    return this.greeting;
  }
}
```

## 9 React 与 TypeScript 结合

### 9.1 函数组件类型
- **使用 FC 类型**：使用 `React.FC` 或函数表达式声明函数组件
- **Props 类型**：为组件 props 创建明确的接口或类型别名
- **Children 类型**：正确处理 React children

```typescript
import React, { FC, useState, useEffect } from 'react';

// Props 接口
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// 使用 FC 类型
const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 9.2 Hooks 类型
- **useState 类型**：为状态添加类型注解
- **useEffect 依赖**：确保依赖数组包含所有使用的变量
- **useRef 类型**：为 ref 添加适当的类型
- **自定义 Hook 返回类型**：为自定义 hook 返回值添加类型

```typescript
// useState 类型
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useRef 类型
const inputRef = useRef<HTMLInputElement>(null);
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

// 自定义 Hook 类型
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // 实现逻辑
    return initialValue;
  });
  
  const setValue = (value: T) => {
    // 实现逻辑
    setStoredValue(value);
  };
  
  return [storedValue, setValue];
}
```

### 9.3 事件处理
- **事件类型**：使用正确的 React 事件类型
- **事件处理函数**：为事件处理函数添加正确的参数类型

```typescript
// 事件处理
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Button clicked');
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // 处理表单提交
};
```

## 10 配置与最佳实践

### 10.1 tsconfig.json 推荐配置
- **严格模式**：启用所有严格类型检查选项
- **目标环境**：根据项目需要设置 `target` 和 `lib`
- **模块解析**：配置 `moduleResolution` 和 `baseUrl`

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "target": "ES2015",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### 10.2 常见最佳实践
- **使用 ESLint**：配置 TypeScript 专用的 ESLint 规则
- **避免 `// @ts-ignore`**：除非绝对必要，否则不使用 `@ts-ignore` 注释
- **定期清理未使用的导入和变量**：保持代码整洁
- **使用 TypeScript 项目引用**：对于大型项目，使用项目引用管理多包结构
- **文档化类型**：为公共 API 添加 JSDoc 注释

## 11 高级类型技巧

### 11.1 实用工具类型
- **Partial**：将所有属性设为可选
- **Required**：将所有属性设为必需
- **Readonly**：将所有属性设为只读
- **Record<K, T>**：定义键为 K 类型、值为 T 类型的对象
- **Pick<T, K>**：从 T 中选取属性集 K
- **Omit<T, K>**：从 T 中排除属性集 K
- **Exclude<T, U>**：从 T 中排除可分配给 U 的类型
- **Extract<T, U>**：从 T 中提取可分配给 U 的类型
- **NonNullable<T>**：从 T 中排除 null 和 undefined

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

// 工具类型使用示例
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;
type UserNameAndEmail = Pick<User, 'name' | 'email'>;
type UserWithoutEmail = Omit<User, 'email'>;
```

### 11.2 条件类型与映射类型结合
- **条件类型应用**：使用条件类型实现更复杂的类型转换
- **映射类型进阶**：创建自定义映射类型处理常见模式

```typescript
// 条件映射类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 自定义映射类型 - 转换对象属性类型
type StringifyValues<T> = {
  [P in keyof T]: string;
};

// 示例
interface Config {
  timeout: number;
  retries: number;
  url: string;
}

type StringConfig = StringifyValues<Config>; // { timeout: string; retries: string; url: string; }
```

## 12 错误处理与调试

### 12.1 自定义错误类型
- **扩展 Error 类**：创建有意义的自定义错误类型
- **类型安全的错误处理**：使用类型保护处理不同类型的错误

```typescript
// 自定义错误类型
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// 类型安全的错误处理
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof Error && error.name === 'ValidationError';
}

function processResponse(response: any): void {
  try {
    validateResponse(response);
  } catch (error) {
    if (isValidationError(error)) {
      console.error(`Validation failed for field '${error.field}': ${error.message}`);
    } else if (error instanceof NetworkError) {
      console.error(`Network error (${error.statusCode}): ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

### 12.2 调试技巧
- **使用 `console.log` 与类型断言**：在调试时临时使用类型断言
- **利用类型守卫进行日志记录**：使用类型守卫安全地记录复杂对象
- **使用 TypeScript Language Service API**：对于高级调试需求
