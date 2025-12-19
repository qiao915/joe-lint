# TypeScript 开发规范

## 1 基础规范

### 1.1 文件扩展名
- **.ts**：使用 `.ts` 作为 TypeScript 文件扩展名
- **.d.ts**：使用 `.d.ts` 作为类型声明文件扩展名
  ```
  // 推荐
  app.ts
  utils.ts
  types.d.ts
  
  // 避免
  app.js
  utils.js
  ```

### 1.2 编码格式
- **UTF-8 编码**：所有 TypeScript 文件必须使用 UTF-8 编码
- **无 BOM**：文件不得包含 BOM (Byte Order Mark)

### 1.3 编译配置
- **tsconfig.json**：项目必须包含 `tsconfig.json` 配置文件
  ```json
  {
    "compilerOptions": {
      "target": "es2016",
      "module": "commonjs",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true
    }
  }
  ```

## 2 命名规范

### 2.1 变量命名
- **驼峰命名法**：变量名使用驼峰命名法
- **let/const**：使用 `let` 或 `const` 声明变量，避免使用 `var`
  ```typescript
  // 推荐
  const userName: string = '张三';
  let itemCount: number = 10;
  
  // 避免
  var UserName: string = '张三';
  let item_count: number = 10;
  ```

### 2.2 常量命名
- **全大写**：全局常量使用全大写，单词之间用下划线分隔
- **const 声明**：使用 `const` 声明常量
  ```typescript
  // 推荐
  const MAX_COUNT: number = 100;
  const API_URL: string = 'https://api.example.com';
  
  // 避免
  const maxCount: number = 100;
  const apiUrl: string = 'https://api.example.com';
  ```

### 2.3 函数命名
- **驼峰命名法**：函数名使用驼峰命名法
- **动词开头**：函数名应使用动词开头
  ```typescript
  // 推荐
  function getUser(id: number): User {
    // 函数体
  }
  
  // 避免
  function UserGet(id: number): User {
    // 函数体
  }
  ```

### 2.4 类与接口命名
- **帕斯卡命名法**：类名和接口名使用帕斯卡命名法
- **接口前缀**：接口名可以使用 `I` 前缀（可选，但需保持一致）
  ```typescript
  // 推荐
  class UserService {
    // 类成员
  }
  
  interface User {
    // 接口成员
  }
  
  // 或
  interface IUser {
    // 接口成员
  }
  
  // 避免
  class userService {
    // 类成员
  }
  
  interface user {
    // 接口成员
  }
  ```

### 2.5 类型别名命名
- **帕斯卡命名法**：类型别名使用帕斯卡命名法
  ```typescript
  // 推荐
  type UserList = User[];
  type ID = string | number;
  
  // 避免
  type userList = User[];
  type id = string | number;
  ```

## 3 语法规则

### 3.1 类型注解
- **显式类型**：为变量、函数参数和返回值提供显式类型注解
- **避免 any**：除非有充分理由，否则避免使用 `any` 类型
  ```typescript
  // 推荐
  const name: string = '张三';
  function getUser(id: number): Promise<User> {
    // 函数体
  }
  
  // 避免
  const name = '张三';
  function getUser(id: any): any {
    // 函数体
  }
  ```

### 3.2 严格模式
- **启用严格模式**：在 tsconfig.json 中启用严格模式
  ```json
  {
    "compilerOptions": {
      "strict": true
    }
  }
  ```

### 3.3 空值处理
- **null vs undefined**：明确区分 `null` 和 `undefined`
- **可选链**：使用可选链操作符 `?.` 处理可能为 null/undefined 的值
- **空值合并**：使用空值合并操作符 `??` 提供默认值
  ```typescript
  // 推荐
  const user: User | null = getUser();
  const userName: string = user?.name ?? '未知用户';
  
  // 避免
  const user: User | undefined = getUser();
  const userName: string = user && user.name || '未知用户';
  ```

## 4 类与接口

