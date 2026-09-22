---
title: "Java 方法重载与重写"
date: 2026-09-21T21:49:02+08:00
draft: false
weight: 22
description: "方法重载(Overload)的三个条件、方法重写(Override)的三条硬性规则,以及 @Override 注解的作用。"
tags: ["Java", "重载", "重写", "面向对象"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、重载(Overload)

**条件**

1. 必须在同一个类中
2. 方法名相同
3. 参数列表不同(参数个数 / 参数类型 / 参数顺序,任意一项不同即可)

**注意**

- 返回值类型、访问修饰符**不是**重载条件(可以相同,也可以不同)

---

## 二、重写(Override)

子类中写一个与父类**方法名相同、参数列表相同**的方法。

> 注:父类的 `private` 方法不能被子类重写。

### 2.1 重写硬性规则

1. 子类重写方法的访问权限**不能比父类更严格**(`public` / `protected` / `default` / `private`)
2. 子类重写方法的返回类型:
   - 必须与父类一致,或者
   - 是父类返回类型的子类(协变返回类型)

   > 基本类型和 `void` 没有「子类」概念

3. 子类的参数列表必须与父类相同(个数、类型、顺序都必须一样)

### 2.2 @Override 注解

不是必须,但建议加上:方法名 / 参数写错时会直接报错提醒你。

![@Override 注解示例](/images/java/override-annotation.png)
