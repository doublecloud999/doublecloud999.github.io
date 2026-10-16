---
title: "Java 集合框架:从 Collection 到 Map"
date: 2026-09-21T20:06:39+08:00
draft: false
weight: 50
description: "集合框架的两大层次(Collection 与 Map)、数组复习、Collection 常用方法、Iterator 的 7 条注意、contains 与 equals 的关系、ArrayList 与 LinkedList 的效率对比，以及 Queue 与并发修改异常。"
tags: ["Java", "集合框架", "ArrayList", "LinkedList", "Iterator", "Map"]
categories: ["集合框架"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、总览：什么是集合

<span color="red">集合</span>是一种用于<span color="red">存储和操作一组对象的数据结构</span>。Java 提供了一组接口和类，用于实现和操作各种类型的集合。

Java 的集合框架主要分为两个层次：<span color="red">Collection</span> 和 <span color="red">Map</span>。

![集合框架层次图](/images/java/collection-overview.png)

**Collection 层次包括：**

- <span color="red">List</span>：有序可重复，如 `ArrayList`（底层是数组）、`LinkedList`（底层是双向链表）、`Vector`（类，底层是数组，线程安全，效率低，使用少）
- <span color="red">Set</span>：无序不可重复，如 `HashSet`（底层是 HashMap）、`TreeSet`
- <span color="red">Queue</span>

```java
package javaExercise.collection_test;

import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;

public class iterator_test {
    static void main(String[] args) {

        Collection c = new HashSet();
        c.add("abc");
        c.add("def");
        c.add(100);
        c.add(200);
        c.add(new Object());

        // 怎样遍历这个集合？
        // Iterator 接口
        // Collection 接口的实现类并没有提供统一的方法来遍历内部的元素，
        // 因此，Java 定义了 java.util.Iterator 接口
        Iterator it = c.iterator();// 变量 it 是一个 Iterator 类型的引用，指向这个返回的实例
        while (it.hasNext()) {
            Object obj = it.next();
            System.out.println("object = " + obj);
            // object = abc
            // object = def
            // object = 100
            // object = 200
            // object = java.lang.Object@f6f4d33
        }
    }
}
```

![迭代器遍历集合的输出](/images/java/collection-iterator-output.png)

**Map 层次包括：**

- `Map` 接口和其实现类，用于存储键值对组合：`HashMap`（底层是哈希表）
- `Hashtable`（底层也是哈希表，线程安全，效率低使用少）、`Properties`（线程安全，并且 key 和 value 只能存储 String）
- `TreeMap`（底层是二叉树，TreeMap 集合的 key 可以自动按照大小顺序排序）

其实：`HashSet`、`TreeSet` 的元素分别对应 `HashMap`、`TreeMap` 里面的 key。

**注意：**

- 数组和集合都是存储多个数据的结构，但是数组不属于集合 Collection
- Collection 的元素位置保存的是对象引用，不能直接存储基本的数据类型

---

## 二、常用数据结构：数组

### 2.1 一维数组

![一维数组示意](/images/java/array-1d.png)

### 2.2 二维数组

![二维数组示意](/images/java/array-2d.png)

### 2.3 常用的数组工具

![常用的数组工具](/images/java/array-utils.png)

---

## 三、Collection

### 3.1 能存什么

- <span color="red">Collection 里不能存 Java 基本类型</span>，只能存 Object 类及其子类，只能存 Java 对象的引用（地址）
- 需要 `import java.util.Collection`

### 3.2 常用方法

```java
static void main() {
    // Collection 在没有使用泛型之前，可以存储 Object 类的所有子类型
    // 常用方法
    Collection<String> a = new ArrayList<>(100);
    Collection<Integer> b = new ArrayList<>(100);
    // 创建 ArrayList 类的集合
    // Collection 是接口，a 是 Collection 类的引用变量

    // add();
    a.add("aaa");
    a.add("bbb");

    b.add(100);// 自动装箱
    Integer x = 200;// 自动装箱
    b.add(x);

    // int size;
    System.out.println("a.size(); " + a.size());// 2
    System.out.println("b.size(); " + b.size());// 2

    // void clear
    a.clear();
    System.out.println("a.size(); " + a.size());// 0
    System.out.println("b.size(); " + b.size());// 2

    // boolean contains(Object o) 判断当前集合是否包含元素
    System.out.println(a.contains(10) + "    a.contains(10)");// false    a.contains(10)
    System.out.println(b.contains(100) + "    b.contains(100)");// true    b.contains(100)

    // boolean remove(Object o)
    b.remove(100);
    System.out.println(b.contains(100) + "    b.contains(100)");// false    b.contains(100)

    // boolean isEmpty()
    System.out.println("a.isEmpty()" + a.isEmpty());// a.isEmpty()true
    System.out.println("b.isEmpty()" + b.isEmpty());// b.isEmpty()false

    // Object[] toArray() 将集合转换成数组，你修改新的数组不会对原本的数组造成影响
    a.add("a");
    a.add("a");
    a.add("b");
    a.add("c");
    b.add(10);
    b.add(20);
    b.add(30);

    Object[] o1 = a.toArray();
    for (Object O : o1) {
        System.out.println(O);
        // a
        // a
        // b
        // c
    }

    Object[] o2 = b.toArray();
    for (Object O : o2) {
        System.out.println(O);
        // 200
        // 10
        // 20
        // 30
    }
}
```

### 3.3 迭代器：Iterator

Iterator 是一个接口 interface，没有办法直接实例化（指 `new Iterator()`）。

但是 `c.iterator()` 返回的一定是一个具体类的实例，这个实例实现了 Iterator 接口，它是一个新建出来的对象，能够独立于 c 集合存在。

因此 it 是刚创建出的新对象的引用，这个对象能够记录自己目前遍历到哪里了，也能独立于对象存在。

**注意：**

1. <span color="red">接口不能实例化</span>，也就是说 Iterator 是个接口，你不能 `new Iterator()`
2. 但是接口可以作为变量的数据类型
3. `Iterator it`：
   - Iterator 是<span color="red">编译时类型（声明类型）</span>
   - it 是变量名
   - 这意味着声明的是 Iterator 类型的变量，it 这个变量只能调用 Iterator 接口中定义的方法（`hasNext()`、`next()`、`remove()`）
   - it 是一个实现了 Iterator 接口的对象引用
4. `it.next()`：迭代器 it 一开始指在集合中第一个元素<span color="red">之前</span>，每一次调用 `it.next()` 的时候都会返回指向的元素并且将游标往后移动一次。
   `next()` 方法返回的元素类型：集合 `c` 存了 `"abc"`（String）、`100`（Integer）、`new Object()`。当调用 `it.next()` 时，返回的是这些对象在堆内存中的<span color="red">原始类型引用</span>（即存的是 String，取出来就是 String 对象；存的是 Integer，取出来就是 Integer 对象）。
5. <span color="red">编译时的静态类型</span>：`Object obj = it.next();` 中，因为集合没有指定泛型（或使用了原始类型），`next()` 方法签名返回的是 `Object`，所以变量 `obj` 的编译时类型是 `Object`。
6. <span color="red">输出时的类型转换</span>：`System.out.println(obj);` 接收的是 `Object`。在 `println` 的底层源码中，它会调用 `String.valueOf(obj)`，而 `String.valueOf` 内部又调用了 `obj.toString()`。这就解释了为什么任何对象都能被打印成字符串——并不是对象本身变成了字符串，而是打印方法帮你做了一次转换。
7. 集合的结构改变，迭代器对象必须重新创建

### 3.4 contains 方法

![contains 方法](/images/java/collection-contains.png)

contains 方法底层调用了 `.equals` 方法。

<span color="red">注意，放在集合里面的元素必须重写 equals 方法</span>，不然，contains 底层的 equals 方法就会比较内存地址。

---

## 四、List

由于数组大小固定不方便，所以 Java 标准库提供了 `ArrayList`（动态数组）和 `LinkedList`（双链表），它们都实现了 List 接口，可以动态增删元素。

### 4.1 ArrayList（底层是连续内存的数组）

这是最常用的集合类，底层就是一个自动扩容的数组。

记得要导入包：

```java
import java.util.ArrayList;
import java.util.Collections;
```

![ArrayList 常用操作示例（一）](/images/java/arraylist-1.png)

![ArrayList 常用操作示例（二）](/images/java/arraylist-2.png)

- 泛型里只能写引用类型，不能写基本类型
- Integer 是 int 的包装类，Java 会自动在二者之间转换

**增删改查效率：** 在头部增加或者删除元素的话，要将所有元素往前或者后移动一位，O(n) 的时间复杂度。

### 4.2 LinkedList（底层是双链表实现）

是双链表实现，在头尾增删元素的效率比 ArrayList 效率高。

用法，记得导入包：

```java
import java.util.LinkedList;
```

![LinkedList 常用操作示例](/images/java/linkedlist-1.png)

**增删改查效率：** 在头部增加或者删除的时候只需要改变 first 头指针的指向，以及新旧节点的 prev 和 next 即可，不用改变其他元素，时间复杂度是 O(1)。

需要频繁增删头尾的用 LinkedList，其他时候用 ArrayList。

---

## 五、Map

<span color="red">key、value 存储，都是存 Java 内存地址，所有 key 都是无需不可重复的；Map 集合的 key 就是 Set 集合</span>。

Map 存储键值对，通过 key 快速查找 value。（补充：<span color="red">Map 不是 Collection 的子接口</span>，它自成一套体系）

- `HashMap`：底层是哈希表数据结构
- `Hashtable`：底层也是哈希表，线程安全，效率低，使用少；是 `Properties` 的父类
- `SortedMap`：是 `TreeMap` 的父类

---

## 六、Queue（队列，接口）

队列是无序的，但是双端队列（也是接口）是有序的。

双端队列实现：

- `ArrayDeque`，用数组实现
- `LinkedList`，用双向链表实现

普通队列：队头只能删除，队尾只能插入。

![队列结构示意](/images/java/collection-queue.png)

---

## 七、补充说明

- 集合不能存储基本的数据类型，也不能直接存储 Java 对象
  - 集合中存储的都是 Java 对象的内存地址
  - 例如 `list.add(100);` 会自动装箱为 Integer
- 集合类都在 `java.util.*` 包下（所有集合类和集合接口都在 java.util 下面）

![java.util 包下的集合](/images/java/collection-java-util.png)

### 7.1 并发修改异常

用迭代器的 `remove()` 方法是可以的，用集合自己的 `remove()` 方法就会报这个异常。

### 7.2 所有集合的根接口

所有集合继承 <span color="red">Iterable</span> 接口（所有接口都是可迭代的）。

对象通过调用 Iterable 的 `iterator` 方法拿到迭代器，然后可以通过迭代器的三个方法来进行集合元素的迭代 / 遍历。