### 4.1 类的声明
- **访问修饰符**：显式指定成员的访问修饰符（public, private, protected）
- **构造函数**：使用 `constructor` 声明构造函数
- **属性初始化**：在构造函数中或直接在类中初始化属性
  ```typescript
  // 推荐
  class User {
    private id: number;
    public name: string;
    protected email: string;
    
    constructor(id: number, name: string, email: string) {
      this.id = id;
      this.name = name;
      this.email = email;
    }
    
    public getName(): string {
      return this.name;
    }
  }
  
  // 或
  class User {
    constructor(
      private id: number,
      public name: string,
      protected email: string
    ) {}
    
    public getName(): string {
      return this.name;
    }
  }
  ```

### 4.2 接口的使用
- **定义契约**：使用接口定义对象的形状和契约
- **实现接口**：类可以实现一个或多个接口
- **扩展接口**：接口可以扩展其他接口
  ```typescript
  // 推荐
  interface Person { id: number; name: string; }
  
  interface User extends Person { email: string; }
  
  class Student implements User {
    constructor(
      public id: number,
      public name: string,
      public email: string,
      public studentId: string
    ) {}
  }
  ```

### 4.3 接口与类型别名
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

### 4.4 接口设计原则
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

### 4.5 readonly 关键字使用
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

### 4.6 抽象类
- **抽象方法**：抽象类可以包含抽象方法（没有实现的方法）
- **继承实现**：子类必须实现抽象类中的所有抽象方法
  ```typescript
  // 推荐
  abstract class Animal {
    abstract makeSound(): void;
    
    move(): void {
      console.log('移动');
    }
  }
  
  class Dog extends Animal {
    makeSound(): void {
      console.log('汪汪');
    }
  }
  ```

### 4.7 类的成员规范
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

### 4.8 继承与多态
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

## 5 函数与方法

### 5.1 函数声明
- **类型注解**：为函数参数和返回值提供类型注解
- **可选参数**：使用 `?` 标记可选参数
- **默认参数**：为可选参数提供默认值
  ```typescript
  // 推荐
  function greet(name: string, message?: string): string {
    return `Hello, ${name}! ${message || 'How are you?'}`;
  }
  
  function calculateTotal(price: number, tax: number = 0.13): number {
    return price + price * tax;
  }
  ```

### 5.2 箭头函数
- **简洁语法**：使用箭头函数简化函数定义
- **this 绑定**：箭头函数不会绑定自己的 `this`
  ```typescript
  // 推荐
  const sum = (a: number, b: number): number => a + b;
  
  class Counter {
    private count: number = 0;
    
    start() {
      setInterval(() => {
        this.count++;
        console.log(this.count);
      }, 1000);
    }
  }
  ```

### 5.3 剩余参数
- **剩余参数**：使用 `...` 语法处理可变数量的参数
  ```typescript
  // 推荐
  function sum(...numbers: number[]): number {
    return numbers.reduce((total, num) => total + num, 0);
  }
  
  sum(1, 2, 3, 4, 5); // 返回 15
  ```

## 6 模块与导入

### 6.1 模块系统
- **ES 模块**：使用 ES 模块语法（import/export）
  ```typescript
  // 推荐
  // utils.ts
  export function formatDate(date: Date): string {
    return date.toISOString();
  }
  
  export const PI: number = 3.14159;
  
  // app.ts
  import { formatDate, PI } from './utils';
  ```

### 6.2 命名导入与导出
- **命名导出**：使用命名导出导出多个值
- **默认导出**：使用默认导出导出单个值
  ```typescript
  // 推荐
  // user.ts
  export interface User {
    id: number;
    name: string;
  }
  
  export const getUser: (id: number) => User = (id) => {
    // 实现
  };
  
  // 或默认导出
  export default getUser;
  
  // app.ts
  import { User, getUser } from './user';
  // 或
  import getUser from './user';
  ```

### 6.3 导入别名
- **导入别名**：使用 `as` 关键字为导入的模块或值指定别名
  ```typescript
  // 推荐
  import { getUser as fetchUser } from './user';
  import * as utils from './utils';
  ```

