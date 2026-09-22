---
title: "Java 细节拾遗:数组的声明与初始化"
date: 2026-09-21T20:06:29+08:00
draft: false
weight: 10
description: "数组声明时可以不指定大小、数组长度为 0 与数组为 null 的区别,以及 return 时 new 对象、sc.close() 等容易忽略的细节。"
tags: ["Java", "数组", "基础语法"]
categories: ["语法基础"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、数组

### 1.1 声明与初始化

声明一个数组的时候可以不指定它的大小:

```java
int[] arr;
String[] names;
```

这样,这个阶段名字都只是引用,没有指向任何实际的数组对象,还没有分配内存空间。

创建或者初始化数组的时候,**必须指定大小**——就是当你用 `new` 的时候。

当你直接这样写的时候,可以不用指定大小:

```java
int[] arr = {0, 1, 2, 3, 4, 5};
```

### 1.2 数组长度为 0

```java
int[] arr = {};
// 或者
int[] arr = new int[0];
```

- 它在堆内存里分配了空间,只是这个空间里一个元素都没有存放
- 变量指向一个有效数组实例
- 调用 `arr.length` 返回 `0`

### 1.3 数组为 null

```java
int[] arr = null;
// 或者
int[] arr;
```

- 它没有指向任何堆内存中的对象,无法调用 `arr.length`

### 1.4 两者的区别

| 对比项 | 长度为 0(`{}`) | `null` |
|--------|----------------|--------|
| 堆内存 | 分配了空间,但没有存放元素 | 没有指向任何对象 |
| 是否指向有效实例 | 是 | 否 |
| `arr.length` | 返回 `0` | 调用会抛出 `NullPointerException` |

---

## 二、其他细节

### 2.1 `return new Woman();`

return 的时候还能 new 对象。

假如声明一个方法的返回值类型是 `Person`(`Person` 是个类),那么返回的时候既可以返回一个已有的 `Person` 类对象,也可以是 `Person` 类的子类的对象。至于这个对象的来源:

1. 可以是已有的
2. 可以是在 return 语句里 new 出来的

### 2.2 `sc.close()`

在不用 `sc` 读数据的时候调用,它会将底层的 `System.in` 也关闭。为了代码安全,写项目时要写上。
