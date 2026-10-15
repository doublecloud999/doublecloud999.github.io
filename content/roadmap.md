---
title: "学习路线"
date: 2026-10-15T10:00:00+08:00
draft: false
description: "Java 后端 + Agent 方向的完整学习路线，按知识体系把全部笔记串成一条线。"
hideMeta: true
ShowToc: true
ShowBreadCrumbs: true
ShowPostNavLinks: false
---

> 本页是全站笔记的总入口，按**学习主线**排列，不按发布时间。建议从第一篇开始顺着读，也可以用左侧目录直接跳到某一节。

## 一、Java 基础

> 数组、编码、类加载等入门阶段最容易忽略、但面试常问的细节。

- [细节拾遗:数组的声明与初始化](/posts/java-array-details/) — 声明不指定大小、长度为 0 与 null 的区别
- [数组工具类 Arrays 与 for-each](/posts/java-arrays-foreach/) — `Arrays.toString/equals`、数组扩容、增强 for 的三个坑
- [细节拾遗:编码、快捷键与其他](/posts/java-misc-details/) — `return` 里 new 对象、`sc.close()`、IDEA 快捷键、编码与字节数、`.length` 与 `.length()`

## 二、面向对象

> 整个 Java SE 的主干，也是面试问得最密的一块。

### 2.1 类与对象

- [类与对象基础:this、包、访问权限与封装](/posts/java-class-object-basics/) — `this`、`import`/`package`、四种访问修饰符、封装三原则
- [内部类:静态嵌套类与非静态内部类](/posts/java-inner-class/) — 两者的创建方式与常见错误写法

### 2.2 方法

- [方法重载与重写](/posts/java-overload-override/) — 重载三条件、重写硬性规则、`@Override`

### 2.3 继承与多态

- [继承与 super](/posts/java-inheritance-super/) — 字段隐藏、`super` 访问父类成员、向上转型
- [static 关键字](/posts/java-static-keyword/) — 类加载阶段的赋值、静态代码块
- [多态](/posts/java-polymorphism/) — 编译时多态与运行时多态、三个成立条件
- [抽象类与接口](/posts/java-abstract-interface/) — `abstract`、`interface`、default 方法冲突
- [final、finally 与 finalize](/posts/java-final-finally-finalize/) — 三个容易混的概念，以及 finally 的返回值覆盖

### 2.4 常用类

- [字符串三兄弟:String、StringBuilder 与 StringBuffer](/posts/java-string-builder-buffer/) — 不可变性、扩容机制、线程安全取舍
- [包装类型与自动装箱拆箱](/posts/java-wrapper-classes/) — 缓存范围、空指针、性能开销
- [Object 类与 equals 重写](/posts/java-object-equals/) — `Object` vs `Objects`、哪些类重写了 `equals`
- [clone:浅拷贝与深拷贝](/posts/java-clone/) — 标记型接口、深拷贝必须层层取值

### 2.5 异常

- [异常处理](/posts/java-exception-handling/) — `Throwable` 体系、受检与非受检、`throw`/`throws`/`try-catch-finally`

### 2.6 枚举、泛型与反射

- [枚举 enum](/posts/java-enum/) — 枚举是 final 类、构造方法必须 private、`values()`/`valueOf()`
- [泛型](/posts/java-generics/) — 泛型类/接口/方法、类型擦除、桥方法、通配符
- [反射 Reflection](/posts/java-reflection/) — 运行时探知并操作类与对象

### 2.7 JVM 相关

- [常量池](/posts/java-constant-pool/) — 字面常量与符号常量、class 文件常量池与运行时常量池
- [类加载器与类加载过程](/posts/java-classloader/) — 三类加载器、双亲委派、加载-链接-初始化
- [细节拾遗:super、静态绑定与字符串常量池](/posts/java-super-string-pool-notes/) — 局部变量表第 0 槽、Integer 缓存、访问权限边界

## 三、集合框架

- [集合框架与 List](/posts/java-collections-list/) — Collection / List / Set / Map、ArrayList 与 LinkedList、迭代器、并发修改异常

## 四、IO 与文件

- [IO 与文件流](/posts/java-io-file-stream/) — 流的分类、字节流/字符流、节点流/过滤流、缓冲流/对象流
- [序列化](/posts/java-serialization/) — 序列化与反序列化、四类使用场景、所处协议层次

## 五、并发多线程

- [多线程入门](/posts/java-thread-intro/) — 进程与线程、四种创建方式、生命周期与锁池、JVM 内存结构

## 六、数据库

- [MySQL:会话](/posts/mysql-session/) — 连接请求与会话（持续补充）

---

## 早期整篇笔记

- [Java 基础笔记](/posts/java笔记/) — 早期整篇的 Java 综合笔记
- [算法笔记 01:数组](/posts/算法篇1/) — 早期算法笔记