## 7 类型系统

### 7.1 基本类型
- **使用基本类型**：使用 TypeScript 提供的基本类型
  ```typescript
  // 推荐
  const name: string = '张三';
  const age: number = 25;
  const isActive: boolean = true;
  const id: symbol = Symbol('id');
  ```

### 7.2 联合类型
- **联合类型**：使用 `|` 定义联合类型
  ```typescript
  // 推荐
  type ID = string | number;
  const userId: ID = '123';
  const productId: ID = 456;
  ```

### 7.3 交叉类型
- **交叉类型**：使用 `&` 定义交叉类型
  ```typescript
  // 推荐
  interface Person { name: string; }
  interface Employee { id: number; }
  
  type EmployeePerson = Person & Employee;
  const emp: EmployeePerson = { name: '张三', id: 123 };
  ```

### 7.4 泛型
- **泛型函数**：使用泛型创建可重用的函数
- **泛型类**：使用泛型创建可重用的类
- **泛型约束**：使用约束限制泛型的类型范围
  ```typescript
  // 推荐
  function identity<T>(arg: T): T {
    return arg;
  }
  
  class Stack<T> {
    private items: T[] = [];
    
    push(item: T): void {
      this.items.push(item);
    }
    
    pop(): T | undefined {
      return this.items.pop();
    }
  }
  
  interface Lengthwise { length: number; }
  
  function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
  }
  ```

### 7.5 泛型命名与使用
- **类型参数命名**：使用有意义的单字母名称（T, U, V 或更具描述性的名称）
- **泛型约束**：使用 `extends` 限制泛型参数的类型
- **默认类型参数**：为泛型参数提供默认类型

```typescript
// 基本泛型函数
function identity<T>(arg: T): T { return arg; }

// 泛型约束
interface Lengthwise { length: number; }
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

### 7.6 高级泛型技术
- **映射类型**：使用映射类型转换现有类型
- **条件类型**：使用条件类型实现更灵活的类型逻辑
- **模板字面量类型**：TypeScript 4.1+ 支持字符串模板类型

```typescript
// 映射类型
interface Person { name: string; age: number; }

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

### 7.7 实用工具类型
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

### 7.8 条件类型与映射类型结合
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

## 8 代码风格

### 8.1 缩进与空格
- **2 空格缩进**：使用 2 个空格进行缩进
- **运算符空格**：运算符前后必须有空格
- **括号空格**：括号内不要有空格
  ```typescript
  // 推荐
  function add(a: number, b: number): number {
    return a + b;
  }
  
  if (a > b) {
    // 条件体
  }
  
  // 避免
  function add(a:number,b:number):number{
    return a+b;
  }
  
  if ( a > b ) {
    // 条件体
  }
  ```

### 8.2 分号
- **强制分号**：所有语句必须以分号结尾
  ```typescript
  // 推荐
  const name: string = '张三';
  function greet(): void {
    console.log('Hello');
  }
  
  // 避免
  const name: string = '张三'
  function greet(): void {
    console.log('Hello')
  }
  ```

### 8.3 引号
- **单引号**：使用单引号
  ```typescript
  // 推荐
  const name: string = '张三';
  const message: string = `Hello, ${name}!`;
  
  // 避免
  const name: string = "张三";
  ```

### 8.4 注释
- **单行注释**：使用 `//` 进行单行注释
- **多行注释**：使用 `/* */` 进行多行注释
- **文档注释**：使用 `/** */` 进行文档注释
  ```typescript
  // 单行注释
  const count: number = 0;
  
  /*
   * 多行注释
   * 这是第二行
   */
  const name: string = '张三';
  
  /**
   * 计算两个数的和
   * @param a 第一个数
   * @param b 第二个数
   * @returns 两个数的和
   */
  function add(a: number, b: number): number {
    return a + b;
  }
  ```

## 9 类型断言与守卫

