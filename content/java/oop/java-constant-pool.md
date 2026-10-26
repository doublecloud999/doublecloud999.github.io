---title: "Java 常量池"
date: 2026-10-15T10:14:00+08:00
draft: false
weight: 36
description: "字面常量与符号常量、为什么要引入常量池(class 文件常量池与运行时常量池)，以及符号引用到直接引用的解析。"
tags: ["Java", "常量池", "JVM", "类加载"]
categories: ["面向对象"]
ShowToc: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java-constant-pool/"]
---

## 一、常量

### 1.1 字面常量

确定值的本身，比如 `10`、`2L`、`false`、`"hello"`。

### 1.2 符号常量

```java
final int a = 5;
```

使用标识符预先定义的，值在程序中是不可改变的量。

## 二、引入常量池

- **目的:** 避免频繁创建和删除对象，提升系统性能
- **实现对象共享**，这是一种**享元模式**的体现

## 三、常量池的分类

### 3.1 class 文件常量池(也就是静态常量池)

在 class 文件中，是静态的，用来存放编译器生成的各种:

- **字面量**:`10`、`false`、`true`、`"a"`、`"b"`
- **符号引用**:本身也是用字面值来表示的，比如用一组字符串 `"java/lang/System"` 来代表 `"System.out.println"`

只要给定了这玩意，虚拟机在类加载的连接阶段解析时，就能够根据它找到真正的内存地址，也就是根据它找到**直接引用**。

![class 文件常量池](/images/java/constant-pool-classfile.png)

### 3.2 运行时常量池(动态常量池)
