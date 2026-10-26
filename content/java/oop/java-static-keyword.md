---title: "Java static 关键字"
date: 2026-09-21T21:49:02+08:00
draft: true
weight: 24
description: "static 的语义:属于类而不是对象、类加载阶段的初始化时机、静态方法不能访问非静态成员、静态代码块只执行一次。"
tags: ["Java", "static", "面向对象"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java-static-keyword/"]
---

## static

- 静态的,**属于类而不是对象**
- 静态成员在类加载阶段分配内存并且赋默认值,在初始化阶段执行显式赋值;静态方法在字节码调用时没有对象引用传递
- **静态方法中不能访问非静态成员**
- 静态变量在类加载时初始化
- 静态代码块按顺序执行,且**只执行一次**
