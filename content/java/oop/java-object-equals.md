---title: "Java Object 类与 equals 重写"
date: 2026-10-15T10:10:00+08:00
draft: false
weight: 32
description: "java.lang.Object 的常用方法、Object 与 Objects 的区别，以及哪些类重写了 equals、哪些没重写，怎么判断。"
tags: ["Java", "Object", "Objects", "equals", "面向对象"]
categories: ["面向对象"]
ShowToc: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java-object-equals/"]
---

## 一、Object 类

`java.lang.Object` 是所有类的超类，所有类都实现了这个类中的方法。

| 方法 | 作用 |
|---|---|
| `toString()` | 将 Java 对象转换成字符串 |
| `hashCode()` | 返回对象的哈希值。默认实现是根据对象的内存地址生成一个哈希码(即将对象的内存地址转换为整数作为哈希值) |
| `equals()` | 判断两个对象是否相等 |
| `getClass()` | 获取对象的运行时类 |
| `wait()` / `notify()` | 线程通信 |
| `finalize` | 已被淘汰。对象被回收时由 GC 自动调用，通常在该方法中完成销毁前的准备 |

## 二、Object 和 Objects 的区别

### 2.1 java.lang.Object

- Object 是所有类的根父类，默认继承
- 不能被 `final` 修饰，因为大家都要继承它

### 2.2 java.util.Objects

- 它是 Java 7 引入的一个**工具类**(Utility Class)
- 它被 `final` 修饰(不能被继承)，且**没有公开的构造方法**(不能 `new` 它)
- 里面的所有方法都是 `static` 静态方法，直接用 `Objects.方法名()` 调用
- 提供了一组静态工具方法，用来操作 `Object`，核心卖点是**空指针安全(Null-Safe)**和便捷性

## 三、equals 方法的重写

当你自己定义一个类的时候，如果你要用 `equals()` 方法，那你要自己重写，因为老祖宗 Object 类里的 `equals` 方法是用 `==` 判断的，没啥用。

### 3.1 代表「值」的类(基本都重写了 equals)

- 8 种基本类型的包装类:`Integer`、`Long`、`Short`、`Byte`、`Double`、`Float`、`Boolean`、`Character`
- 字符串类:`String`
- 大数类:`BigInteger`、`BigDecimal`
- 日期时间类:`java.util.Date`、`java.time.LocalDate` 等
- 集合类(`Collection`):`ArrayList`、`LinkedList`、`HashSet`、`HashMap` 等
  - 集合类的 `equals` 逻辑比较特殊。比如 `List` 的 `equals` 比较的是「两个列表里的元素是否顺序一致且内容相同」；`Set` 的 `equals` 比较的是「两个集合里的元素是否完全一样(不要求顺序)」

### 3.2 代表「对象 / 行为 / 资源」的类(通常不重写)

这些类代表的是具有独立身份、状态或行为的东西。每次创建都应该是一个全新的个体，默认的 `==`(比较内存地址)恰恰是合理的逻辑。

1. `Object` 类本身:默认实现
2. `Thread` 类:两个 `new Thread()` 即使执行相同的代码，它们也是两个独立的线程，不应该相等
3. **`StringBuilder` 和 `StringBuffer`(大坑!)**
   - 它们**没有重写 `equals`**
   - `new StringBuilder("a").equals(new StringBuilder("a"))` 结果是 `false`
   - 因为它们是为了拼接字符串而设计的可变的容器，每次拼接都会改变自身状态，用 `equals` 比较内容没有意义
4. 自定义的普通类:如果你自己写了一个 `User` 类，不重写，就默认用 `Object` 的 `==` 逻辑
5. **数组(Array)**:数组是 JVM 直接生成的类，**没有重写 `equals`**。`int[] a = {1,2}; int[] b = {1,2}; a.equals(b)` 是 `false`。如果要比较数组内容，必须用 `Arrays.equals(a, b)`

### 3.3 如何判断一个官方类有没有重写？

![检查一个类是否重写了 equals](/images/java/equals-check-override.png)

思路是去源码里看这个类有没有自己写 `equals(Object)` 方法；如果没写，那就继承自 `java.lang.Object` 的默认实现，也就是比较内存地址。
