---
title: "Java final、finally 与 finalize"
date: 2026-09-21T21:49:02+08:00
draft: false
weight: 27
description: "final 修饰类/方法/变量的规则、finalize 为何被弃用,以及 finally 与 return 的返回值覆盖机制(基本类型与引用类型的差异)。"
tags: ["Java", "final", "finally", "finalize", "面向对象"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、final

表示不可变性,可以用于类、方法、变量等不同的上下文。使用 `final` 关键字标记的元素**只能被赋值一次**,而且必须显式赋值,不能被继承、修改、重写、重新赋值。

**1. 基本类型变量:值不能被修改**

**2. 引用类型的变量:地址绝对不能变,但是地址里存的东西可以变**

```java
final int[] arr = new int[]{1, 2, 3};
// 可以：arr[0] = 1;
// 不可以：arr = new int[]{4, 5};
```

**3. 不可变方法 —— 不可被重写**

```java
public final void f_Method() {
}
```

不能被子类重写。

> 注:`private` 方法加 `final` 没意义。`private` 方法对子类不可见,即便子类中重新写了一个一模一样的方法也不会报错,不算重写,这算子类写的新方法。

**4. final 类 —— 不能被继承**

```java
public final class FClass {
}
```

注意,`final` 类中的所有方法都是隐式 `final` 的。但是类内字段(类内没有自己另加 `final` 的字段)不受影响,基本类型能随便改值,引用类型能随便改指向的地址。

**5. `final` 方法绝对不能是抽象的**

---

## 二、finalize

`Object` 类的方法,在垃圾回收器回收对象之前调用,用于清理资源,但是**已经弃用**。

---

## 三、finally

是异常处理机制的一部分。只要 `try` 或者 `catch` 没有调用 `System.exit()` 导致 JVM 直接退出,`finally` 代码块就必须执行,无论是否发生异常。

在 `try` 或 `catch` 中执行 `return` 时,**不会立刻结束方法,返回值暂存**,JVM 去执行 `finally` 代码块(如果有)。如果 `finally` 代码块中也有 `return` 语句,就用 `finally` 代码块的 return 值替代之前暂存的返回值,这叫**返回值覆盖**;如果 `finally` 中抛出异常,这个异常会覆盖之前的返回值,直接抛出异常。

- 如果返回值是**基本类型**(`int` 等),那么 JVM 暂存的是这个值的**副本**。`finally` 语句中如果修改这个基本类型变量,暂存区中的值(副本)不会改变,最终返回的还是原值
- 如果返回值是**引用类型**,那么 JVM 暂存的是这个引用对象的**地址的副本**
  - `finally` 语句中如果修改这个引用对象,给它重新赋值,那副本中的地址不变,返回值也不变
  - `finally` 语句中如果改的是这个引用对象的地址中存的东西(比如改变引用变量内部对象的属性,修改字段,增加方法等),那么暂存的返回值也会变

![finally 与引用类型返回值](/images/java/finally-return-ref.png)
