---title: "Java 细节拾遗:编码、快捷键与其他"
date: 2026-10-15T10:20:00+08:00
draft: false
weight: 13
description: "return 里 new 对象、sc.close()、IDEA 快捷键、main 的 args、编码与字节数、native、.length 与 .length() 等零散但常被问到的细节。"
tags: ["Java", "细节", "编码", "基础语法"]
categories: ["语法基础"]
ShowToc: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java-misc-details/"]
---

## 一、return 里也能 new 对象

`return` 的时候还能 new 对象。

假如声明一个方法的返回值类型是 `Person`(Person 是个类)，那么返回时既可以返回一个已有的 Person 对象，也可以返回 Person 类的**子类**对象。这个对象的来源有两种:

1. 已有的对象
2. 在 return 语句中 new 出来的对象

## 二、sc.close()

在不再用 `sc` 读数据时调用，它会将底层的 `System.in` 也关闭。

为了代码安全，写项目时要写。

## 三、IDEA 快捷键

- 在括号内按 `Ctrl+P`，可以直接查看该填什么参数
- 选中后按 `Alt+Insert` 生成 set/get 方法
  - 注意:对于 `boolean` 类型的变量，生成的 getter 方法名比较特殊，叫做 `isXxx()`
- 按两次 `Shift` 调出界面 Search Everywhere(随处搜索)

## 四、main 方法中的 args

```java
public static void main(String[] args)
```

`args` 是一个 `String[]` 字符串数组:

- 默认情况下长度为 0
- 用来接收命令行参数，增强交互

## 五、编码与字节数

在 ASCII 码中，一个英文字母不分大小写，都占用一个字节的空间。**GBK 编码**中一个中文汉字占两个字节。

| 编码 | 一个英文字符 | 一个中文汉字 |
|---|---|---|
| ASCII | 1 字节 | 不含中文 |
| UTF-8 | 1 字节 | 3 字节 |
| Unicode | 2 字节 | 2 字节 |

Java 用的是 **Unicode 编码**。

## 六、native

`native` 的底层是 **C++** 实现。

## 七、子类不能抛出比父类更多的异常

子类不能抛出比父类更多的异常。

## 八、类加载

- 类加载
- 类加载器:读取字节码(`.class` 文件)

> 原文此处未写完。

## 九、.length 与 .length()

| 类型 | 取长度的方式 |
|---|---|
| 数组 | `.length` |
| String | `.length()` |
