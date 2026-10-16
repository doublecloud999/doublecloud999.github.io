---
title: "Java 枚举 enum"
date: 2026-10-15T10:12:00+08:00
draft: false
weight: 34
description: "枚举的本质是 final 类、父类是 java.lang.Enum，构造方法必须是 private，以及 values() / valueOf() 的用法。"
tags: ["Java", "枚举", "enum", "面向对象"]
categories: ["面向对象"]
ShowToc: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、枚举的本质

枚举也是一个**类**。

- 枚举类不能被继承，因为枚举类被 `final` 修饰
- 所有枚举类都继承一个 `java.lang.Enum` 父类

![枚举类定义](/images/java/enum-basics.png)

这是正常的枚举类定义，注意最后一个对象后面写分号。

```java
// 这是四个枚举值，每一个都是 Season 类型的对象，而且是常量，是被 static final 修饰的
// 枚举类型不能被继承，因为它底层被 final 修饰
// 任何一个枚举类型的父类是 java.lang.Enum
// 但是 Enum 的父类是 Object，因此枚举类型也可以调用 Object 中的方法
// 任何一个枚举类型都有 values() 方法读值
// 任何一个枚举类型都有 valueOf() 静态方法，可以将字符串转换成枚举类型的值
// 应用范围：某种东西的值可以直接被列举出来
```

## 二、高级使用

注意枚举的**构造方法**是 **private**，绝对不能用 public 修饰，绝对不允许在外面 new 枚举值。

![枚举的构造方法与高级用法](/images/java/enum-constructor.png)

## 三、怎么查看枚举的字节码

去 IntelliJ 的 Out 里面找字节码文件，复制路径，直接去文件管理器里打开路径，用终端打开文件，执行:

```bash
javap -c 文件名
```
