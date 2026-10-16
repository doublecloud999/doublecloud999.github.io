---
title: "Java 数组工具类 Arrays 与 for-each"
date: 2026-10-15T10:17:00+08:00
draft: false
weight: 12
description: "Arrays.toString / equals 与数组扩容，Arrays.equals 的比较逻辑，以及增强 for 的三个坑。"
tags: ["Java", "数组", "Arrays", "for-each", "基础语法"]
categories: ["语法基础"]
ShowToc: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、数组

- 可变长参数
- 数组工具类 `Arrays` 的 `toString()` 和 `equals()`
- 数组的扩容:`System.arraycopy();`

![数组扩容：System.arraycopy](/images/java/arrays-system-arraycopy.png)

## 二、数组的 equals 比较

![Arrays.equals 的比较逻辑](/images/java/arrays-equals.png)

只要 `a == a2`，`==` 成立意味着内存地址相等，所以不用比。

- 如果有任何一个是 `null` 空，返回 `false`
- 如果二者 length 不等，`false`
- 最后调用 `mismatch`，把两个数组和长度传进去，逐个对比每一个元素，只要有一个元素不相等，`mismatch` 会返回该下标；如果 `mismatch` 方法的返回值大于等于 0，那么一定说明这里面有不等的元素

## 三、Arrays 工具类

在 JDK 类库当中提供了一个工具类 `java.util.Arrays`。

这个工具类的构造方法是私有化的，因为工具类中所有的构造方法都是静态的，调用的时候不需要 new 对象。

![Arrays 工具类](/images/java/arrays-utils-class.png)

## 四、for-each(基础写法)

```java
for (类型名 变量名 : 数组或集合) {
}
```

**缺点:** 没有下标。

可用于数组、链表、`Map`、`Set`。

### 注意

- 增强 for 只能顺序遍历，不能直接拿到下标。需要索引时用普通 for
- **遍历时不要修改集合结构**
- **修改循环变量不会影响原数组 / 集合**

```java
for (String s : list) {
    s = "X"; // 不会改变 list 中的元素
}
```

但如果是对象，可以修改对象内部属性:

```java
for (User u : userList) {
    u.setName("Tom"); // 会影响原对象
}
```

## 五、字符串的构造方法

(待补充)

## 六、正则表达式

(待补充)