### 9.1 类型断言
- **使用 as 关键字**：优先使用 `as` 语法而非尖括号语法
- **避免过度使用**：仅在必要时使用类型断言，不要滥用绕过类型检查
- **双重断言**：避免使用双重断言，除非绝对必要

```typescript
// 类型断言 - DOM 元素
const inputElement = document.getElementById('username') as HTMLInputElement;
inputElement.value = '默认用户名';

// 类型断言 - 未知类型转换
const someValue: unknown = JSON.parse('{ "name": "张三", "age": 30 }');
const user = someValue as { name: string; age: number };
console.log(user.name); // 张三

// 类型断言 - 数组类型
const items: unknown[] = [1, 2, 3];
const numbers = items as number[];
console.log(numbers[0].toFixed(2)); // 1.00

// 避免 - 过度使用类型断言
interface User { name: string; age: number; }
const invalidUser = {} as User; // 避免：空对象被断言为 User 类型
invalidUser.age.toFixed(); // 运行时错误：age 是 undefined

// 避免 - 双重断言
const value: string = (42 as unknown) as string; // 双重断言，应避免
```

### 9.2 类型守卫
- **使用 typeof 守卫**：用于基本类型检查
- **使用 instanceof 守卫**：用于类实例检查
- **使用自定义类型守卫**：对于复杂对象类型检查
- **使用 in 操作符**：检查对象是否具有特定属性

```typescript
// typeof 守卫 - 基本类型检查
function formatValue(value: string | number | boolean) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else if (typeof value === 'number') {
    return value.toFixed(2);
  } else {
    return value ? 'Yes' : 'No';
  }
}

// instanceof 守卫 - 类实例检查
class Animal { name: string; }
class Dog extends Animal { bark() { return 'Woof!'; } }
class Cat extends Animal { meow() { return 'Meow!'; } }

function makeSound(animal: Animal) {
  if (animal instanceof Dog) {
    return animal.bark();
  } else if (animal instanceof Cat) {
    return animal.meow();
  }
  return 'Unknown sound';
}

// in 操作符守卫
interface Book { title: string; author: string; }
interface Movie { title: string; director: string; }

function getCreator(item: Book | Movie) {
  if ('author' in item) {
    return item.author;
  } else {
    return item.director;
  }
}

// 自定义类型守卫 - 复杂对象检查
interface User {
  id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return 'role' in user && user.role === 'admin';
}

function getUserPermissions(user: User | Admin): string[] {
  if (isAdmin(user)) {
    return user.permissions;
  }
  return ['read'];
}

// 自定义类型守卫 - 数组元素检查
interface Product {
  id: string;
  name: string;
  price: number;
}

function isProduct(item: unknown): item is Product {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof (item as Product).id === 'string' &&
    'name' in item &&
    typeof (item as Product).name === 'string' &&
    'price' in item &&
    typeof (item as Product).price === 'number'
  );
}

function processProducts(items: unknown[]) {
  const validProducts = items.filter(isProduct);
  return validProducts.map(product => product.price);
}
```
## 10 特殊语法

### 10.1 枚举（Enums）

#### 10.1.1 枚举使用规范
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

// 字符串枚举（谨慎使用）
enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
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

### 10.2 装饰器
- **装饰器命名**：装饰器名使用驼峰命名法
- **类装饰器**：使用装饰器扩展类的功能
  ```typescript
  // 推荐
  function logClass(target: Function) {
    console.log(`Class ${target.name} has been decorated`);
  }
  
  @logClass
  class User {
    // 类成员
  }
  ```

## 11 React 与 TypeScript 结合

### 11.1 函数组件类型
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

### 11.2 Hooks 类型
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

### 11.3 事件处理
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

## 12 最佳实践

### 12.1 类型安全
- **避免 any**：尽可能避免使用 `any` 类型
- **类型断言**：仅在必要时使用类型断言 `as`
  ```typescript
  // 推荐
  const userElement: HTMLElement | null = document.getElementById('user');
  if (userElement) {
    const userNameElement = userElement.querySelector('.name') as HTMLElement;
    userNameElement.textContent = '张三';
  }
  
  // 避免
  const userElement: any = document.getElementById('user');
  const userNameElement: any = userElement.querySelector('.name');
  userNameElement.textContent = '张三';
  ```

