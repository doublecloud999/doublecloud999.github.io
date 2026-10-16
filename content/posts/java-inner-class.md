---
title: "Java 内部类:静态嵌套类与非静态内部类"
date: 2026-09-21T21:49:02+08:00
draft: false
weight: 20
description: "静态嵌套类与非静态内部类的区别、各自的创建方式与常见错误写法,以及匿名内部类的概念。"
tags: ["Java", "内部类", "面向对象"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、静态嵌套类 vs 非静态内部类

### 1.1 概念图

![静态嵌套类与非静态内部类](/images/java/inner-class-concept.png)

- **最外层**:外部类
- **带 `static`**:静态嵌套类(静态内部类)
- **不带 `static`**:非静态内部类(成员内部类)

### 1.2 静态嵌套类(static)

**要点**

1. 创建静态内部类对象前,**不需要**先创建外部类对象
2. 创建方式通常可直接写为:

![静态内部类的创建方式](/images/java/inner-class-static.png)

### 1.3 非静态内部类(非 static)

**要点**

1. **必须先创建外部类对象**,才能创建非静态内部类对象
2. 不能写成下图最后一行那样的形式:

![错误写法](/images/java/inner-class-nonstatic-wrong.png)

**正确写法**

必须通过「外部类对象」来 new:

```java
外部对象名.new 内部类名(...)
```

例如:

![正确写法示例](/images/java/inner-class-nonstatic-right.png)

---

## 二、内部类

### 2.1 匿名内部类

没有名字的内部类。
