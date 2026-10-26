---title: "Java 异常处理"
date: 2026-09-21T21:49:02+08:00
draft: false
weight: 30
description: "RuntimeException 与 CheckedException 的区别(结论、成因、底层原理与边界条件),以及 throw / throws / try-catch / try-finally 的核心语法。"
tags: ["Java", "异常", "异常处理"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java-exception-handling/"]
---

## 一、RuntimeException(运行时异常)

1. **结论**:`RuntimeException` 是**未检查异常**,编译时不需要强制处理
2. **为什么**:通常由程序逻辑错误引起,如空指针、数组越界,应在编码阶段避免
3. **底层原理**:继承自 `Exception`,但 JVM 不强制要求捕获。编译器在字节码生成时不检查 `RuntimeException` 的捕获
4. **边界条件**:可以捕获,但通常不建议捕获,应修复代码。如 `NullPointerException`、`IndexOutOfBoundsException`

---

## 二、CheckedException(检查时异常)

1. **结论**:`CheckedException` 是**检查时异常**,编译时强制要求处理
2. **为什么**:通常由外部环境引起,如文件不存在、网络中断,程序无法完全控制
3. **底层原理**:继承自 `Exception` 但不继承 `RuntimeException` 的类。编译器在编译时检查方法签名中的 `throws` 子句或 `try-catch` 块
4. **边界条件**:必须使用 `try-catch` 捕获或使用 `throws` 声明抛出;如 `IOException`、`SQLException`。不处理会直接编译报错

---

## 三、两者的对比

| | RuntimeException | CheckedException |
|---|---|---|
| 是否强制处理 | 否,编译时不需要 | 是,编译时强制 |
| 典型成因 | 程序逻辑错误(空指针、数组越界) | 外部环境问题(文件不存在、网络中断) |
| 常见例子 | `NullPointerException`、`IndexOutOfBoundsException` | `IOException`、`SQLException` |
| 建议做法 | 通常不建议捕获,应修复代码 | 必须捕获或声明抛出 |

---

## 四、核心语法

`throws`、`throw`、`try...catch`、`try...finally`、`try...catch...finally`

1. **结论**:这是 Java 异常处理的核心语法
2. **为什么**:`throws` 用于声明方法可能抛出的异常;`throw` 用于手动抛出异常对象;`try...catch` 用于捕获并处理异常;`try...finally` 用于确保资源释放;`try...catch...finally` 结合两者
3. **底层原理**:`throw` 在字节码中对应 `athrow` 指令。`try...catch` 通过异常表(Exception Table)实现,指定字节码范围、异常类型和处理代码偏移量。`finally` 通过复制代码或 `jsr` / `ret` 指令实现
4. **边界条件**:`throw` 后不能有代码;`throws` 可以声明多个异常;`try` 块必须至少有一个 `catch` 或 `finally`;`try...finally` 没有 `catch` 时异常会向上抛出,但 `finally` 仍执行

### try-catch-finally 如何使用?

![try-catch-finally 的使用](/images/java/try-catch-finally-javaguide.png)

<span color="red">注意:</span>如果在 finally 之前虚拟机被终止运行、或者进程被强制终止的话,finally 代码块就不会执行。

![finally 不执行的情况](/images/java/finally-notice.png)