### 12.2 代码组织
- **单一职责**：一个函数或类只负责一个功能
- **模块划分**：将相关功能组织到同一个模块中
  ```typescript
  // 推荐
  // user.ts
  export interface User {}
  export function getUser() {}
  export function createUser() {}
  
  // product.ts
  export interface Product {}
  export function getProduct() {}
  export function createProduct() {}
  ```

### 12.3 错误处理
- **try/catch**：使用 try/catch 处理异常
- **自定义错误**：创建自定义错误类
  ```typescript
  // 推荐
  class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
  }
  
  try {
    throw new CustomError('Something went wrong');
  } catch (error) {
    if (error instanceof CustomError) {
      console.log('Custom error:', error.message);
    } else {
      console.log('Unknown error:', error);
    }
  }
  ```

### 12.4 配置与最佳实践
- **tsconfig.json 推荐配置**：
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

- **常见最佳实践**：
  - **使用 ESLint**：配置 TypeScript 专用的 ESLint 规则
  - **避免 `// @ts-ignore`**：除非绝对必要，否则不使用 `@ts-ignore` 注释
  - **定期清理未使用的导入和变量**：保持代码整洁
  - **使用 TypeScript 项目引用**：对于大型项目，使用项目引用管理多包结构
  - **文档化类型**：为公共 API 添加 JSDoc 注释

## 13 代码示例

### 13.1 接口与类
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

class UserService {
  private users: User[] = [];
  
  public addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1
    };
    this.users.push(newUser);
    return newUser;
  }
  
  public getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  public getAllUsers(): User[] {
    return [...this.users];
  }
}

// 使用
const userService = new UserService();
const user = userService.addUser({
  name: '张三',
  email: 'zhangsan@example.com',
  age: 25
});
const foundUser = userService.getUserById(user.id);
console.log(foundUser); // { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 }
```

### 13.2 泛型与类型约束
```typescript
interface Database {
  save(key: string, value: any): void;
  get(key: string): any;
}

class InMemoryDatabase implements Database {
  private data: Record<string, any> = {};
  
  save(key: string, value: any): void {
    this.data[key] = value;
  }
  
  get(key: string): any {
    return this.data[key];
  }
}

class TypedDatabase<T> {
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
  }
  
  save(key: string, value: T): void {
    this.db.save(key, value);
  }
  
  get(key: string): T | undefined {
    return this.db.get(key);
  }
}

// 使用
const db = new InMemoryDatabase();
const userDb = new TypedDatabase<User>(db);

userDb.save('user1', {
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com'
});

const user = userDb.get('user1');
console.log(user?.name); // 张三
```

## 14 常见错误与避免方法

### 14.1 忽略类型检查
- **错误**：使用 `// @ts-ignore` 忽略类型错误
- **避免**：修复类型错误而不是忽略它们
  ```typescript
  // 错误
  // @ts-ignore
  const user: User = JSON.parse(response);
  
  // 正确
  const user: User = JSON.parse(response) as User;
  ```

### 14.2 过度使用 any
- **错误**：使用 `any` 类型代替具体类型
- **避免**：定义明确的接口或类型别名
  ```typescript
  // 错误
  const users: any[] = getUsers();
  
  // 正确
  const users: User[] = getUsers();
  ```

### 14.3 忽略 null/undefined
- **错误**：假设变量永远不会为 null/undefined
- **避免**：使用可选链、空值合并或类型保护
  ```typescript
  // 错误
  const user: User = getUser();
  console.log(user.name); // 可能抛出 TypeError
  
  // 正确
  const user: User | null = getUser();
  console.log(user?.name ?? '未知用户');
  ```

### 14.4 错误处理与调试
- **自定义错误类型**：扩展 Error 类创建有意义的自定义错误
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
