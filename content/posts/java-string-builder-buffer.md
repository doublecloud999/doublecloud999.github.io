---
title: "Java 字符串三兄弟:String、StringBuilder 与 StringBuffer"
date: 2026-09-21T21:49:02+08:00
draft: false
weight: 28
description: "String 为何不可变、new String(\"abc\") 创建几个对象、StringBuilder 的底层扩容机制与 I/O 优化,以及 StringBuilder 与 StringBuffer 的取舍。"
tags: ["Java", "String", "StringBuilder", "StringBuffer", "字符串"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、String

是不可变的字符序列,用来表示字符串常量。

因为不可变,保证了线程安全、哈希值缓存、字符串常量池复用。

`String` 类被 `final` 修饰,不提供修改方法,用 `byte[]` 加编码标记。

字符串拼接在循环中会产生大量临时对象;`String` 是常量,修改会创建新对象。

![String 示意](/images/java/string-immutable.png)

### 面试题:`String s = new String("abc")` 创建几个对象(1 或 2 个)

- 如果字符串常量池中已经有 `"abc"`,就只在堆中创建一个 `String` 对象
- 如果字符串常量池中没有 `"abc"`,就需要先在字符串常量池创建一个 `"abc"`,然后再去堆中创建一个 `"abc"`

另:`String` 是不可变的,任何看起来修改 `String` 的操作实际上都是创建了新的 `String` 对象。这是为了线程安全、支持字符串常量池共享、缓存哈希值。

---

## 二、StringBuilder

### 2.1 为什么需要它

平时输出用 `System.out.println()`;每一次 `println`,系统都需要去调用系统底层的 I/O 接口,这个动作极其缓慢。

而 `StringBuilder` 能够减少 I/O 调用次数,属于 `java.lang` 包,**不需要 import**,直接就可以用。

### 2.2 机制

内部维护了一个可扩容的 `byte[]` 数组。

- 当你调用 `sb.append()` 时,它仅仅是在 JVM 的堆内存中修改这个底层数组的元素,并更新内部的 `count`(长度)变量
- 这个过程完全是用户态的内存操作,**不涉及任何操作系统的 I/O 系统调用**,其时间复杂度为摊销后的 **O(1)**。而且它不会像不可变的 `String` 那样每次拼接都创建新对象,从而避免了频繁触发垃圾回收(GC)

### 2.3 特性

- 可变的字符序列,**线程不安全**,多线程环境下需要加锁,扩容有性能开销,需要预设容量;但是性能高
- 用于频繁的字符串拼接操作,避免产生大量临时 `String` 对象
- 内部维护的是可扩容的字符数组,默认容量 **16**,扩容时新容量为**旧容量 × 2 + 2**

![StringBuilder 扩容示意](/images/java/stringbuilder-capacity.png)

**注意**

1. `StringBuilder` 扩容时数组怎么复制?用 `Arrays.copyOf()` 方法复制原数组到新数组
2. 如何优化 `StringBuilder` 的性能?如果预知字符串大概长度,创建时直接指定初始容量,避免多次扩容和数组复制

---

## 三、StringBuffer

是可变的字符序列,**线程安全**,但性能略低于 `StringBuilder`。扩容机制与 `StringBuilder` 一样。

`StringBuffer` 的所有公开方法(如 `append`、`insert`、`delete`)都加了 `synchronized` 锁,保证同一时刻只有一个线程能操作它,所以安全。

### 3.1 与 StringBuilder 的区别

| | StringBuilder | StringBuffer |
|---|---|---|
| 线程安全 | 不安全 | 安全 |
| 性能 | 高 | 不高 |
| 适用场景 | 单线程 | 多线程 |

**注意**

1. 为什么 `StringBuilder` 比 `StringBuffer` 快?答案是 `StringBuilder` 不需要获取和释放锁,没有多线程锁竞争带来的性能开销。如果单线程环境误用 `StringBuffer`,会导致不必要的性能损耗
2. **锁的粒度**:指锁保护的范围大小,是整个对象。`StringBuffer` 的锁加在方法上,只要调用任何一个方法都会锁住整个对象,并发性能比较差;要优化就要减小锁的粒度
