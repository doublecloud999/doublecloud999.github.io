---title: "Java 类与对象基础:this、包、访问权限与封装"
date: 2026-09-21T21:49:02+08:00
draft: false
weight: 21
description: "this 关键字的作用与用法、package 与 import 的意义、类与成员的访问修饰符,以及封装的三条原则。"
tags: ["Java", "this", "封装", "访问修饰符", "面向对象"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java-class-object-basics/"]
---

## 一、this 关键字

**作用**

- 引用「当前对象」
- 用来访问当前对象的成员变量和方法
- 避免局部变量与成员变量同名导致的混淆

**常见用法**

1. 访问当前对象的成员变量:`this.xxx`
2. 调用构造方法:`this(...)`

**注意**

- 绝对不能在静态方法中使用
- 在构造器中如果使用 `this()` 调用其他构造器,必须放在构造器的第一行

---

## 二、import 与 package

### 2.1 import

- `import 包名.*`:导入包下所有类
- `import 包名.类名`:导入包下某个类

### 2.2 package

**作用**

1. 给代码分类
2. 避免类名冲突(不同包可以有同名类)
3. 控制访问权限(不同包之间默认不能随便访问)

---

## 三、访问修饰符与封装

### 3.1 顶级类(最外层 `class X`)的访问权限

- `public`:可跨包访问(跨包时通常需要 `import`)
- `default`:不写时的默认值;仅同包可访问,跨包不可

### 3.2 类内字段 / 方法 / 构造方法的访问权限

由具体修饰符决定:

![访问权限表](/images/java/access-modifier-table.png)

### 3.3 封装(Encapsulation)

将数据与操作方法封装在对象内部,限制外部直接访问。

**原则**

1. **访问控制**:变量私有化(`private`),通过公共方法访问 / 修改
2. **数据验证**:在 `set` 方法中校验数据合法性
3. **最小暴露原则**:只暴露必要的方法,不需要的保持私有

### 3.4 成员变量访问修饰符示意

![成员变量访问修饰符](/images/java/field-access-modifier.png)
