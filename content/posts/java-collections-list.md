---
title: "Java 集合框架与 List"
date: 2026-09-21T20:06:39+08:00
draft: false
weight: 50
description: "Java 集合框架的层次结构(Collection 与 Map),常用数据结构复习,以及 ArrayList 与 LinkedList 的底层实现和增删改查效率对比。"
tags: ["Java", "集合框架", "ArrayList", "LinkedList", "数据结构"]
categories: ["集合框架"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、常用数据结构

### 1.1 数组

**一维数组**

![一维数组示意](/images/java/array-1d.png)

**二维数组**

![二维数组示意](/images/java/array-2d.png)

**常用的数组工具**

![常用数组工具](/images/java/array-utils.png)

---

## 二、真正的集合

集合是一种用于存储和操作一组对象的数据结构。Java 提供了一组接口和类,用于实现和操作各种类型的集合。

Java 的集合框架主要分为两个层次:**Collection** 和 **Map**。

**Collection 层次包括:**

- **List**:有序可重复,如 `ArrayList`、`LinkedList`
- **Set**:无序不可重复,如 `HashSet`、`TreeSet`
- **Queue**

**Map 层次包括:**

- `Map` 接口及其实现类,用于存储键值对组合,例如 `HashMap`、`TreeMap`

---

## 三、List

由于数组大小固定、使用不方便,Java 标准库提供了 `ArrayList`(动态数组)和 `LinkedList`(双链表),它们都实现了 `List` 接口,可以动态增删元素。

### 3.1 ArrayList(底层是连续内存的数组)

这是最常用的集合类,底层就是一个自动扩容的数组。

记得导入包:

```java
import java.util.ArrayList;
import java.util.Collections;
```

![ArrayList 常用操作示例(一)](/images/java/arraylist-1.png)

![ArrayList 常用操作示例(二)](/images/java/arraylist-2.png)

- 泛型里只能写引用类型,不能写基本类型
- `Integer` 是 `int` 的包装类,Java 会自动在二者之间转换

**增删改查效率**:在头部增加或者删除元素,需要将所有元素往前或往后移动一位,时间复杂度 **O(n)**。

### 3.2 LinkedList(底层是双链表实现)

是双链表实现,在头尾增删元素的效率比 `ArrayList` 高。

用法(记得导入包):

```java
import java.util.LinkedList;
```

![LinkedList 常用操作示例](/images/java/linkedlist-1.png)

**增删改查效率**:在头部增加或者删除时,只需要改变 `first` 头指针的指向,以及新旧节点的 `prev` 和 `next` 即可,不用移动其他元素,时间复杂度是 **O(1)**。

> **选用建议**:需要频繁增删头尾元素的用 `LinkedList`,其他时候用 `ArrayList`。

---

## 四、Map

Map 存储键值对,只通过 key 快速查找 value。

### 4.1 HashMap

> 待补充。
