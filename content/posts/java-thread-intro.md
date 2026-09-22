---
title: "Java 多线程入门"
date: 2026-09-21T20:05:07+08:00
draft: false
weight: 80
description: "进程与线程的区别、JDK / JRE / JVM 的包含关系、HotSpot 虚拟机与 JIT 即时编译,以及线程的创建方式。"
tags: ["Java", "多线程", "并发", "JVM"]
categories: ["并发多线程"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、进程与线程

### 1.1 进程

- 操作系统中的独立执行单元,包括正在执行的程序、数据和系统资源
- **每个进程有独立内存空间,不同进程之间不可以直接共享数据**

### 1.2 线程

- 是进程内的执行单元,是操作系统分配 CPU 时间的基本单位
- **同一个进程内的线程可以共享相同的内存空间和资源**
- **Java 线程与操作系统内核线程是 1:1 映射关系**

### 1.3 两者的区别

| 对比项 | 进程 | 线程 |
|--------|------|------|
| 定位 | 独立的执行单元 | 进程内的执行单元 |
| 内存空间 | 有独立内存空间 | 共享进程的内存空间 |
| 数据共享 | 进程之间通信需要额外机制 | 线程之间可以直接共享数据 |

---

## 二、JDK、JRE 与 JVM

三者的包含关系是:**JDK ⊃ JRE ⊃ JVM**(JDK 包含 JRE,JRE 包含 JVM)。

| 缩写 | 全称 | 说明 |
|------|------|------|
| JVM | Java 虚拟机 | 执行字节码,把字节码解释为机器码 |
| JRE | Java 运行环境 | 包含 JVM + 核心类库 |
| JDK | Java 开发工具包 | 包含 JRE + 编译器等开发工具 |

### HotSpot JVM

HotSpot JVM 是目前 Java 生态中最主流、使用最广泛的 Java 虚拟机(JVM)的具体软件实现。

它的核心之一是**即时编译器(JIT,Just-In-Time Compiler)**:

- 在运行过程中,它会持续监控代码的执行频率。如果某段代码(例如循环体或频繁调用的方法)被执行得非常频繁,就会被标记为「热点代码(Hot Spot Code)」
- 一旦被标记为热点,JVM 就会将这段字节码直接编译成当前操作系统底层的机器码,并进行深度优化。这样后续执行这段代码时,就不需要再通过解释器,从而极大地提高了运行速度

---

## 三、线程创建方式

共 4 种,以下为第 1 种。

### 3.1 继承 Thread 类,重写 run() 方法

```java
package javaExercise.src.Thread_prac;

public class MyThread extends Thread {
    @Override
    public void run() {
        // 要执行的代码
    }
}
```

> 另外 3 种创建方式(实现 `Runnable`、实现 `Callable`、线程池等)待补充。
